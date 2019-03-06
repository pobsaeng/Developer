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
const treeNode_1 = require("./treeNode");
const resourceService_1 = require("./resourceService");
const messageTreeNode_1 = require("./messageTreeNode");
const utils_1 = require("./utils");
class AzureResourceResourceTreeNode extends treeNode_1.TreeNode {
    constructor(resourceNodeWithProviderId, parent) {
        super();
        this.resourceNodeWithProviderId = resourceNodeWithProviderId;
        this._resourceService = resourceService_1.AzureResourceService.getInstance();
        this.parent = parent;
    }
    getChildren() {
        return __awaiter(this, void 0, void 0, function* () {
            // It is a leaf node.
            if (this.resourceNodeWithProviderId.resourceNode.treeItem.collapsibleState === vscode_1.TreeItemCollapsibleState.None) {
                return [];
            }
            try {
                const children = yield this._resourceService.getChildren(this.resourceNodeWithProviderId.resourceProviderId, this.resourceNodeWithProviderId.resourceNode);
                if (children.length === 0) {
                    return [messageTreeNode_1.AzureResourceMessageTreeNode.create(AzureResourceResourceTreeNode.noResourcesLabel, this)];
                }
                else {
                    return children.map((child) => {
                        // To make tree node's id unique, otherwise, treeModel.js would complain 'item already registered'
                        child.resourceNode.treeItem.id = `${this.resourceNodeWithProviderId.resourceNode.treeItem.id}.${child.resourceNode.treeItem.id}`;
                        return new AzureResourceResourceTreeNode(child, this);
                    });
                }
            }
            catch (error) {
                return [messageTreeNode_1.AzureResourceMessageTreeNode.create(utils_1.AzureResourceErrorMessageUtil.getErrorMessage(error), this)];
            }
        });
    }
    getTreeItem() {
        return this._resourceService.getTreeItem(this.resourceNodeWithProviderId.resourceProviderId, this.resourceNodeWithProviderId.resourceNode);
    }
    getNodeInfo() {
        const treeItem = this.resourceNodeWithProviderId.resourceNode.treeItem;
        return {
            label: treeItem.label,
            isLeaf: treeItem.collapsibleState === vscode_1.TreeItemCollapsibleState.None ? true : false,
            errorMessage: undefined,
            metadata: undefined,
            nodePath: this.generateNodePath(),
            nodeStatus: undefined,
            nodeType: treeItem.contextValue,
            nodeSubType: undefined,
            iconType: treeItem.contextValue
        };
    }
    get nodePathValue() {
        return this.resourceNodeWithProviderId.resourceNode.treeItem.id;
    }
}
AzureResourceResourceTreeNode.noResourcesLabel = localize(0, null);
exports.AzureResourceResourceTreeNode = AzureResourceResourceTreeNode;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/887f4e8985023602e599cf86bdb44df48bb28569/extensions/azurecore/out/azureResource/resourceTreeNode.js.map
