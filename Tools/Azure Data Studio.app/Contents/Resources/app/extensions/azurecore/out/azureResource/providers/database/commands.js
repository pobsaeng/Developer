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
const utils_1 = require("../../utils");
const constants_1 = require("../../constants");
function registerAzureResourceDatabaseCommands(appContext) {
    appContext.apiWrapper.registerCommand('azure.resource.connectsqldb', (node) => __awaiter(this, void 0, void 0, function* () {
        if (!node) {
            return;
        }
        const treeItem = yield node.getTreeItem();
        if (treeItem.contextValue !== constants_1.AzureResourceItemType.database) {
            return;
        }
        const resourceNode = node.resourceNodeWithProviderId.resourceNode;
        const database = resourceNode.database;
        let connectionProfile = {
            id: utils_1.generateGuid(),
            connectionName: undefined,
            serverName: database.serverFullName,
            databaseName: database.name,
            userName: database.loginName,
            password: '',
            authenticationType: 'SqlLogin',
            savePassword: true,
            groupFullName: '',
            groupId: '',
            providerName: 'MSSQL',
            saveProfile: true,
            options: {}
        };
        const conn = yield appContext.apiWrapper.openConnectionDialog(undefined, connectionProfile, { saveConnection: true, showDashboard: true });
        if (conn) {
            appContext.apiWrapper.executeCommand('workbench.view.connections');
        }
    }));
}
exports.registerAzureResourceDatabaseCommands = registerAzureResourceDatabaseCommands;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/887f4e8985023602e599cf86bdb44df48bb28569/extensions/azurecore/out/azureResource/providers/database/commands.js.map
