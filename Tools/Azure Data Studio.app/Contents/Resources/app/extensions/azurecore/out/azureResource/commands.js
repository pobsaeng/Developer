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
const errors_1 = require("./errors");
const accountTreeNode_1 = require("./tree/accountTreeNode");
const constants_1 = require("./constants");
function registerAzureResourceCommands(appContext, tree) {
    appContext.apiWrapper.registerCommand('azure.resource.selectsubscriptions', (node) => __awaiter(this, void 0, void 0, function* () {
        if (!(node instanceof accountTreeNode_1.AzureResourceAccountTreeNode)) {
            return;
        }
        const subscriptionService = appContext.getService(constants_1.AzureResourceServiceNames.subscriptionService);
        const subscriptionFilterService = appContext.getService(constants_1.AzureResourceServiceNames.subscriptionFilterService);
        const accountNode = node;
        const subscriptions = (yield accountNode.getCachedSubscriptions()) || [];
        if (subscriptions.length === 0) {
            try {
                const tokens = yield this.servicePool.apiWrapper.getSecurityToken(this.account, sqlops_1.AzureResource.ResourceManagement);
                for (const tenant of this.account.properties.tenants) {
                    const token = tokens[tenant.id].token;
                    const tokenType = tokens[tenant.id].tokenType;
                    subscriptions.push(...yield subscriptionService.getSubscriptions(accountNode.account, new ms_rest_1.TokenCredentials(token, tokenType)));
                }
            }
            catch (error) {
                throw new errors_1.AzureResourceCredentialError(localize(0, null, this.account.key.accountId), error);
            }
        }
        let selectedSubscriptions = (yield subscriptionFilterService.getSelectedSubscriptions(accountNode.account)) || [];
        const selectedSubscriptionIds = [];
        if (selectedSubscriptions.length > 0) {
            selectedSubscriptionIds.push(...selectedSubscriptions.map((subscription) => subscription.id));
        }
        else {
            // ALL subscriptions are selected by default
            selectedSubscriptionIds.push(...subscriptions.map((subscription) => subscription.id));
        }
        const subscriptionQuickPickItems = subscriptions.map((subscription) => {
            return {
                label: subscription.name,
                picked: selectedSubscriptionIds.indexOf(subscription.id) !== -1,
                subscription: subscription
            };
        });
        const selectedSubscriptionQuickPickItems = (yield vscode_1.window.showQuickPick(subscriptionQuickPickItems, { canPickMany: true }));
        if (selectedSubscriptionQuickPickItems && selectedSubscriptionQuickPickItems.length > 0) {
            tree.refresh(node, false);
            selectedSubscriptions = selectedSubscriptionQuickPickItems.map((subscriptionItem) => subscriptionItem.subscription);
            yield subscriptionFilterService.saveSelectedSubscriptions(accountNode.account, selectedSubscriptions);
        }
    }));
    appContext.apiWrapper.registerCommand('azure.resource.refreshall', () => tree.notifyNodeChanged(undefined));
    appContext.apiWrapper.registerCommand('azure.resource.refresh', (node) => __awaiter(this, void 0, void 0, function* () {
        tree.refresh(node, true);
    }));
    appContext.apiWrapper.registerCommand('azure.resource.signin', (node) => __awaiter(this, void 0, void 0, function* () {
        appContext.apiWrapper.executeCommand('sql.action.accounts.manageLinkedAccount');
    }));
}
exports.registerAzureResourceCommands = registerAzureResourceCommands;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/887f4e8985023602e599cf86bdb44df48bb28569/extensions/azurecore/out/azureResource/commands.js.map
