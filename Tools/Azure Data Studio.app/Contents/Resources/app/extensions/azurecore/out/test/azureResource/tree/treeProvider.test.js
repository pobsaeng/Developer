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
const appContext_1 = require("../../../appContext");
const treeProvider_1 = require("../../../azureResource/tree/treeProvider");
const accountTreeNode_1 = require("../../../azureResource/tree/accountTreeNode");
const accountNotSignedInTreeNode_1 = require("../../../azureResource/tree/accountNotSignedInTreeNode");
const messageTreeNode_1 = require("../../../azureResource/messageTreeNode");
const constants_1 = require("../../../azureResource/constants");
const utils_1 = require("../../../azureResource/utils");
// Mock services
let mockAppContext;
let mockExtensionContext;
let mockApiWrapper;
let mockCacheService;
let mockAccountService;
// Mock test data
const mockAccount1 = {
    key: {
        accountId: 'mock_account_1',
        providerId: 'mock_provider'
    },
    displayInfo: {
        displayName: 'mock_account_1@test.com',
        accountType: 'Microsoft',
        contextualDisplayName: 'test'
    },
    properties: undefined,
    isStale: false
};
const mockAccount2 = {
    key: {
        accountId: 'mock_account_2',
        providerId: 'mock_provider'
    },
    displayInfo: {
        displayName: 'mock_account_2@test.com',
        accountType: 'Microsoft',
        contextualDisplayName: 'test'
    },
    properties: undefined,
    isStale: false
};
const mockAccounts = [mockAccount1, mockAccount2];
describe('AzureResourceTreeProvider.getChildren', function () {
    beforeEach(() => {
        mockExtensionContext = TypeMoq.Mock.ofType();
        mockApiWrapper = TypeMoq.Mock.ofType();
        mockCacheService = TypeMoq.Mock.ofType();
        mockAccountService = TypeMoq.Mock.ofType();
        mockAppContext = new appContext_1.AppContext(mockExtensionContext.object, mockApiWrapper.object);
        mockAppContext.registerService(constants_1.AzureResourceServiceNames.cacheService, mockCacheService.object);
        mockAppContext.registerService(constants_1.AzureResourceServiceNames.accountService, mockAccountService.object);
        mockCacheService.setup((o) => o.generateKey(TypeMoq.It.isAnyString())).returns(() => utils_1.generateGuid());
    });
    it('Should load accounts.', function () {
        return __awaiter(this, void 0, void 0, function* () {
            mockAccountService.setup((o) => o.getAccounts()).returns(() => Promise.resolve(mockAccounts));
            const treeProvider = new treeProvider_1.AzureResourceTreeProvider(mockAppContext);
            treeProvider.isSystemInitialized = true;
            const children = yield treeProvider.getChildren(undefined);
            mockAccountService.verify((o) => o.getAccounts(), TypeMoq.Times.once());
            should(children).Array();
            should(children.length).equal(mockAccounts.length);
            for (let ix = 0; ix < mockAccounts.length; ix++) {
                const child = children[ix];
                const account = mockAccounts[ix];
                should(child).instanceof(accountTreeNode_1.AzureResourceAccountTreeNode);
                should(child.nodePathValue).equal(`account_${account.key.accountId}`);
            }
        });
    });
    it('Should handle when there is no accounts.', function () {
        return __awaiter(this, void 0, void 0, function* () {
            mockAccountService.setup((o) => o.getAccounts()).returns(() => Promise.resolve(undefined));
            const treeProvider = new treeProvider_1.AzureResourceTreeProvider(mockAppContext);
            treeProvider.isSystemInitialized = true;
            const children = yield treeProvider.getChildren(undefined);
            should(children).Array();
            should(children.length).equal(1);
            should(children[0]).instanceof(accountNotSignedInTreeNode_1.AzureResourceAccountNotSignedInTreeNode);
        });
    });
    it('Should handle errors.', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const mockAccountError = 'Test account error';
            mockAccountService.setup((o) => o.getAccounts()).returns(() => { throw new Error(mockAccountError); });
            const treeProvider = new treeProvider_1.AzureResourceTreeProvider(mockAppContext);
            treeProvider.isSystemInitialized = true;
            const children = yield treeProvider.getChildren(undefined);
            mockAccountService.verify((o) => o.getAccounts(), TypeMoq.Times.once());
            should(children).Array();
            should(children.length).equal(1);
            should(children[0]).instanceof(messageTreeNode_1.AzureResourceMessageTreeNode);
            should(children[0].nodePathValue).startWith('message_');
            should(children[0].getNodeInfo().label).equal(`Error: ${mockAccountError}`);
        });
    });
});
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/887f4e8985023602e599cf86bdb44df48bb28569/extensions/azurecore/out/test/azureResource/tree/treeProvider.test.js.map
