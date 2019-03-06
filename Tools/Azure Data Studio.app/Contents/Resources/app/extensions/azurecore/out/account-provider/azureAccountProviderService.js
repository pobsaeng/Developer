/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const constants = require("../constants");
const sqlops = require("sqlops");
const events = require("events");
const nls = require("vscode-nls");
const path = require("path");
const vscode = require("vscode");
const tokenCache_1 = require("./tokenCache");
const providerSettings_1 = require("./providerSettings");
const azureAccountProvider_1 = require("./azureAccountProvider");
let localize = nls.loadMessageBundle(__filename);
class AzureAccountProviderService {
    constructor(_context, _userStoragePath) {
        this._context = _context;
        this._userStoragePath = _userStoragePath;
        this._accountDisposals = {};
        this._accountProviders = {};
        this._configChangePromiseChain = Promise.resolve();
        this._currentConfig = null;
        this._event = new events.EventEmitter();
    }
    // PUBLIC METHODS //////////////////////////////////////////////////////
    activate() {
        let self = this;
        // Register commands
        this._context.subscriptions.push(vscode.commands.registerCommand(AzureAccountProviderService.CommandClearTokenCache, () => { self._event.emit(AzureAccountProviderService.CommandClearTokenCache); }));
        this._event.on(AzureAccountProviderService.CommandClearTokenCache, () => { self.onClearTokenCache(); });
        // 1) Get a credential provider
        // 2a) Store the credential provider for use later
        // 2b) Register the configuration change handler
        // 2c) Perform an initial config change handling
        return sqlops.credentials.getProvider(AzureAccountProviderService.CredentialNamespace)
            .then(credProvider => {
            self._credentialProvider = credProvider;
            self._context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(self.onDidChangeConfiguration, self));
            self.onDidChangeConfiguration();
            return true;
        });
    }
    dispose() { }
    // PRIVATE HELPERS /////////////////////////////////////////////////////
    onClearTokenCache() {
        let self = this;
        let promises = providerSettings_1.default.map(provider => {
            return self._accountProviders[provider.metadata.id].clearTokenCache();
        });
        return Promise.all(promises)
            .then(() => {
            let message = localize(0, null);
            vscode.window.showInformationMessage(`${constants.extensionName}: ${message}`);
        }, err => {
            let message = localize(1, null);
            vscode.window.showErrorMessage(`${constants.extensionName}: ${message}: ${err}`);
        });
    }
    onDidChangeConfiguration() {
        let self = this;
        // Add a new change processing onto the existing promise change
        this._configChangePromiseChain = this._configChangePromiseChain.then(() => {
            // Grab the stored config and the latest config
            let newConfig = vscode.workspace.getConfiguration(AzureAccountProviderService.ConfigurationSection);
            let oldConfig = self._currentConfig;
            self._currentConfig = newConfig;
            // Determine what providers need to be changed
            let providerChanges = [];
            for (let provider of providerSettings_1.default) {
                // If the old config doesn't exist, then assume everything was disabled
                // There will always be a new config value
                let oldConfigValue = oldConfig
                    ? oldConfig.get(provider.configKey)
                    : false;
                let newConfigValue = newConfig.get(provider.configKey);
                // Case 1: Provider config has not changed - do nothing
                if (oldConfigValue === newConfigValue) {
                    continue;
                }
                // Case 2: Provider was enabled and is now disabled - unregister provider
                if (oldConfigValue && !newConfigValue) {
                    providerChanges.push(self.unregisterAccountProvider(provider));
                }
                // Case 3: Provider was disabled and is now enabled - register provider
                if (!oldConfigValue && newConfigValue) {
                    providerChanges.push(self.registerAccountProvider(provider));
                }
            }
            // Process all the changes before continuing
            return Promise.all(providerChanges);
        }).then(null, () => { return Promise.resolve(); });
    }
    registerAccountProvider(provider) {
        let self = this;
        return new Promise((resolve, reject) => {
            try {
                let tokenCacheKey = `azureTokenCache-${provider.metadata.id}`;
                let tokenCachePath = path.join(this._userStoragePath, tokenCacheKey);
                let tokenCache = new tokenCache_1.default(self._credentialProvider, tokenCacheKey, tokenCachePath);
                let accountProvider = new azureAccountProvider_1.AzureAccountProvider(provider.metadata, tokenCache);
                self._accountProviders[provider.metadata.id] = accountProvider;
                self._accountDisposals[provider.metadata.id] = sqlops.accounts.registerAccountProvider(provider.metadata, accountProvider);
                resolve();
            }
            catch (e) {
                console.error(`Failed to register account provider: ${e}`);
                reject(e);
            }
        });
    }
    unregisterAccountProvider(provider) {
        let self = this;
        return new Promise((resolve, reject) => {
            try {
                self._accountDisposals[provider.metadata.id].dispose();
                delete self._accountProviders[provider.metadata.id];
                delete self._accountDisposals[provider.metadata.id];
                resolve();
            }
            catch (e) {
                console.error(`Failed to unregister account provider: ${e}`);
                reject(e);
            }
        });
    }
}
// CONSTANTS ///////////////////////////////////////////////////////////////
AzureAccountProviderService.CommandClearTokenCache = 'accounts.clearTokenCache';
AzureAccountProviderService.ConfigurationSection = 'accounts.azure';
AzureAccountProviderService.CredentialNamespace = 'azureAccountProviderCredentials';
exports.AzureAccountProviderService = AzureAccountProviderService;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/887f4e8985023602e599cf86bdb44df48bb28569/extensions/azurecore/out/account-provider/azureAccountProviderService.js.map
