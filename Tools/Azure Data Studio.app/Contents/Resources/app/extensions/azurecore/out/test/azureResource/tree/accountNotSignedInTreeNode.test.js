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
const should = require("should");
const vscode = require("vscode");
require("mocha");
const constants_1 = require("../../../azureResource/constants");
const accountNotSignedInTreeNode_1 = require("../../../azureResource/tree/accountNotSignedInTreeNode");
describe('AzureResourceAccountNotSignedInTreeNode.info', function () {
    it('Should be correct.', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const label = 'Sign in to Azure ...';
            const treeNode = new accountNotSignedInTreeNode_1.AzureResourceAccountNotSignedInTreeNode();
            should(treeNode.nodePathValue).equal('message_accountNotSignedIn');
            const treeItem = yield treeNode.getTreeItem();
            should(treeItem.label).equal(label);
            should(treeItem.contextValue).equal(constants_1.AzureResourceItemType.message);
            should(treeItem.collapsibleState).equal(vscode.TreeItemCollapsibleState.None);
            should(treeItem.command).not.undefined();
            should(treeItem.command.title).equal(label);
            should(treeItem.command.command).equal('azure.resource.signin');
            const nodeInfo = treeNode.getNodeInfo();
            should(nodeInfo.isLeaf).true();
            should(nodeInfo.label).equal(label);
            should(nodeInfo.nodeType).equal(constants_1.AzureResourceItemType.message);
            should(nodeInfo.iconType).equal(constants_1.AzureResourceItemType.message);
        });
    });
});
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/887f4e8985023602e599cf86bdb44df48bb28569/extensions/azurecore/out/test/azureResource/tree/accountNotSignedInTreeNode.test.js.map
