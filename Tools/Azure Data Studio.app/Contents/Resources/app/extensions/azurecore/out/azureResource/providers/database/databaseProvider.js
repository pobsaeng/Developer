/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const databaseTreeDataProvider_1 = require("./databaseTreeDataProvider");
class AzureResourceDatabaseProvider {
    constructor(databaseService, apiWrapper, extensionContext) {
        this._databaseService = undefined;
        this._apiWrapper = undefined;
        this._extensionContext = undefined;
        this._databaseService = databaseService;
        this._apiWrapper = apiWrapper;
        this._extensionContext = extensionContext;
    }
    getTreeDataProvider() {
        return new databaseTreeDataProvider_1.AzureResourceDatabaseTreeDataProvider(this._databaseService, this._apiWrapper, this._extensionContext);
    }
    get providerId() {
        return 'azure.resource.providers.database';
    }
}
exports.AzureResourceDatabaseProvider = AzureResourceDatabaseProvider;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/887f4e8985023602e599cf86bdb44df48bb28569/extensions/azurecore/out/azureResource/providers/database/databaseProvider.js.map
