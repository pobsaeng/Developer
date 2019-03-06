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
class AzureResourceAccountService {
    constructor(apiWrapper) {
        this._apiWrapper = undefined;
        this._onDidChangeAccounts = undefined;
        this._apiWrapper = apiWrapper;
        this._onDidChangeAccounts = this._apiWrapper.onDidChangeAccounts;
    }
    getAccounts() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._apiWrapper.getAllAccounts();
        });
    }
    get onDidChangeAccounts() {
        return this._onDidChangeAccounts;
    }
}
exports.AzureResourceAccountService = AzureResourceAccountService;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/887f4e8985023602e599cf86bdb44df48bb28569/extensions/azurecore/out/azureResource/services/accountService.js.map
