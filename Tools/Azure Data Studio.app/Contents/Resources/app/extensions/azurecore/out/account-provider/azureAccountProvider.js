/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const adal = require("adal-node");
const sqlops = require("sqlops");
const request = require("request");
const nls = require("vscode-nls");
const vscode = require("vscode");
const url = require("url");
const localize = nls.loadMessageBundle(__filename);
class AzureAccountProvider {
    constructor(_metadata, _tokenCache) {
        this._metadata = _metadata;
        this._tokenCache = _tokenCache;
        this._args = {
            host: this._metadata.settings.host,
            clientId: this._metadata.settings.clientId
        };
        this._autoOAuthCancelled = false;
        this._inProgressAutoOAuth = null;
        this._isInitialized = false;
        this._commonAuthorityUrl = url.resolve(this._metadata.settings.host, AzureAccountProvider.AadCommonTenant);
    }
    // PUBLIC METHODS //////////////////////////////////////////////////////
    autoOAuthCancelled() {
        return this.doIfInitialized(() => this.cancelAutoOAuth());
    }
    /**
     * Clears all tokens that belong to the given account from the token cache
     * @param {"data".AccountKey} accountKey Key identifying the account to delete tokens for
     * @returns {Thenable<void>} Promise to clear requested tokens from the token cache
     */
    clear(accountKey) {
        return this.doIfInitialized(() => this.clearAccountTokens(accountKey));
    }
    /**
     * Clears the entire token cache. Invoked by command palette action.
     * @returns {Thenable<void>} Promise to clear the token cache
     */
    clearTokenCache() {
        return this._tokenCache.clear();
    }
    getSecurityToken(account, resource) {
        return this.doIfInitialized(() => this.getAccessTokens(account, resource));
    }
    initialize(restoredAccounts) {
        let self = this;
        let rehydrationTasks = [];
        for (let account of restoredAccounts) {
            // Purge any invalid accounts
            if (!account) {
                continue;
            }
            // Refresh the contextual logo based on whether the account is a MS account
            account.displayInfo.accountType = account.properties.isMsAccount
                ? AzureAccountProvider.MicrosoftAccountType
                : AzureAccountProvider.WorkSchoolAccountType;
            // Attempt to get fresh tokens. If this fails then the account is stale.
            // NOTE: Based on ADAL implementation, getting tokens should use the refresh token if necessary
            let task = this.getAccessTokens(account, sqlops.AzureResource.ResourceManagement)
                .then(() => {
                return account;
            }, () => {
                account.isStale = true;
                return account;
            });
            rehydrationTasks.push(task);
        }
        // Collect the rehydration tasks and mark the provider as initialized
        return Promise.all(rehydrationTasks)
            .then(accounts => {
            self._isInitialized = true;
            return accounts;
        });
    }
    prompt() {
        return this.doIfInitialized(() => this.signIn(true));
    }
    refresh(account) {
        return this.doIfInitialized(() => this.signIn(false));
    }
    // PRIVATE METHODS /////////////////////////////////////////////////////
    cancelAutoOAuth() {
        let self = this;
        if (!this._inProgressAutoOAuth) {
            console.warn('Attempted to cancel auto OAuth when auto OAuth is not in progress!');
            return Promise.resolve();
        }
        // Indicate oauth was cancelled by the user
        let inProgress = self._inProgressAutoOAuth;
        self._autoOAuthCancelled = true;
        self._inProgressAutoOAuth = null;
        // Use the auth context that was originally used to open the polling request, and cancel the polling
        let context = inProgress.context;
        context.cancelRequestToGetTokenWithDeviceCode(inProgress.userCodeInfo, err => {
            // Callback is only called in failure scenarios.
            if (err) {
                console.warn(`Error while cancelling auto OAuth: ${err}`);
            }
        });
        return Promise.resolve();
    }
    clearAccountTokens(accountKey) {
        // Put together a query to look up any tokens associated with the account key
        let query = { userId: accountKey.accountId };
        // 1) Look up the tokens associated with the query
        // 2) Remove them
        return this._tokenCache.findThenable(query)
            .then(results => this._tokenCache.removeThenable(results));
    }
    doIfInitialized(op) {
        return this._isInitialized
            ? op()
            : Promise.reject(localize(0, null));
    }
    getAccessTokens(account, resource) {
        let self = this;
        const resourceIdMap = new Map([
            [sqlops.AzureResource.ResourceManagement, self._metadata.settings.armResource.id],
            [sqlops.AzureResource.Sql, self._metadata.settings.sqlResource.id]
        ]);
        let accessTokenPromises = [];
        let tokenCollection = {};
        for (let tenant of account.properties.tenants) {
            let promise = new Promise((resolve, reject) => {
                let authorityUrl = url.resolve(self._metadata.settings.host, tenant.id);
                let context = new adal.AuthenticationContext(authorityUrl, null, self._tokenCache);
                context.acquireToken(resourceIdMap.get(resource), tenant.userId, self._metadata.settings.clientId, (error, response) => {
                    // Handle errors first
                    if (error) {
                        // TODO: We'll assume for now that the account is stale, though that might not be accurate
                        account.isStale = true;
                        sqlops.accounts.accountUpdated(account);
                        reject(error);
                        return;
                    }
                    // We know that the response was not an error
                    let tokenResponse = response;
                    // Generate a token object and add it to the collection
                    tokenCollection[tenant.id] = {
                        expiresOn: tokenResponse.expiresOn,
                        resource: tokenResponse.resource,
                        token: tokenResponse.accessToken,
                        tokenType: tokenResponse.tokenType
                    };
                    resolve();
                });
            });
            accessTokenPromises.push(promise);
        }
        // Wait until all the tokens have been acquired then return the collection
        return Promise.all(accessTokenPromises)
            .then(() => tokenCollection);
    }
    getDeviceLoginUserCode() {
        let self = this;
        // Create authentication context and acquire user code
        return new Promise((resolve, reject) => {
            let context = new adal.AuthenticationContext(self._commonAuthorityUrl, null, self._tokenCache);
            context.acquireUserCode(self._metadata.settings.signInResourceId, self._metadata.settings.clientId, vscode.env.language, (err, response) => {
                if (err) {
                    reject(err);
                }
                else {
                    let result = {
                        context: context,
                        userCodeInfo: response
                    };
                    resolve(result);
                }
            });
        });
    }
    getDeviceLoginToken(oAuth, isAddAccount) {
        let self = this;
        // 1) Open the auto OAuth dialog
        // 2) Begin the acquiring token polling
        // 3) When that completes via callback, close the auto oauth
        let title = isAddAccount ?
            localize(1, null, self._metadata.displayName) :
            localize(2, null, self._metadata.displayName);
        return sqlops.accounts.beginAutoOAuthDeviceCode(self._metadata.id, title, oAuth.userCodeInfo.message, oAuth.userCodeInfo.userCode, oAuth.userCodeInfo.verificationUrl)
            .then(() => {
            return new Promise((resolve, reject) => {
                let context = oAuth.context;
                context.acquireTokenWithDeviceCode(self._metadata.settings.signInResourceId, self._metadata.settings.clientId, oAuth.userCodeInfo, (err, response) => {
                    if (err) {
                        if (self._autoOAuthCancelled) {
                            // Auto OAuth was cancelled by the user, indicate this with the error we return
                            reject({ userCancelledSignIn: true });
                        }
                        else {
                            // Auto OAuth failed for some other reason
                            sqlops.accounts.endAutoOAuthDeviceCode();
                            reject(err);
                        }
                    }
                    else {
                        sqlops.accounts.endAutoOAuthDeviceCode();
                        resolve(response);
                    }
                });
            });
        });
    }
    getTenants(userId, homeTenant) {
        let self = this;
        // 1) Get a token we can use for looking up the tenant IDs
        // 2) Send a request to the ARM endpoint (the root management API) to get the list of tenant IDs
        // 3) For all the tenants
        //    b) Get a token we can use for the AAD Graph API
        //    a) Get the display name of the tenant
        //    c) create a tenant object
        // 4) Sort to make sure the "home tenant" is the first tenant on the list
        return this.getToken(userId, AzureAccountProvider.AadCommonTenant, this._metadata.settings.armResource.id)
            .then((armToken) => {
            let tenantUri = url.resolve(self._metadata.settings.armResource.endpoint, 'tenants?api-version=2015-01-01');
            return self.makeWebRequest(armToken, tenantUri);
        })
            .then((tenantResponse) => {
            let promises = tenantResponse.map(value => {
                return self.getToken(userId, value.tenantId, self._metadata.settings.graphResource.id)
                    .then((graphToken) => {
                    let tenantDetailsUri = url.resolve(self._metadata.settings.graphResource.endpoint, value.tenantId + '/');
                    tenantDetailsUri = url.resolve(tenantDetailsUri, 'tenantDetails?api-version=2013-04-05');
                    return self.makeWebRequest(graphToken, tenantDetailsUri);
                })
                    .then((tenantDetails) => {
                    return {
                        id: value.tenantId,
                        userId: userId,
                        displayName: tenantDetails.length && tenantDetails[0].displayName
                            ? tenantDetails[0].displayName
                            : localize(3, null)
                    };
                });
            });
            return Promise.all(promises);
        })
            .then((tenants) => {
            let homeTenantIndex = tenants.findIndex(tenant => tenant.id === homeTenant);
            if (homeTenantIndex >= 0) {
                let homeTenant = tenants.splice(homeTenantIndex, 1);
                tenants.unshift(homeTenant[0]);
            }
            return tenants;
        });
    }
    /**
     * Retrieves a token for the given user ID for the specific tenant ID. If the token can, it
     * will be retrieved from the cache as per the ADAL API. AFAIK, the ADAL API will also utilize
     * the refresh token if there aren't any unexpired tokens to use.
     * @param {string} userId ID of the user to get a token for
     * @param {string} tenantId Tenant to get the token for
     * @param {string} resourceId ID of the resource the token will be good for
     * @returns {Thenable<TokenResponse>} Promise to return a token. Rejected if retrieving the token fails.
     */
    getToken(userId, tenantId, resourceId) {
        let self = this;
        return new Promise((resolve, reject) => {
            let authorityUrl = url.resolve(self._metadata.settings.host, tenantId);
            let context = new adal.AuthenticationContext(authorityUrl, null, self._tokenCache);
            context.acquireToken(resourceId, userId, self._metadata.settings.clientId, (error, response) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(response);
                }
            });
        });
    }
    /**
     * Performs a web request using the provided bearer token
     * @param {TokenResponse} accessToken Bearer token for accessing the provided URI
     * @param {string} uri URI to access
     * @returns {Thenable<any>} Promise to return the deserialized body of the request. Rejected if error occurred.
     */
    makeWebRequest(accessToken, uri) {
        return new Promise((resolve, reject) => {
            // Setup parameters for the request
            // NOTE: setting json true means the returned object will be deserialized
            let params = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken.accessToken}`
                },
                json: true
            };
            // Setup the callback to resolve/reject this promise
            let callback = (error, response, body) => {
                if (error || body.error) {
                    reject(error || JSON.stringify(body.error));
                }
                else {
                    resolve(body.value);
                }
            };
            // Make the request
            request.get(uri, params, callback);
        });
    }
    signIn(isAddAccount) {
        let self = this;
        // 1) Get the user code for this login
        // 2) Get an access token from the device code
        // 3) Get the list of tenants
        // 4) Generate the AzureAccount object and return it
        let tokenResponse = null;
        return this.getDeviceLoginUserCode()
            .then((result) => {
            self._autoOAuthCancelled = false;
            self._inProgressAutoOAuth = result;
            return self.getDeviceLoginToken(self._inProgressAutoOAuth, isAddAccount);
        })
            .then((response) => {
            tokenResponse = response;
            self._autoOAuthCancelled = false;
            self._inProgressAutoOAuth = null;
            return self.getTenants(tokenResponse.userId, tokenResponse.userId);
        })
            .then((tenants) => {
            // Figure out where we're getting the identity from
            let identityProvider = tokenResponse.identityProvider;
            if (identityProvider) {
                identityProvider = identityProvider.toLowerCase();
            }
            // Determine if this is a microsoft account
            let msa = identityProvider && (identityProvider.indexOf('live.com') !== -1 ||
                identityProvider.indexOf('live-int.com') !== -1 ||
                identityProvider.indexOf('f8cdef31-a31e-4b4a-93e4-5f571e91255a') !== -1 ||
                identityProvider.indexOf('ea8a4392-515e-481f-879e-6571ff2a8a36') !== -1);
            // Calculate the display name for the user
            let displayName = (tokenResponse.givenName && tokenResponse.familyName)
                ? `${tokenResponse.givenName} ${tokenResponse.familyName}`
                : tokenResponse.userId;
            // Calculate the home tenant display name to use for the contextual display name
            let contextualDisplayName = msa
                ? localize(4, null)
                : tenants[0].displayName;
            // Calculate the account type
            let accountType = msa
                ? AzureAccountProvider.MicrosoftAccountType
                : AzureAccountProvider.WorkSchoolAccountType;
            return {
                key: {
                    providerId: self._metadata.id,
                    accountId: tokenResponse.userId
                },
                name: tokenResponse.userId,
                displayInfo: {
                    accountType: accountType,
                    contextualDisplayName: contextualDisplayName,
                    displayName: displayName
                },
                properties: {
                    isMsAccount: msa,
                    tenants: tenants
                },
                isStale: false
            };
        });
    }
}
// CONSTANTS ///////////////////////////////////////////////////////////
AzureAccountProvider.WorkSchoolAccountType = 'work_school';
AzureAccountProvider.MicrosoftAccountType = 'microsoft';
AzureAccountProvider.AadCommonTenant = 'common';
exports.AzureAccountProvider = AzureAccountProvider;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/887f4e8985023602e599cf86bdb44df48bb28569/extensions/azurecore/out/account-provider/azureAccountProvider.js.map
