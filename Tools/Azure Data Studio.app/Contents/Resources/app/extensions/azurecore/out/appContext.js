/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const apiWrapper_1 = require("./apiWrapper");
/**
 * Global context for the application
 */
class AppContext {
    constructor(extensionContext, apiWrapper) {
        this.extensionContext = extensionContext;
        this.apiWrapper = apiWrapper;
        this.serviceMap = new Map();
        this.apiWrapper = apiWrapper || new apiWrapper_1.ApiWrapper();
    }
    getService(serviceName) {
        return this.serviceMap.get(serviceName);
    }
    registerService(serviceName, service) {
        this.serviceMap.set(serviceName, service);
    }
}
exports.AppContext = AppContext;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/887f4e8985023602e599cf86bdb44df48bb28569/extensions/azurecore/out/appContext.js.map
