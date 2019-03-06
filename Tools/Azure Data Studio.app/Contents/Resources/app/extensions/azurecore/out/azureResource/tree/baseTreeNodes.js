/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const treeNode_1 = require("../treeNode");
const constants_1 = require("../constants");
class AzureResourceTreeNodeBase extends treeNode_1.TreeNode {
    constructor(appContext, treeChangeHandler, parent) {
        super();
        this.appContext = appContext;
        this.treeChangeHandler = treeChangeHandler;
        this.parent = parent;
    }
}
exports.AzureResourceTreeNodeBase = AzureResourceTreeNodeBase;
class AzureResourceContainerTreeNodeBase extends AzureResourceTreeNodeBase {
    constructor(appContext, treeChangeHandler, parent) {
        super(appContext, treeChangeHandler, parent);
        this._isClearingCache = true;
        this._cacheService = undefined;
        this._cacheKey = undefined;
        this._cacheService = this.appContext.getService(constants_1.AzureResourceServiceNames.cacheService);
    }
    clearCache() {
        this._isClearingCache = true;
    }
    get isClearingCache() {
        return this._isClearingCache;
    }
    setCacheKey(id) {
        this._cacheKey = this._cacheService.generateKey(id);
    }
    updateCache(cache) {
        this._cacheService.update(this._cacheKey, cache);
    }
    getCache() {
        return this._cacheService.get(this._cacheKey);
    }
}
exports.AzureResourceContainerTreeNodeBase = AzureResourceContainerTreeNodeBase;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/887f4e8985023602e599cf86bdb44df48bb28569/extensions/azurecore/out/azureResource/tree/baseTreeNodes.js.map
