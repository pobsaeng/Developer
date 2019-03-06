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
const databaseServerTreeDataProvider_1 = require("../../../../azureResource/providers/databaseServer/databaseServerTreeDataProvider");
const constants_1 = require("../../../../azureResource/constants");
// Mock services
let mockDatabaseServerService;
let mockApiWrapper;
let mockExtensionContext;
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
const mockTokens = {};
mockTokens[mockTenantId] = {
    token: 'mock_token',
    tokenType: 'Bearer'
};
const mockDatabaseServers = [
    {
        name: 'mock database server 1',
        fullName: 'mock database server full name 1',
        loginName: 'mock login',
        defaultDatabaseName: 'master'
    },
    {
        name: 'mock database server 2',
        fullName: 'mock database server full name 2',
        loginName: 'mock login',
        defaultDatabaseName: 'master'
    }
];
describe('AzureResourceDatabaseServerTreeDataProvider.info', function () {
    beforeEach(() => {
        mockDatabaseServerService = TypeMoq.Mock.ofType();
        mockApiWrapper = TypeMoq.Mock.ofType();
        mockExtensionContext = TypeMoq.Mock.ofType();
    });
    it('Should be correct when created.', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const treeDataProvider = new databaseServerTreeDataProvider_1.AzureResourceDatabaseServerTreeDataProvider(mockDatabaseServerService.object, mockApiWrapper.object, mockExtensionContext.object);
            const treeItem = yield treeDataProvider.getTreeItem(mockResourceRootNode);
            should(treeItem.id).equal(mockResourceRootNode.treeItem.id);
            should(treeItem.label).equal(mockResourceRootNode.treeItem.label);
            should(treeItem.collapsibleState).equal(mockResourceRootNode.treeItem.collapsibleState);
            should(treeItem.contextValue).equal(mockResourceRootNode.treeItem.contextValue);
        });
    });
});
describe('AzureResourceDatabaseServerTreeDataProvider.getChildren', function () {
    beforeEach(() => {
        mockDatabaseServerService = TypeMoq.Mock.ofType();
        mockApiWrapper = TypeMoq.Mock.ofType();
        mockExtensionContext = TypeMoq.Mock.ofType();
        mockApiWrapper.setup((o) => o.getSecurityToken(mockAccount, sqlops.AzureResource.ResourceManagement)).returns(() => Promise.resolve(mockTokens));
        mockDatabaseServerService.setup((o) => o.getDatabaseServers(mockSubscription, TypeMoq.It.isAny())).returns(() => Promise.resolve(mockDatabaseServers));
        mockExtensionContext.setup((o) => o.asAbsolutePath(TypeMoq.It.isAnyString())).returns(() => TypeMoq.It.isAnyString());
    });
    it('Should return container node when element is undefined.', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const treeDataProvider = new databaseServerTreeDataProvider_1.AzureResourceDatabaseServerTreeDataProvider(mockDatabaseServerService.object, mockApiWrapper.object, mockExtensionContext.object);
            const children = yield treeDataProvider.getChildren();
            should(children).Array();
            should(children.length).equal(1);
            const child = children[0];
            should(child.account).undefined();
            should(child.subscription).undefined();
            should(child.tenantId).undefined();
            should(child.treeItem.id).equal('azure.resource.providers.databaseServer.treeDataProvider.databaseServerContainer');
            should(child.treeItem.label).equal('SQL Servers');
            should(child.treeItem.collapsibleState).equal(vscode.TreeItemCollapsibleState.Collapsed);
            should(child.treeItem.contextValue).equal('azure.resource.itemType.databaseServerContainer');
        });
    });
    it('Should return resource nodes when it is container node.', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const treeDataProvider = new databaseServerTreeDataProvider_1.AzureResourceDatabaseServerTreeDataProvider(mockDatabaseServerService.object, mockApiWrapper.object, mockExtensionContext.object);
            const children = yield treeDataProvider.getChildren(mockResourceRootNode);
            should(children).Array();
            should(children.length).equal(mockDatabaseServers.length);
            for (let ix = 0; ix < children.length; ix++) {
                const child = children[ix];
                const databaseServer = mockDatabaseServers[ix];
                should(child.account).equal(mockAccount);
                should(child.subscription).equal(mockSubscription);
                should(child.tenantId).equal(mockTenantId);
                should(child.treeItem.id).equal(`databaseServer_${databaseServer.name}`);
                should(child.treeItem.label).equal(databaseServer.name);
                should(child.treeItem.collapsibleState).equal(vscode.TreeItemCollapsibleState.None);
                should(child.treeItem.contextValue).equal(constants_1.AzureResourceItemType.databaseServer);
            }
        });
    });
});
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/887f4e8985023602e599cf86bdb44df48bb28569/extensions/azurecore/out/test/azureResource/providers/databaseServer/databaseServerTreeDataProvider.test.js.map
