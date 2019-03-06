/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const sqlops_1 = require("sqlops");
const ms_rest_1 = require("ms-rest");
const nls = require("vscode-nls");
const localize = nls.loadMessageBundle(__filename);
const errors_1 = require("../errors");
const baseTreeNodes_1 = require("./baseTreeNodes");
const constants_1 = require("../constants");
const subscriptionTreeNode_1 = require("./subscriptionTreeNode");
const messageTreeNode_1 = require("../messageTreeNode");
const utils_1 = require("../utils");
class AzureResourceAccountTreeNode extends baseTreeNodes_1.AzureResourceContainerTreeNodeBase {
    constructor(account, appContext, treeChangeHandler) {
        super(appContext, treeChangeHandler, undefined);
        this.account = account;
        this._subscriptionService = undefined;
        this._subscriptionFilterService = undefined;
        this._tenantService = undefined;
        this._id = undefined;
        this._label = undefined;
        this._totalSubscriptionCount = 0;
        this._selectedSubscriptionCount = 0;
        this._subscriptionService = this.appContext.getService(constants_1.AzureResourceServiceNames.subscriptionService);
        this._subscriptionFilterService = this.appContext.getService(constants_1.AzureResourceServiceNames.subscriptionFilterService);
        this._tenantService = this.appContext.getService(constants_1.AzureResourceServiceNames.tenantService);
        this._id = `account_${this.account.key.accountId}`;
        this.setCacheKey(`${this._id}.subscriptions`);
        this._label = this.generateLabel();
    }
    getChildren() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let subscriptions = [];
                if (this._isClearingCache) {
                    try {
                        const tokens = yield this.appContext.apiWrapper.getSecurityToken(this.account, sqlops_1.AzureResource.ResourceManagement);
                        for (const tenant of this.account.properties.tenants) {
                            const token = tokens[tenant.id].token;
                            const tokenType = tokens[tenant.id].tokenType;
                            subscriptions.push(...((yield this._subscriptionService.getSubscriptions(this.account, new ms_rest_1.TokenCredentials(token, tokenType))) || []));
                        }
                    }
                    catch (error) {
                        throw new errors_1.AzureResourceCredentialError(localize(0, null, this.account.key.accountId), error);
                    }
                    this.updateCache(subscriptions);
                    this._isClearingCache = false;
                }
                else {
                    subscriptions = yield this.getCachedSubscriptions();
                }
                this._totalSubscriptionCount = subscriptions.length;
                const selectedSubscriptions = yield this._subscriptionFilterService.getSelectedSubscriptions(this.account);
                const selectedSubscriptionIds = (selectedSubscriptions || []).map((subscription) => subscription.id);
                if (selectedSubscriptionIds.length > 0) {
                    subscriptions = subscriptions.filter((subscription) => selectedSubscriptionIds.indexOf(subscription.id) !== -1);
                    this._selectedSubscriptionCount = selectedSubscriptionIds.length;
                }
                else {
                    // ALL subscriptions are listed by default
                    this._selectedSubscriptionCount = this._totalSubscriptionCount;
                }
                this.refreshLabel();
                if (subscriptions.length === 0) {
                    return [messageTreeNode_1.AzureResourceMessageTreeNode.create(AzureResourceAccountTreeNode.noSubscriptionsLabel, this)];
                }
                else {
                    return yield Promise.all(subscriptions.map((subscription) => __awaiter(this, void 0, void 0, function* () {
                        const tenantId = yield this._tenantService.getTenantId(subscription);
                        return new subscriptionTreeNode_1.AzureResourceSubscriptionTreeNode(this.account, subscription, tenantId, this.appContext, this.treeChangeHandler, this);
                    })));
                }
            }
            catch (error) {
                if (error instanceof errors_1.AzureResourceCredentialError) {
                    this.appContext.apiWrapper.executeCommand('azure.resource.signin');
                }
                return [messageTreeNode_1.AzureResourceMessageTreeNode.create(utils_1.AzureResourceErrorMessageUtil.getErrorMessage(error), this)];
            }
        });
    }
    getCachedSubscriptions() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getCache();
        });
    }
    getTreeItem() {
        const item = new vscode_1.TreeItem(this._label, vscode_1.TreeItemCollapsibleState.Collapsed);
        item.id = this._id;
        item.contextValue = constants_1.AzureResourceItemType.account;
        item.iconPath = {
            dark: this.appContext.extensionContext.asAbsolutePath('resources/dark/account_inverse.svg'),
            light: this.appContext.extensionContext.asAbsolutePath('resources/light/account.svg')
        };
        return item;
    }
    getNodeInfo() {
        return {
            label: this._label,
            isLeaf: false,
            errorMessage: undefined,
            metadata: undefined,
            nodePath: this.generateNodePath(),
            nodeStatus: undefined,
            nodeType: constants_1.AzureResourceItemType.account,
            nodeSubType: undefined,
            iconType: constants_1.AzureResourceItemType.account
        };
    }
    get nodePathValue() {
        return this._id;
    }
    get totalSubscriptionCount() {
        return this._totalSubscriptionCount;
    }
    get selectedSubscriptionCount() {
        return this._selectedSubscriptionCount;
    }
    refreshLabel() {
        const newLabel = this.generateLabel();
        if (this._label !== newLabel) {
            this._label = newLabel;
            this.treeChangeHandler.notifyNodeChanged(this);
        }
    }
    generateLabel() {
        let label = `${this.account.displayInfo.displayName} (${this.account.key.accountId})`;
        if (this._totalSubscriptionCount !== 0) {
            label += ` (${this._selectedSubscriptionCount} / ${this._totalSubscriptionCount} subscriptions)`;
        }
        return label;
    }
}
AzureResourceAccountTreeNode.noSubscriptionsLabel = localize(1, null);
exports.AzureResourceAccountTreeNode = AzureResourceAccountTreeNode;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/887f4e8985023602e599cf86bdb44df48bb28569/extensions/azurecore/out/azureResource/tree/accountTreeNode.js.map
