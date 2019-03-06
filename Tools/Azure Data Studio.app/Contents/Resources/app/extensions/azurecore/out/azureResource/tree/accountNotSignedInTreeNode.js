/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const nls = require("vscode-nls");
const localize = nls.loadMessageBundle(__filename);
const treeNode_1 = require("../treeNode");
const constants_1 = require("../constants");
class AzureResourceAccountNotSignedInTreeNode extends treeNode_1.TreeNode {
    getChildren() {
        return [];
    }
    getTreeItem() {
        let item = new vscode_1.TreeItem(AzureResourceAccountNotSignedInTreeNode.signInLabel, vscode_1.TreeItemCollapsibleState.None);
        item.contextValue = constants_1.AzureResourceItemType.message;
        item.command = {
            title: AzureResourceAccountNotSignedInTreeNode.signInLabel,
            command: 'azure.resource.signin',
            arguments: [this]
        };
        return item;
    }
    getNodeInfo() {
        return {
            label: AzureResourceAccountNotSignedInTreeNode.signInLabel,
            isLeaf: true,
            errorMessage: undefined,
            metadata: undefined,
            nodePath: this.generateNodePath(),
            nodeStatus: undefined,
            nodeType: constants_1.AzureResourceItemType.message,
            nodeSubType: undefined,
            iconType: constants_1.AzureResourceItemType.message
        };
    }
    get nodePathValue() {
        return 'message_accountNotSignedIn';
    }
}
AzureResourceAccountNotSignedInTreeNode.signInLabel = localize(0, null);
exports.AzureResourceAccountNotSignedInTreeNode = AzureResourceAccountNotSignedInTreeNode;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/887f4e8985023602e599cf86bdb44df48bb28569/extensions/azurecore/out/azureResource/tree/accountNotSignedInTreeNode.js.map
