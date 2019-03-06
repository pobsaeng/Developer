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
const sqlops = require("sqlops");
const vscode = require("vscode");
require("mocha");
const ms_rest_1 = require("ms-rest");
const appContext_1 = require("../../../appContext");
const accountTreeNode_1 = require("../../../azureResource/tree/accountTreeNode");
const subscriptionTreeNode_1 = require("../../../azureResource/tree/subscriptionTreeNode");
const constants_1 = require("../../../azureResource/constants");
const messageTreeNode_1 = require("../../../azureResource/messageTreeNode");
const utils_1 = require("../../../azureResource/utils");
// Mock services
let mockExtensionContext;
let mockApiWrapper;
let mockCacheService;
let mockSubscriptionService;
let mockSubscriptionFilterService;
let mockTenantService;
let mockAppContext;
let mockTreeChangeHandler;
// Mock test data
const mockTenantId = 'mock_tenant_id';
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
    properties: {
        tenants: [
            {
                id: mockTenantId
            }
        ]
    },
    isStale: false
};
const mockSubscription1 = {
    id: 'mock_subscription_1',
    name: 'mock subscription 1'
};
const mockSubscription2 = {
    id: 'mock_subscription_2',
    name: 'mock subscription 2'
};
const mockSubscriptions = [mockSubscription1, mockSubscription2];
const mockFilteredSubscriptions = [mockSubscription1];
const mockTokens = {};
mockTokens[mockTenantId] = {
    token: 'mock_token',
    tokenType: 'Bearer'
};
const mockCredential = new ms_rest_1.TokenCredentials(mockTokens[mockTenantId].token, mockTokens[mockTenantId].tokenType);
let mockSubscriptionCache = [];
describe('AzureResourceAccountTreeNode.info', function () {
    beforeEach(() => {
        mockExtensionContext = TypeMoq.Mock.ofType();
        mockApiWrapper = TypeMoq.Mock.ofType();
        mockCacheService = TypeMoq.Mock.ofType();
        mockSubscriptionService = TypeMoq.Mock.ofType();
        mockSubscriptionFilterService = TypeMoq.Mock.ofType();
        mockTenantService = TypeMoq.Mock.ofType();
        mockTreeChangeHandler = TypeMoq.Mock.ofType();
        mockSubscriptionCache = [];
        mockAppContext = new appContext_1.AppContext(mockExtensionContext.object, mockApiWrapper.object);
        mockAppContext.registerService(constants_1.AzureResourceServiceNames.cacheService, mockCacheService.object);
        mockAppContext.registerService(constants_1.AzureResourceServiceNames.subscriptionService, mockSubscriptionService.object);
        mockAppContext.registerService(constants_1.AzureResourceServiceNames.subscriptionFilterService, mockSubscriptionFilterService.object);
        mockAppContext.registerService(constants_1.AzureResourceServiceNames.tenantService, mockTenantService.object);
        mockApiWrapper.setup((o) => o.getSecurityToken(mockAccount, sqlops.AzureResource.ResourceManagement)).returns(() => Promise.resolve(mockTokens));
        mockCacheService.setup((o) => o.generateKey(TypeMoq.It.isAnyString())).returns(() => utils_1.generateGuid());
        mockCacheService.setup((o) => o.get(TypeMoq.It.isAnyString())).returns(() => mockSubscriptionCache);
        mockCacheService.setup((o) => o.update(TypeMoq.It.isAnyString(), TypeMoq.It.isAny())).returns(() => mockSubscriptionCache = mockSubscriptions);
        mockTenantService.setup((o) => o.getTenantId(TypeMoq.It.isAny())).returns(() => Promise.resolve(mockTenantId));
    });
    it('Should be correct when created.', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const accountTreeNode = new accountTreeNode_1.AzureResourceAccountTreeNode(mockAccount, mockAppContext, mockTreeChangeHandler.object);
            const accountTreeNodeId = `account_${mockAccount.key.accountId}`;
            const accountTreeNodeLabel = `${mockAccount.displayInfo.displayName} (${mockAccount.key.accountId})`;
            should(accountTreeNode.nodePathValue).equal(accountTreeNodeId);
            const treeItem = yield accountTreeNode.getTreeItem();
            should(treeItem.id).equal(accountTreeNodeId);
            should(treeItem.label).equal(accountTreeNodeLabel);
            should(treeItem.contextValue).equal(constants_1.AzureResourceItemType.account);
            should(treeItem.collapsibleState).equal(vscode.TreeItemCollapsibleState.Collapsed);
            const nodeInfo = accountTreeNode.getNodeInfo();
            should(nodeInfo.label).equal(accountTreeNodeLabel);
            should(nodeInfo.isLeaf).false();
            should(nodeInfo.nodeType).equal(constants_1.AzureResourceItemType.account);
            should(nodeInfo.iconType).equal(constants_1.AzureResourceItemType.account);
        });
    });
    it('Should be correct when there are subscriptions listed.', function () {
        return __awaiter(this, void 0, void 0, function* () {
            mockSubscriptionService.setup((o) => o.getSubscriptions(mockAccount, mockCredential)).returns(() => Promise.resolve(mockSubscriptions));
            mockSubscriptionFilterService.setup((o) => o.getSelectedSubscriptions(mockAccount)).returns(() => Promise.resolve(undefined));
            const accountTreeNodeLabel = `${mockAccount.displayInfo.displayName} (${mockAccount.key.accountId}) (${mockSubscriptions.length} / ${mockSubscriptions.length} subscriptions)`;
            const accountTreeNode = new accountTreeNode_1.AzureResourceAccountTreeNode(mockAccount, mockAppContext, mockTreeChangeHandler.object);
            const subscriptionNodes = yield accountTreeNode.getChildren();
            should(subscriptionNodes).Array();
            should(subscriptionNodes.length).equal(mockSubscriptions.length);
            const treeItem = yield accountTreeNode.getTreeItem();
            should(treeItem.label).equal(accountTreeNodeLabel);
            const nodeInfo = accountTreeNode.getNodeInfo();
            should(nodeInfo.label).equal(accountTreeNodeLabel);
        });
    });
    it('Should be correct when there are subscriptions filtered.', function () {
        return __awaiter(this, void 0, void 0, function* () {
            mockSubscriptionService.setup((o) => o.getSubscriptions(mockAccount, mockCredential)).returns(() => Promise.resolve(mockSubscriptions));
            mockSubscriptionFilterService.setup((o) => o.getSelectedSubscriptions(mockAccount)).returns(() => Promise.resolve(mockFilteredSubscriptions));
            const accountTreeNodeLabel = `${mockAccount.displayInfo.displayName} (${mockAccount.key.accountId}) (${mockFilteredSubscriptions.length} / ${mockSubscriptions.length} subscriptions)`;
            const accountTreeNode = new accountTreeNode_1.AzureResourceAccountTreeNode(mockAccount, mockAppContext, mockTreeChangeHandler.object);
            const subscriptionNodes = yield accountTreeNode.getChildren();
            should(subscriptionNodes).Array();
            should(subscriptionNodes.length).equal(mockFilteredSubscriptions.length);
            const treeItem = yield accountTreeNode.getTreeItem();
            should(treeItem.label).equal(accountTreeNodeLabel);
            const nodeInfo = accountTreeNode.getNodeInfo();
            should(nodeInfo.label).equal(accountTreeNodeLabel);
        });
    });
});
describe('AzureResourceAccountTreeNode.getChildren', function () {
    beforeEach(() => {
        mockExtensionContext = TypeMoq.Mock.ofType();
        mockApiWrapper = TypeMoq.Mock.ofType();
        mockCacheService = TypeMoq.Mock.ofType();
        mockSubscriptionService = TypeMoq.Mock.ofType();
        mockSubscriptionFilterService = TypeMoq.Mock.ofType();
        mockTenantService = TypeMoq.Mock.ofType();
        mockTreeChangeHandler = TypeMoq.Mock.ofType();
        mockSubscriptionCache = [];
        mockAppContext = new appContext_1.AppContext(mockExtensionContext.object, mockApiWrapper.object);
        mockAppContext.registerService(constants_1.AzureResourceServiceNames.cacheService, mockCacheService.object);
        mockAppContext.registerService(constants_1.AzureResourceServiceNames.subscriptionService, mockSubscriptionService.object);
        mockAppContext.registerService(constants_1.AzureResourceServiceNames.subscriptionFilterService, mockSubscriptionFilterService.object);
        mockAppContext.registerService(constants_1.AzureResourceServiceNames.tenantService, mockTenantService.object);
        mockApiWrapper.setup((o) => o.getSecurityToken(mockAccount, sqlops.AzureResource.ResourceManagement)).returns(() => Promise.resolve(mockTokens));
        mockCacheService.setup((o) => o.generateKey(TypeMoq.It.isAnyString())).returns(() => utils_1.generateGuid());
        mockCacheService.setup((o) => o.get(TypeMoq.It.isAnyString())).returns(() => mockSubscriptionCache);
        mockCacheService.setup((o) => o.update(TypeMoq.It.isAnyString(), TypeMoq.It.isAny())).returns(() => mockSubscriptionCache = mockSubscriptions);
        mockTenantService.setup((o) => o.getTenantId(TypeMoq.It.isAny())).returns(() => Promise.resolve(mockTenantId));
    });
    it('Should load subscriptions from scratch and update cache when it is clearing cache.', function () {
        return __awaiter(this, void 0, void 0, function* () {
            mockSubscriptionService.setup((o) => o.getSubscriptions(mockAccount, mockCredential)).returns(() => Promise.resolve(mockSubscriptions));
            mockSubscriptionFilterService.setup((o) => o.getSelectedSubscriptions(mockAccount)).returns(() => Promise.resolve([]));
            const accountTreeNode = new accountTreeNode_1.AzureResourceAccountTreeNode(mockAccount, mockAppContext, mockTreeChangeHandler.object);
            const children = yield accountTreeNode.getChildren();
            mockApiWrapper.verify((o) => o.getSecurityToken(mockAccount, sqlops.AzureResource.ResourceManagement), TypeMoq.Times.once());
            mockSubscriptionService.verify((o) => o.getSubscriptions(mockAccount, mockCredential), TypeMoq.Times.once());
            mockCacheService.verify((o) => o.get(TypeMoq.It.isAnyString()), TypeMoq.Times.exactly(0));
            mockCacheService.verify((o) => o.update(TypeMoq.It.isAnyString(), TypeMoq.It.isAny()), TypeMoq.Times.once());
            mockSubscriptionFilterService.verify((o) => o.getSelectedSubscriptions(mockAccount), TypeMoq.Times.once());
            mockTreeChangeHandler.verify((o) => o.notifyNodeChanged(accountTreeNode), TypeMoq.Times.once());
            should(accountTreeNode.totalSubscriptionCount).equal(mockSubscriptions.length);
            should(accountTreeNode.selectedSubscriptionCount).equal(mockSubscriptions.length);
            should(accountTreeNode.isClearingCache).false();
            should(children).Array();
            should(children.length).equal(mockSubscriptions.length);
            should(mockSubscriptionCache).deepEqual(mockSubscriptions);
            for (let ix = 0; ix < mockSubscriptions.length; ix++) {
                const child = children[ix];
                const subscription = mockSubscriptions[ix];
                should(child).instanceof(subscriptionTreeNode_1.AzureResourceSubscriptionTreeNode);
                should(child.nodePathValue).equal(`account_${mockAccount.key.accountId}.subscription_${subscription.id}.tenant_${mockTenantId}`);
            }
        });
    });
    it('Should load subscriptions from cache when it is not clearing cache.', function () {
        return __awaiter(this, void 0, void 0, function* () {
            mockSubscriptionService.setup((o) => o.getSubscriptions(mockAccount, mockCredential)).returns(() => Promise.resolve(mockSubscriptions));
            mockSubscriptionFilterService.setup((o) => o.getSelectedSubscriptions(mockAccount)).returns(() => Promise.resolve(undefined));
            const accountTreeNode = new accountTreeNode_1.AzureResourceAccountTreeNode(mockAccount, mockAppContext, mockTreeChangeHandler.object);
            yield accountTreeNode.getChildren();
            const children = yield accountTreeNode.getChildren();
            mockApiWrapper.verify((o) => o.getSecurityToken(mockAccount, sqlops.AzureResource.ResourceManagement), TypeMoq.Times.once());
            mockSubscriptionService.verify((o) => o.getSubscriptions(mockAccount, mockCredential), TypeMoq.Times.once());
            mockCacheService.verify((o) => o.get(TypeMoq.It.isAnyString()), TypeMoq.Times.once());
            mockCacheService.verify((o) => o.update(TypeMoq.It.isAnyString(), TypeMoq.It.isAny()), TypeMoq.Times.once());
            should(children.length).equal(mockSubscriptionCache.length);
            for (let ix = 0; ix < mockSubscriptionCache.length; ix++) {
                should(children[ix].nodePathValue).equal(`account_${mockAccount.key.accountId}.subscription_${mockSubscriptionCache[ix].id}.tenant_${mockTenantId}`);
            }
        });
    });
    it('Should handle when there is no subscriptions.', function () {
        return __awaiter(this, void 0, void 0, function* () {
            mockSubscriptionService.setup((o) => o.getSubscriptions(mockAccount, mockCredential)).returns(() => Promise.resolve(undefined));
            const accountTreeNode = new accountTreeNode_1.AzureResourceAccountTreeNode(mockAccount, mockAppContext, mockTreeChangeHandler.object);
            const children = yield accountTreeNode.getChildren();
            should(accountTreeNode.totalSubscriptionCount).equal(0);
            should(children).Array();
            should(children.length).equal(1);
            should(children[0]).instanceof(messageTreeNode_1.AzureResourceMessageTreeNode);
            should(children[0].nodePathValue).startWith('message_');
            should(children[0].getNodeInfo().label).equal('No Subscriptions found.');
        });
    });
    it('Should honor subscription filtering.', function () {
        return __awaiter(this, void 0, void 0, function* () {
            mockSubscriptionService.setup((o) => o.getSubscriptions(mockAccount, mockCredential)).returns(() => Promise.resolve(mockSubscriptions));
            mockSubscriptionFilterService.setup((o) => o.getSelectedSubscriptions(mockAccount)).returns(() => Promise.resolve(mockFilteredSubscriptions));
            const accountTreeNode = new accountTreeNode_1.AzureResourceAccountTreeNode(mockAccount, mockAppContext, mockTreeChangeHandler.object);
            const children = yield accountTreeNode.getChildren();
            mockSubscriptionFilterService.verify((o) => o.getSelectedSubscriptions(mockAccount), TypeMoq.Times.once());
            should(accountTreeNode.selectedSubscriptionCount).equal(mockFilteredSubscriptions.length);
            should(children.length).equal(mockFilteredSubscriptions.length);
            for (let ix = 0; ix < mockFilteredSubscriptions.length; ix++) {
                should(children[ix].nodePathValue).equal(`account_${mockAccount.key.accountId}.subscription_${mockFilteredSubscriptions[ix].id}.tenant_${mockTenantId}`);
            }
        });
    });
    it('Should handle errors.', function () {
        return __awaiter(this, void 0, void 0, function* () {
            mockSubscriptionService.setup((o) => o.getSubscriptions(mockAccount, mockCredential)).returns(() => Promise.resolve(mockSubscriptions));
            const mockError = 'Test error';
            mockSubscriptionFilterService.setup((o) => o.getSelectedSubscriptions(mockAccount)).returns(() => { throw new Error(mockError); });
            const accountTreeNode = new accountTreeNode_1.AzureResourceAccountTreeNode(mockAccount, mockAppContext, mockTreeChangeHandler.object);
            const children = yield accountTreeNode.getChildren();
            mockApiWrapper.verify((o) => o.getSecurityToken(mockAccount, sqlops.AzureResource.ResourceManagement), TypeMoq.Times.once());
            mockSubscriptionService.verify((o) => o.getSubscriptions(mockAccount, mockCredential), TypeMoq.Times.once());
            mockSubscriptionFilterService.verify((o) => o.getSelectedSubscriptions(mockAccount), TypeMoq.Times.once());
            mockCacheService.verify((o) => o.get(TypeMoq.It.isAnyString()), TypeMoq.Times.never());
            mockCacheService.verify((o) => o.update(TypeMoq.It.isAnyString(), TypeMoq.It.isAny()), TypeMoq.Times.once());
            should(children).Array();
            should(children.length).equal(1);
            should(children[0]).instanceof(messageTreeNode_1.AzureResourceMessageTreeNode);
            should(children[0].nodePathValue).startWith('message_');
            should(children[0].getNodeInfo().label).equal(`Error: ${mockError}`);
        });
    });
});
describe('AzureResourceAccountTreeNode.clearCache', function () {
    beforeEach(() => {
        mockExtensionContext = TypeMoq.Mock.ofType();
        mockApiWrapper = TypeMoq.Mock.ofType();
        mockCacheService = TypeMoq.Mock.ofType();
        mockSubscriptionService = TypeMoq.Mock.ofType();
        mockSubscriptionFilterService = TypeMoq.Mock.ofType();
        mockTenantService = TypeMoq.Mock.ofType();
        mockTreeChangeHandler = TypeMoq.Mock.ofType();
        mockSubscriptionCache = [];
        mockAppContext = new appContext_1.AppContext(mockExtensionContext.object, mockApiWrapper.object);
        mockAppContext.registerService(constants_1.AzureResourceServiceNames.cacheService, mockCacheService.object);
        mockAppContext.registerService(constants_1.AzureResourceServiceNames.subscriptionService, mockSubscriptionService.object);
        mockAppContext.registerService(constants_1.AzureResourceServiceNames.subscriptionFilterService, mockSubscriptionFilterService.object);
        mockAppContext.registerService(constants_1.AzureResourceServiceNames.tenantService, mockTenantService.object);
        mockApiWrapper.setup((o) => o.getSecurityToken(mockAccount, sqlops.AzureResource.ResourceManagement)).returns(() => Promise.resolve(mockTokens));
        mockCacheService.setup((o) => o.generateKey(TypeMoq.It.isAnyString())).returns(() => utils_1.generateGuid());
        mockCacheService.setup((o) => o.get(TypeMoq.It.isAnyString())).returns(() => mockSubscriptionCache);
        mockCacheService.setup((o) => o.update(TypeMoq.It.isAnyString(), TypeMoq.It.isAny())).returns(() => mockSubscriptionCache = mockSubscriptions);
        mockTenantService.setup((o) => o.getTenantId(TypeMoq.It.isAny())).returns(() => Promise.resolve(mockTenantId));
    });
    it('Should clear cache.', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const accountTreeNode = new accountTreeNode_1.AzureResourceAccountTreeNode(mockAccount, mockAppContext, mockTreeChangeHandler.object);
            accountTreeNode.clearCache();
            should(accountTreeNode.isClearingCache).true();
        });
    });
});
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/887f4e8985023602e599cf86bdb44df48bb28569/extensions/azurecore/out/test/azureResource/tree/accountTreeNode.test.js.map
