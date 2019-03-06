/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const treeNode_1 = require("./treeNode");
const constants_1 = require("./constants");
class AzureResourceMessageTreeNode extends treeNode_1.TreeNode {
    constructor(message, parent) {
        super();
        this.message = message;
        this.parent = parent;
        this._id = `message_${AzureResourceMessageTreeNode._messageNum++}`;
    }
    static create(message, parent) {
        return new AzureResourceMessageTreeNode(message, parent);
    }
    getChildren() {
        return [];
    }
    getTreeItem() {
        let item = new vscode_1.TreeItem(this.message, vscode_1.TreeItemCollapsibleState.None);
        item.contextValue = constants_1.AzureResourceItemType.message;
        return item;
    }
    getNodeInfo() {
        return {
            label: this.message,
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
        return this._id;
    }
}
AzureResourceMessageTreeNode._messageNum = 0;
exports.AzureResourceMessageTreeNode = AzureResourceMessageTreeNode;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/887f4e8985023602e599cf86bdb44df48bb28569/extensions/azurecore/out/azureResource/messageTreeNode.js.map
