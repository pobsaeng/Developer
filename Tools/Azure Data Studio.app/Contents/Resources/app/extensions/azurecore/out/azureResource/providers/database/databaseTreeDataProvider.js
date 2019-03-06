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
const sqlops_1 = require("sqlops");
const vscode_1 = require("vscode");
const ms_rest_1 = require("ms-rest");
const nls = require("vscode-nls");
const localize = nls.loadMessageBundle(__filename);
const constants_1 = require("../../../azureResource/constants");
class AzureResourceDatabaseTreeDataProvider {
    constructor(databaseService, apiWrapper, extensionContext) {
        this._databaseService = undefined;
        this._apiWrapper = undefined;
        this._extensionContext = undefined;
        this._databaseService = databaseService;
        this._apiWrapper = apiWrapper;
        this._extensionContext = extensionContext;
    }
    getTreeItem(element) {
        return element.treeItem;
    }
    getChildren(element) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!element) {
                return [this.createContainerNode()];
            }
            const tokens = yield this._apiWrapper.getSecurityToken(element.account, sqlops_1.AzureResource.ResourceManagement);
            const credential = new ms_rest_1.TokenCredentials(tokens[element.tenantId].token, tokens[element.tenantId].tokenType);
            const databases = (yield this._databaseService.getDatabases(element.subscription, credential)) || [];
            return databases.map((database) => ({
                account: element.account,
                subscription: element.subscription,
                tenantId: element.tenantId,
                database: database,
                treeItem: {
                    id: `databaseServer_${database.serverFullName}.database_${database.name}`,
                    label: `${database.name} (${database.serverName})`,
                    iconPath: {
                        dark: this._extensionContext.asAbsolutePath('resources/dark/sql_database_inverse.svg'),
                        light: this._extensionContext.asAbsolutePath('resources/light/sql_database.svg')
                    },
                    collapsibleState: vscode_1.TreeItemCollapsibleState.None,
                    contextValue: constants_1.AzureResourceItemType.database
                }
            }));
        });
    }
    createContainerNode() {
        return {
            account: undefined,
            subscription: undefined,
            tenantId: undefined,
            treeItem: {
                id: AzureResourceDatabaseTreeDataProvider.containerId,
                label: AzureResourceDatabaseTreeDataProvider.containerLabel,
                iconPath: {
                    dark: this._extensionContext.asAbsolutePath('resources/dark/folder_inverse.svg'),
                    light: this._extensionContext.asAbsolutePath('resources/light/folder.svg')
                },
                collapsibleState: vscode_1.TreeItemCollapsibleState.Collapsed,
                contextValue: constants_1.AzureResourceItemType.databaseContainer
            }
        };
    }
}
AzureResourceDatabaseTreeDataProvider.containerId = 'azure.resource.providers.database.treeDataProvider.databaseContainer';
AzureResourceDatabaseTreeDataProvider.containerLabel = localize(0, null);
exports.AzureResourceDatabaseTreeDataProvider = AzureResourceDatabaseTreeDataProvider;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/887f4e8985023602e599cf86bdb44df48bb28569/extensions/azurecore/out/azureResource/providers/database/databaseTreeDataProvider.js.map
