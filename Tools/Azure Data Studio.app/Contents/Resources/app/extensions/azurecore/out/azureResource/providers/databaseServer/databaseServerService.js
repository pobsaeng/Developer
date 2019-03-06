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
const azure_arm_sql_1 = require("azure-arm-sql");
class AzureResourceDatabaseServerService {
    getDatabaseServers(subscription, credential) {
        return __awaiter(this, void 0, void 0, function* () {
            const databaseServers = [];
            const sqlManagementClient = new azure_arm_sql_1.SqlManagementClient(credential, subscription.id);
            const svrs = yield sqlManagementClient.servers.list();
            svrs.forEach((svr) => databaseServers.push({
                name: svr.name,
                fullName: svr.fullyQualifiedDomainName,
                loginName: svr.administratorLogin,
                defaultDatabaseName: 'master'
            }));
            return databaseServers;
        });
    }
}
exports.AzureResourceDatabaseServerService = AzureResourceDatabaseServerService;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/887f4e8985023602e599cf86bdb44df48bb28569/extensions/azurecore/out/azureResource/providers/databaseServer/databaseServerService.js.map
