/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
class ControllerBase {
    constructor(appContext) {
        this.appContext = appContext;
    }
    get apiWrapper() {
        return this.appContext.apiWrapper;
    }
    get extensionContext() {
        return this.appContext && this.appContext.extensionContext;
    }
    dispose() {
        this.deactivate();
    }
}
exports.default = ControllerBase;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/887f4e8985023602e599cf86bdb44df48bb28569/extensions/azurecore/out/controllers/controllerBase.js.map