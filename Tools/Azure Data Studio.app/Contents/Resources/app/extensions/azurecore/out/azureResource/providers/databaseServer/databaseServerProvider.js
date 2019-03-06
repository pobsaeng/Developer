/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const databaseServerTreeDataProvider_1 = require("./databaseServerTreeDataProvider");
class AzureResourceDatabaseServerProvider {
    constructor(databaseServerService, apiWrapper, extensionContext) {
        this._databaseServerService = undefined;
        this._apiWrapper = undefined;
        this._extensionContext = undefined;
        this._databaseServerService = databaseServerService;
        this._apiWrapper = apiWrapper;
        this._extensionContext = extensionContext;
    }
    getTreeDataProvider() {
        return new databaseServerTreeDataProvider_1.AzureResourceDatabaseServerTreeDataProvider(this._databaseServerService, this._apiWrapper, this._extensionContext);
    }
    get providerId() {
        return 'azure.resource.providers.databaseServer';
    }
}
exports.AzureResourceDatabaseServerProvider = AzureResourceDatabaseServerProvider;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/887f4e8985023602e599cf86bdb44df48bb28569/extensions/azurecore/out/azureResource/providers/databaseServer/databaseServerProvider.js.map
