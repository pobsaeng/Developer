/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
class AzureResourceCacheService {
    constructor(context) {
        this._context = undefined;
        this._context = context;
    }
    generateKey(id) {
        return `${AzureResourceCacheService.cacheKeyPrefix}.${id}`;
    }
    get(key) {
        return this._context.workspaceState.get(key);
    }
    update(key, value) {
        this._context.workspaceState.update(key, value);
    }
}
AzureResourceCacheService.cacheKeyPrefix = 'azure.resource.cache';
exports.AzureResourceCacheService = AzureResourceCacheService;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/887f4e8985023602e599cf86bdb44df48bb28569/extensions/azurecore/out/azureResource/services/cacheService.js.map
