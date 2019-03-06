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
const vscode_1 = require("vscode");
class AzureResourceService {
    constructor() {
        this._areResourceProvidersLoaded = false;
        this._resourceProviders = {};
        this._treeDataProviders = {};
    }
    static getInstance() {
        return AzureResourceService._instance;
    }
    listResourceProviderIds() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.ensureResourceProvidersRegistered();
            return Object.keys(this._resourceProviders);
        });
    }
    registerResourceProvider(resourceProvider) {
        this.doRegisterResourceProvider(resourceProvider);
    }
    clearResourceProviders() {
        this._resourceProviders = {};
        this._treeDataProviders = {};
        this._areResourceProvidersLoaded = false;
    }
    getRootChildren(resourceProviderId, account, subscription, tenatId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.ensureResourceProvidersRegistered();
            if (!(resourceProviderId in this._resourceProviders)) {
                throw new Error(`Azure resource provider doesn't exist. Id: ${resourceProviderId}`);
            }
            const treeDataProvider = this._treeDataProviders[resourceProviderId];
            const children = yield treeDataProvider.getChildren();
            return children.map((child) => ({
                resourceProviderId: resourceProviderId,
                resourceNode: {
                    account: account,
                    subscription: subscription,
                    tenantId: tenatId,
                    treeItem: child.treeItem
                }
            }));
        });
    }
    getChildren(resourceProviderId, element) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.ensureResourceProvidersRegistered();
            if (!(resourceProviderId in this._resourceProviders)) {
                throw new Error(`Azure resource provider doesn't exist. Id: ${resourceProviderId}`);
            }
            const treeDataProvider = this._treeDataProviders[resourceProviderId];
            const children = yield treeDataProvider.getChildren(element);
            return children.map((child) => ({
                resourceProviderId: resourceProviderId,
                resourceNode: child
            }));
        });
    }
    getTreeItem(resourceProviderId, element) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.ensureResourceProvidersRegistered();
            if (!(resourceProviderId in this._resourceProviders)) {
                throw new Error(`Azure resource provider doesn't exist. Id: ${resourceProviderId}`);
            }
            const treeDataProvider = this._treeDataProviders[resourceProviderId];
            return treeDataProvider.getTreeItem(element);
        });
    }
    get areResourceProvidersLoaded() {
        return this._areResourceProvidersLoaded;
    }
    set areResourceProvidersLoaded(value) {
        this._areResourceProvidersLoaded = value;
    }
    ensureResourceProvidersRegistered() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._areResourceProvidersLoaded) {
                return;
            }
            for (const extension of vscode_1.extensions.all) {
                const contributes = extension.packageJSON && extension.packageJSON.contributes;
                if (!contributes) {
                    continue;
                }
                if (contributes['hasAzureResourceProviders']) {
                    yield extension.activate();
                    if (extension.exports && extension.exports.provideResources) {
                        for (const resourceProvider of extension.exports.provideResources()) {
                            this.doRegisterResourceProvider(resourceProvider);
                        }
                    }
                }
            }
            this._areResourceProvidersLoaded = true;
        });
    }
    doRegisterResourceProvider(resourceProvider) {
        this._resourceProviders[resourceProvider.providerId] = resourceProvider;
        this._treeDataProviders[resourceProvider.providerId] = resourceProvider.getTreeDataProvider();
    }
}
AzureResourceService._instance = new AzureResourceService();
exports.AzureResourceService = AzureResourceService;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/887f4e8985023602e599cf86bdb44df48bb28569/extensions/azurecore/out/azureResource/resourceService.js.map
