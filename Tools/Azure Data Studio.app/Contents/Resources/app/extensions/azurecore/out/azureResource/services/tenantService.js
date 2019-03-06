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
const request = require("request");
class AzureResourceTenantService {
    getTenantId(subscription) {
        return __awaiter(this, void 0, void 0, function* () {
            const requestPromisified = new Promise((resolve, reject) => {
                const url = `https://management.azure.com/subscriptions/${subscription.id}?api-version=2014-04-01`;
                request(url, function (error, response, body) {
                    if (response.statusCode === 401) {
                        const tenantIdRegEx = /authorization_uri="https:\/\/login\.windows\.net\/([0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12})"/;
                        const teantIdString = response.headers['www-authenticate'];
                        if (tenantIdRegEx.test(teantIdString)) {
                            resolve(tenantIdRegEx.exec(teantIdString)[1]);
                        }
                        else {
                            reject();
                        }
                    }
                });
            });
            return yield requestPromisified;
        });
    }
}
exports.AzureResourceTenantService = AzureResourceTenantService;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/887f4e8985023602e599cf86bdb44df48bb28569/extensions/azurecore/out/azureResource/services/tenantService.js.map
