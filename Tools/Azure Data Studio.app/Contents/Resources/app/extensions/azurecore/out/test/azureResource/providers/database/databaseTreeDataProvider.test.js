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
const databaseTreeDataProvider_1 = require("../../../../azureResource/providers/database/databaseTreeDataProvider");
const constants_1 = require("../../../../azureResource/constants");
// Mock services
let mockDatabaseService;
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
const mockDatabases = [
    {
        name: 'mock database 1',
        serverName: 'mock database server 1',
        serverFullName: 'mock database server full name 1',
        loginName: 'mock login'
    },
    {
        name: 'mock database 2',
        serverName: 'mock database server 2',
        serverFullName: 'mock database server full name 2',
        loginName: 'mock login'
    }
];
describe('AzureResourceDatabaseTreeDataProvider.info', function () {
    beforeEach(() => {
        mockDatabaseService = TypeMoq.Mock.ofType();
        mockApiWrapper = TypeMoq.Mock.ofType();
        mockExtensionContext = TypeMoq.Mock.ofType();
    });
    it('Should be correct when created.', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const treeDataProvider = new databaseTreeDataProvider_1.AzureResourceDatabaseTreeDataProvider(mockDatabaseService.object, mockApiWrapper.object, mockExtensionContext.object);
            const treeItem = yield treeDataProvider.getTreeItem(mockResourceRootNode);
            should(treeItem.id).equal(mockResourceRootNode.treeItem.id);
            should(treeItem.label).equal(mockResourceRootNode.treeItem.label);
            should(treeItem.collapsibleState).equal(mockResourceRootNode.treeItem.collapsibleState);
            should(treeItem.contextValue).equal(mockResourceRootNode.treeItem.contextValue);
        });
    });
});
describe('AzureResourceDatabaseTreeDataProvider.getChildren', function () {
    beforeEach(() => {
        mockDatabaseService = TypeMoq.Mock.ofType();
        mockApiWrapper = TypeMoq.Mock.ofType();
        mockExtensionContext = TypeMoq.Mock.ofType();
        mockApiWrapper.setup((o) => o.getSecurityToken(mockAccount, sqlops.AzureResource.ResourceManagement)).returns(() => Promise.resolve(mockTokens));
        mockDatabaseService.setup((o) => o.getDatabases(mockSubscription, TypeMoq.It.isAny())).returns(() => Promise.resolve(mockDatabases));
        mockExtensionContext.setup((o) => o.asAbsolutePath(TypeMoq.It.isAnyString())).returns(() => TypeMoq.It.isAnyString());
    });
    it('Should return container node when element is undefined.', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const treeDataProvider = new databaseTreeDataProvider_1.AzureResourceDatabaseTreeDataProvider(mockDatabaseService.object, mockApiWrapper.object, mockExtensionContext.object);
            const children = yield treeDataProvider.getChildren();
            should(children).Array();
            should(children.length).equal(1);
            const child = children[0];
            should(child.account).undefined();
            should(child.subscription).undefined();
            should(child.tenantId).undefined();
            should(child.treeItem.id).equal('azure.resource.providers.database.treeDataProvider.databaseContainer');
            should(child.treeItem.label).equal('SQL Databases');
            should(child.treeItem.collapsibleState).equal(vscode.TreeItemCollapsibleState.Collapsed);
            should(child.treeItem.contextValue).equal('azure.resource.itemType.databaseContainer');
        });
    });
    it('Should return resource nodes when it is container node.', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const treeDataProvider = new databaseTreeDataProvider_1.AzureResourceDatabaseTreeDataProvider(mockDatabaseService.object, mockApiWrapper.object, mockExtensionContext.object);
            const children = yield treeDataProvider.getChildren(mockResourceRootNode);
            should(children).Array();
            should(children.length).equal(mockDatabases.length);
            for (let ix = 0; ix < children.length; ix++) {
                const child = children[ix];
                const database = mockDatabases[ix];
                should(child.account).equal(mockAccount);
                should(child.subscription).equal(mockSubscription);
                should(child.tenantId).equal(mockTenantId);
                should(child.treeItem.id).equal(`databaseServer_${database.serverFullName}.database_${database.name}`);
                should(child.treeItem.label).equal(`${database.name} (${database.serverName})`);
                should(child.treeItem.collapsibleState).equal(vscode.TreeItemCollapsibleState.None);
                should(child.treeItem.contextValue).equal(constants_1.AzureResourceItemType.database);
            }
        });
    });
});
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/887f4e8985023602e599cf86bdb44df48bb28569/extensions/azurecore/out/test/azureResource/providers/database/databaseTreeDataProvider.test.js.map
