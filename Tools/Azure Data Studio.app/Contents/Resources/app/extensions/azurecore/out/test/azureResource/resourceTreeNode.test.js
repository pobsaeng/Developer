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
const TypeMoq = require("typemoq");
const vscode = require("vscode");
require("mocha");
const resourceService_1 = require("../../azureResource/resourceService");
const resourceTreeNode_1 = require("../../azureResource/resourceTreeNode");
const resourceService = resourceService_1.AzureResourceService.getInstance();
// Mock test data
const mockAccount = {
    key: {
        accountId: 'mock_account',
        providerId: 'mock_provider'
    },
    displayInfo: {
        displayName: 'mock_account@test.com',
        accountType: 'Microsoft',
        contextualDisplayName: 'test'
    },
    properties: undefined,
    isStale: false
};
const mockSubscription = {
    id: 'mock_subscription',
    name: 'mock subscription'
};
const mockTenantId = 'mock_tenant';
const mockResourceProviderId = 'mock_resource_provider';
const mockResourceRootNode = {
    account: mockAccount,
    subscription: mockSubscription,
    tenantId: mockTenantId,
    treeItem: {
        id: 'mock_resource_root_node',
        label: 'mock resource root node',
        iconPath: undefined,
        collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
        contextValue: 'mock_resource_root_node'
    }
};
const mockResourceNode1 = {
    account: mockAccount,
    subscription: mockSubscription,
    tenantId: mockTenantId,
    treeItem: {
        id: 'mock_resource_node_1',
        label: 'mock resource node 1',
        iconPath: undefined,
        collapsibleState: vscode.TreeItemCollapsibleState.None,
        contextValue: 'mock_resource_node'
    }
};
const mockResourceNode2 = {
    account: mockAccount,
    subscription: mockSubscription,
    tenantId: mockTenantId,
    treeItem: {
        id: 'mock_resource_node_2',
        label: 'mock resource node 2',
        iconPath: undefined,
        collapsibleState: vscode.TreeItemCollapsibleState.None,
        contextValue: 'mock_resource_node'
    }
};
const mockResourceNodes = [mockResourceNode1, mockResourceNode2];
let mockResourceTreeDataProvider;
let mockResourceProvider;
describe('AzureResourceResourceTreeNode.info', function () {
    beforeEach(() => {
        mockResourceTreeDataProvider = TypeMoq.Mock.ofType();
        mockResourceTreeDataProvider.setup((o) => o.getTreeItem(mockResourceRootNode)).returns(() => mockResourceRootNode.treeItem);
        mockResourceTreeDataProvider.setup((o) => o.getChildren(mockResourceRootNode)).returns(() => Promise.resolve(mockResourceNodes));
        mockResourceProvider = TypeMoq.Mock.ofType();
        mockResourceProvider.setup((o) => o.providerId).returns(() => mockResourceProviderId);
        mockResourceProvider.setup((o) => o.getTreeDataProvider()).returns(() => mockResourceTreeDataProvider.object);
        resourceService.clearResourceProviders();
        resourceService.registerResourceProvider(mockResourceProvider.object);
        resourceService.areResourceProvidersLoaded = true;
    });
    it('Should be correct when created.', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const resourceTreeNode = new resourceTreeNode_1.AzureResourceResourceTreeNode({
                resourceProviderId: mockResourceProviderId,
                resourceNode: mockResourceRootNode
            }, undefined);
            should(resourceTreeNode.nodePathValue).equal(mockResourceRootNode.treeItem.id);
            const treeItem = yield resourceTreeNode.getTreeItem();
            should(treeItem.id).equal(mockResourceRootNode.treeItem.id);
            should(treeItem.label).equal(mockResourceRootNode.treeItem.label);
            should(treeItem.collapsibleState).equal(mockResourceRootNode.treeItem.collapsibleState);
            should(treeItem.contextValue).equal(mockResourceRootNode.treeItem.contextValue);
            const nodeInfo = resourceTreeNode.getNodeInfo();
            should(nodeInfo.label).equal(mockResourceRootNode.treeItem.label);
            should(nodeInfo.isLeaf).equal(mockResourceRootNode.treeItem.collapsibleState === vscode.TreeItemCollapsibleState.None);
            should(nodeInfo.nodeType).equal(mockResourceRootNode.treeItem.contextValue);
            should(nodeInfo.iconType).equal(mockResourceRootNode.treeItem.contextValue);
        });
    });
});
describe('AzureResourceResourceTreeNode.getChildren', function () {
    beforeEach(() => {
        mockResourceTreeDataProvider = TypeMoq.Mock.ofType();
        mockResourceTreeDataProvider.setup((o) => o.getChildren(mockResourceRootNode)).returns(() => Promise.resolve(mockResourceNodes));
        mockResourceProvider = TypeMoq.Mock.ofType();
        mockResourceProvider.setup((o) => o.providerId).returns(() => mockResourceProviderId);
        mockResourceProvider.setup((o) => o.getTreeDataProvider()).returns(() => mockResourceTreeDataProvider.object);
        resourceService.clearResourceProviders();
        resourceService.registerResourceProvider(mockResourceProvider.object);
        resourceService.areResourceProvidersLoaded = true;
    });
    it('Should return resource nodes when it is container node.', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const resourceTreeNode = new resourceTreeNode_1.AzureResourceResourceTreeNode({
                resourceProviderId: mockResourceProviderId,
                resourceNode: mockResourceRootNode
            }, undefined);
            const children = yield resourceTreeNode.getChildren();
            mockResourceTreeDataProvider.verify((o) => o.getChildren(mockResourceRootNode), TypeMoq.Times.once());
            should(children).Array();
            should(children.length).equal(mockResourceNodes.length);
            for (let ix = 0; ix < children.length; ix++) {
                const child = children[ix];
                should(child).instanceOf(resourceTreeNode_1.AzureResourceResourceTreeNode);
                const childNode = child.resourceNodeWithProviderId;
                should(childNode.resourceProviderId).equal(mockResourceProviderId);
                should(childNode.resourceNode.account).equal(mockAccount);
                should(childNode.resourceNode.subscription).equal(mockSubscription);
                should(childNode.resourceNode.tenantId).equal(mockTenantId);
                should(childNode.resourceNode.treeItem.id).equal(mockResourceNodes[ix].treeItem.id);
                should(childNode.resourceNode.treeItem.label).equal(mockResourceNodes[ix].treeItem.label);
                should(childNode.resourceNode.treeItem.collapsibleState).equal(mockResourceNodes[ix].treeItem.collapsibleState);
                should(childNode.resourceNode.treeItem.contextValue).equal(mockResourceNodes[ix].treeItem.contextValue);
            }
        });
    });
    it('Should return empty when it is leaf node.', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const resourceTreeNode = new resourceTreeNode_1.AzureResourceResourceTreeNode({
                resourceProviderId: mockResourceProviderId,
                resourceNode: mockResourceNode1
            }, undefined);
            const children = yield resourceTreeNode.getChildren();
            mockResourceTreeDataProvider.verify((o) => o.getChildren(), TypeMoq.Times.exactly(0));
            should(children).Array();
            should(children.length).equal(0);
        });
    });
});
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/887f4e8985023602e599cf86bdb44df48bb28569/extensions/azurecore/out/test/azureResource/resourceTreeNode.test.js.map
