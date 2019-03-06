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
const appContext_1 = require("../../../appContext");
const subscriptionTreeNode_1 = require("../../../azureResource/tree/subscriptionTreeNode");
const constants_1 = require("../../../azureResource/constants");
const resourceService_1 = require("../../../azureResource/resourceService");
const resourceTreeNode_1 = require("../../../azureResource/resourceTreeNode");
const utils_1 = require("../../../azureResource/utils");
// Mock services
let mockAppContext;
let mockExtensionContext;
let mockApiWrapper;
let mockCacheService;
let mockTreeChangeHandler;
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
let mockResourceTreeDataProvider1;
let mockResourceProvider1;
let mockResourceTreeDataProvider2;
let mockResourceProvider2;
const resourceService = resourceService_1.AzureResourceService.getInstance();
describe('AzureResourceSubscriptionTreeNode.info', function () {
    beforeEach(() => {
        mockExtensionContext = TypeMoq.Mock.ofType();
        mockApiWrapper = TypeMoq.Mock.ofType();
        mockCacheService = TypeMoq.Mock.ofType();
        mockAppContext = new appContext_1.AppContext(mockExtensionContext.object, mockApiWrapper.object);
        mockAppContext.registerService(constants_1.AzureResourceServiceNames.cacheService, mockCacheService.object);
        mockCacheService.setup((o) => o.generateKey(TypeMoq.It.isAnyString())).returns(() => utils_1.generateGuid());
        mockTreeChangeHandler = TypeMoq.Mock.ofType();
        mockResourceTreeDataProvider1 = TypeMoq.Mock.ofType();
        mockResourceTreeDataProvider1.setup((o) => o.getChildren()).returns(() => Promise.resolve([TypeMoq.Mock.ofType().object]));
        mockResourceTreeDataProvider1.setup((o) => o.getTreeItem(TypeMoq.It.isAny())).returns(() => Promise.resolve(TypeMoq.It.isAny()));
        mockResourceProvider1 = TypeMoq.Mock.ofType();
        mockResourceProvider1.setup((o) => o.providerId).returns(() => 'mockResourceProvider1');
        mockResourceProvider1.setup((o) => o.getTreeDataProvider()).returns(() => mockResourceTreeDataProvider1.object);
        mockResourceTreeDataProvider2 = TypeMoq.Mock.ofType();
        mockResourceTreeDataProvider2.setup((o) => o.getChildren()).returns(() => Promise.resolve([TypeMoq.Mock.ofType().object]));
        mockResourceTreeDataProvider2.setup((o) => o.getTreeItem(TypeMoq.It.isAny())).returns(() => Promise.resolve(TypeMoq.It.isAny()));
        mockResourceProvider2 = TypeMoq.Mock.ofType();
        mockResourceProvider2.setup((o) => o.providerId).returns(() => 'mockResourceProvider2');
        mockResourceProvider2.setup((o) => o.getTreeDataProvider()).returns(() => mockResourceTreeDataProvider2.object);
        resourceService.clearResourceProviders();
        resourceService.registerResourceProvider(mockResourceProvider1.object);
        resourceService.registerResourceProvider(mockResourceProvider2.object);
        resourceService.areResourceProvidersLoaded = true;
    });
    it('Should be correct when created.', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const subscriptionTreeNode = new subscriptionTreeNode_1.AzureResourceSubscriptionTreeNode(mockAccount, mockSubscription, mockTenantId, mockAppContext, mockTreeChangeHandler.object, undefined);
            should(subscriptionTreeNode.nodePathValue).equal(`account_${mockAccount.key.accountId}.subscription_${mockSubscription.id}.tenant_${mockTenantId}`);
            const treeItem = yield subscriptionTreeNode.getTreeItem();
            should(treeItem.label).equal(mockSubscription.name);
            should(treeItem.collapsibleState).equal(vscode.TreeItemCollapsibleState.Collapsed);
            should(treeItem.contextValue).equal(constants_1.AzureResourceItemType.subscription);
            const nodeInfo = subscriptionTreeNode.getNodeInfo();
            should(nodeInfo.label).equal(mockSubscription.name);
            should(nodeInfo.isLeaf).equal(false);
            should(nodeInfo.nodeType).equal(constants_1.AzureResourceItemType.subscription);
            should(nodeInfo.iconType).equal(constants_1.AzureResourceItemType.subscription);
        });
    });
});
describe('AzureResourceSubscriptionTreeNode.getChildren', function () {
    beforeEach(() => {
        mockExtensionContext = TypeMoq.Mock.ofType();
        mockApiWrapper = TypeMoq.Mock.ofType();
        mockCacheService = TypeMoq.Mock.ofType();
        mockAppContext = new appContext_1.AppContext(mockExtensionContext.object, mockApiWrapper.object);
        mockAppContext.registerService(constants_1.AzureResourceServiceNames.cacheService, mockCacheService.object);
        mockCacheService.setup((o) => o.generateKey(TypeMoq.It.isAnyString())).returns(() => utils_1.generateGuid());
        mockTreeChangeHandler = TypeMoq.Mock.ofType();
        mockResourceTreeDataProvider1 = TypeMoq.Mock.ofType();
        mockResourceTreeDataProvider1.setup((o) => o.getChildren()).returns(() => Promise.resolve([TypeMoq.Mock.ofType().object]));
        mockResourceTreeDataProvider1.setup((o) => o.getTreeItem(TypeMoq.It.isAny())).returns(() => Promise.resolve(TypeMoq.It.isAny()));
        mockResourceProvider1 = TypeMoq.Mock.ofType();
        mockResourceProvider1.setup((o) => o.providerId).returns(() => 'mockResourceProvider1');
        mockResourceProvider1.setup((o) => o.getTreeDataProvider()).returns(() => mockResourceTreeDataProvider1.object);
        mockResourceTreeDataProvider2 = TypeMoq.Mock.ofType();
        mockResourceTreeDataProvider2.setup((o) => o.getChildren()).returns(() => Promise.resolve([TypeMoq.Mock.ofType().object]));
        mockResourceTreeDataProvider2.setup((o) => o.getTreeItem(TypeMoq.It.isAny())).returns(() => Promise.resolve(TypeMoq.It.isAny()));
        mockResourceProvider2 = TypeMoq.Mock.ofType();
        mockResourceProvider2.setup((o) => o.providerId).returns(() => 'mockResourceProvider2');
        mockResourceProvider2.setup((o) => o.getTreeDataProvider()).returns(() => mockResourceTreeDataProvider2.object);
        resourceService.clearResourceProviders();
        resourceService.registerResourceProvider(mockResourceProvider1.object);
        resourceService.registerResourceProvider(mockResourceProvider2.object);
        resourceService.areResourceProvidersLoaded = true;
    });
    it('Should return resource containers.', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const subscriptionTreeNode = new subscriptionTreeNode_1.AzureResourceSubscriptionTreeNode(mockAccount, mockSubscription, mockTenantId, mockAppContext, mockTreeChangeHandler.object, undefined);
            const children = yield subscriptionTreeNode.getChildren();
            mockResourceTreeDataProvider1.verify((o) => o.getChildren(), TypeMoq.Times.once());
            mockResourceTreeDataProvider2.verify((o) => o.getChildren(), TypeMoq.Times.once());
            const expectedChildren = yield resourceService.listResourceProviderIds();
            should(children).Array();
            should(children.length).equal(expectedChildren.length);
            for (const child of children) {
                should(child).instanceOf(resourceTreeNode_1.AzureResourceResourceTreeNode);
            }
        });
    });
});
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/887f4e8985023602e599cf86bdb44df48bb28569/extensions/azurecore/out/test/azureResource/tree/subscriptionTreeNode.test.js.map
