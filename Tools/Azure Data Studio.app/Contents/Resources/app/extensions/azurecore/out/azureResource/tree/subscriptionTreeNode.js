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
const nls = require("vscode-nls");
const localize = nls.loadMessageBundle(__filename);
const baseTreeNodes_1 = require("./baseTreeNodes");
const constants_1 = require("../constants");
const messageTreeNode_1 = require("../messageTreeNode");
const utils_1 = require("../utils");
const resourceService_1 = require("../resourceService");
const resourceTreeNode_1 = require("../resourceTreeNode");
class AzureResourceSubscriptionTreeNode extends baseTreeNodes_1.AzureResourceContainerTreeNodeBase {
    constructor(account, subscription, tenatId, appContext, treeChangeHandler, parent) {
        super(appContext, treeChangeHandler, parent);
        this.account = account;
        this.subscription = subscription;
        this.tenatId = tenatId;
        this._id = undefined;
        this._id = `account_${this.account.key.accountId}.subscription_${this.subscription.id}.tenant_${this.tenatId}`;
        this.setCacheKey(`${this._id}.resources`);
    }
    getChildren() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resourceService = resourceService_1.AzureResourceService.getInstance();
                const children = [];
                for (const resourceProviderId of yield resourceService.listResourceProviderIds()) {
                    children.push(...yield resourceService.getRootChildren(resourceProviderId, this.account, this.subscription, this.tenatId));
                }
                if (children.length === 0) {
                    return [messageTreeNode_1.AzureResourceMessageTreeNode.create(AzureResourceSubscriptionTreeNode.noResourcesLabel, this)];
                }
                else {
                    return children.map((child) => {
                        // To make tree node's id unique, otherwise, treeModel.js would complain 'item already registered'
                        child.resourceNode.treeItem.id = `${this._id}.${child.resourceNode.treeItem.id}`;
                        return new resourceTreeNode_1.AzureResourceResourceTreeNode(child, this);
                    });
                }
            }
            catch (error) {
                return [messageTreeNode_1.AzureResourceMessageTreeNode.create(utils_1.AzureResourceErrorMessageUtil.getErrorMessage(error), this)];
            }
        });
    }
    getTreeItem() {
        const item = new vscode_1.TreeItem(this.subscription.name, vscode_1.TreeItemCollapsibleState.Collapsed);
        item.contextValue = constants_1.AzureResourceItemType.subscription;
        item.iconPath = {
            dark: this.appContext.extensionContext.asAbsolutePath('resources/dark/subscription_inverse.svg'),
            light: this.appContext.extensionContext.asAbsolutePath('resources/light/subscription.svg')
        };
        return item;
    }
    getNodeInfo() {
        return {
            label: this.subscription.name,
            isLeaf: false,
            errorMessage: undefined,
            metadata: undefined,
            nodePath: this.generateNodePath(),
            nodeStatus: undefined,
            nodeType: constants_1.AzureResourceItemType.subscription,
            nodeSubType: undefined,
            iconType: constants_1.AzureResourceItemType.subscription
        };
    }
    get nodePathValue() {
        return this._id;
    }
}
AzureResourceSubscriptionTreeNode.noResourcesLabel = localize(0, null);
exports.AzureResourceSubscriptionTreeNode = AzureResourceSubscriptionTreeNode;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/887f4e8985023602e599cf86bdb44df48bb28569/extensions/azurecore/out/azureResource/tree/subscriptionTreeNode.js.map
