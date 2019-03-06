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
const constants_1 = require("../../azureResource/constants");
const messageTreeNode_1 = require("../../azureResource/messageTreeNode");
describe('AzureResourceMessageTreeNode.info', function () {
    it('Should be correct when created.', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const mockMessage = 'Test messagse';
            const treeNode = new messageTreeNode_1.AzureResourceMessageTreeNode(mockMessage, undefined);
            should(treeNode.nodePathValue).startWith('message_');
            const treeItem = yield treeNode.getTreeItem();
            should(treeItem.label).equal(mockMessage);
            should(treeItem.contextValue).equal(constants_1.AzureResourceItemType.message);
            should(treeItem.collapsibleState).equal(vscode.TreeItemCollapsibleState.None);
            const nodeInfo = treeNode.getNodeInfo();
            should(nodeInfo.isLeaf).true();
            should(nodeInfo.label).equal(mockMessage);
            should(nodeInfo.nodeType).equal(constants_1.AzureResourceItemType.message);
            should(nodeInfo.iconType).equal(constants_1.AzureResourceItemType.message);
        });
    });
});
describe('AzureResourceMessageTreeNode.create', function () {
    it('Should create a message node.', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const mockMessage = 'Test messagse';
            const treeNode = messageTreeNode_1.AzureResourceMessageTreeNode.create(mockMessage, undefined);
            should(treeNode).instanceof(messageTreeNode_1.AzureResourceMessageTreeNode);
        });
    });
});
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/887f4e8985023602e599cf86bdb44df48bb28569/extensions/azurecore/out/test/azureResource/messageTreeNode.test.js.map
