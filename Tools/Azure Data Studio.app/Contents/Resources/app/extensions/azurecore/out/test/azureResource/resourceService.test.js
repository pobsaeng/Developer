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
require("mocha");
const assert_1 = require("assert");
const resourceService_1 = require("../../azureResource/resourceService");
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
describe('AzureResourceService.listResourceProviderIds', function () {
    beforeEach(() => {
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
        resourceService.areResourceProvidersLoaded = true;
    });
    it('Should be correct when registering providers.', function () {
        return __awaiter(this, void 0, void 0, function* () {
            resourceService.registerResourceProvider(mockResourceProvider1.object);
            let providerIds = yield resourceService.listResourceProviderIds();
            should(providerIds).Array();
            should(providerIds.length).equal(1);
            should(providerIds[0]).equal(mockResourceProvider1.object.providerId);
            resourceService.registerResourceProvider(mockResourceProvider2.object);
            providerIds = yield resourceService.listResourceProviderIds();
            should(providerIds).Array();
            should(providerIds.length).equal(2);
            should(providerIds[0]).equal(mockResourceProvider1.object.providerId);
            should(providerIds[1]).equal(mockResourceProvider2.object.providerId);
        });
    });
});
describe('AzureResourceService.getRootChildren', function () {
    beforeEach(() => {
        mockResourceTreeDataProvider1 = TypeMoq.Mock.ofType();
        mockResourceTreeDataProvider1.setup((o) => o.getChildren()).returns(() => Promise.resolve([TypeMoq.Mock.ofType().object]));
        mockResourceTreeDataProvider1.setup((o) => o.getTreeItem(TypeMoq.It.isAny())).returns(() => Promise.resolve(TypeMoq.It.isAny()));
        mockResourceProvider1 = TypeMoq.Mock.ofType();
        mockResourceProvider1.setup((o) => o.providerId).returns(() => 'mockResourceProvider1');
        mockResourceProvider1.setup((o) => o.getTreeDataProvider()).returns(() => mockResourceTreeDataProvider1.object);
        resourceService.clearResourceProviders();
        resourceService.registerResourceProvider(mockResourceProvider1.object);
        resourceService.areResourceProvidersLoaded = true;
    });
    it('Should be correct when provider id is correct.', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const children = yield resourceService.getRootChildren(mockResourceProvider1.object.providerId, mockAccount, mockSubscription, mockTenantId);
            should(children).Array();
        });
    });
    it('Should throw exceptions when provider id is incorrect.', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const providerId = 'non_existent_provider_id';
            try {
                yield resourceService.getRootChildren(providerId, mockAccount, mockSubscription, mockTenantId);
            }
            catch (error) {
                should(error.message).equal(`Azure resource provider doesn't exist. Id: ${providerId}`);
                return;
            }
            assert_1.fail();
        });
    });
});
describe('AzureResourceService.getChildren', function () {
    beforeEach(() => {
        mockResourceTreeDataProvider1 = TypeMoq.Mock.ofType();
        mockResourceTreeDataProvider1.setup((o) => o.getChildren()).returns(() => Promise.resolve([TypeMoq.Mock.ofType().object]));
        mockResourceTreeDataProvider1.setup((o) => o.getChildren(TypeMoq.It.isAny())).returns(() => Promise.resolve([TypeMoq.Mock.ofType().object]));
        mockResourceTreeDataProvider1.setup((o) => o.getTreeItem(TypeMoq.It.isAny())).returns(() => Promise.resolve(TypeMoq.It.isAny()));
        mockResourceProvider1 = TypeMoq.Mock.ofType();
        mockResourceProvider1.setup((o) => o.providerId).returns(() => 'mockResourceProvider1');
        mockResourceProvider1.setup((o) => o.getTreeDataProvider()).returns(() => mockResourceTreeDataProvider1.object);
        resourceService.clearResourceProviders();
        resourceService.registerResourceProvider(mockResourceProvider1.object);
        resourceService.areResourceProvidersLoaded = true;
    });
    it('Should be correct when provider id is correct.', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const children = yield resourceService.getChildren(mockResourceProvider1.object.providerId, TypeMoq.It.isAny());
            should(children).Array();
        });
    });
    it('Should throw exceptions when provider id is incorrect.', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const providerId = 'non_existent_provider_id';
            try {
                yield resourceService.getRootChildren(providerId, mockAccount, mockSubscription, mockTenantId);
            }
            catch (error) {
                should(error.message).equal(`Azure resource provider doesn't exist. Id: ${providerId}`);
                return;
            }
            assert_1.fail();
        });
    });
});
describe('AzureResourceService.getTreeItem', function () {
    beforeEach(() => {
        mockResourceTreeDataProvider1 = TypeMoq.Mock.ofType();
        mockResourceTreeDataProvider1.setup((o) => o.getChildren()).returns(() => Promise.resolve([TypeMoq.Mock.ofType().object]));
        mockResourceTreeDataProvider1.setup((o) => o.getChildren(TypeMoq.It.isAny())).returns(() => Promise.resolve([TypeMoq.Mock.ofType().object]));
        mockResourceTreeDataProvider1.setup((o) => o.getTreeItem(TypeMoq.It.isAny())).returns(() => Promise.resolve(TypeMoq.It.isAny()));
        mockResourceProvider1 = TypeMoq.Mock.ofType();
        mockResourceProvider1.setup((o) => o.providerId).returns(() => 'mockResourceProvider1');
        mockResourceProvider1.setup((o) => o.getTreeDataProvider()).returns(() => mockResourceTreeDataProvider1.object);
        resourceService.clearResourceProviders();
        resourceService.registerResourceProvider(mockResourceProvider1.object);
        resourceService.areResourceProvidersLoaded = true;
    });
    it('Should be correct when provider id is correct.', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const treeItem = yield resourceService.getTreeItem(mockResourceProvider1.object.providerId, TypeMoq.It.isAny());
            should(treeItem).Object();
        });
    });
    it('Should throw exceptions when provider id is incorrect.', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const providerId = 'non_existent_provider_id';
            try {
                yield resourceService.getRootChildren(providerId, mockAccount, mockSubscription, mockTenantId);
            }
            catch (error) {
                should(error.message).equal(`Azure resource provider doesn't exist. Id: ${providerId}`);
                return;
            }
            assert_1.fail();
        });
    });
});
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/887f4e8985023602e599cf86bdb44df48bb28569/extensions/azurecore/out/test/azureResource/resourceService.test.js.map
