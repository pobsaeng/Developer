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
const vscode_1 = require("vscode");
class AzureResourceSubscriptionFilterService {
    constructor(cacheService) {
        this._config = undefined;
        this._cacheService = undefined;
        this._cacheKey = undefined;
        this._cacheService = cacheService;
        this._cacheKey = this._cacheService.generateKey('selectedSubscriptions');
    }
    getSelectedSubscriptions(account) {
        return __awaiter(this, void 0, void 0, function* () {
            let selectedSubscriptions = [];
            const cache = this._cacheService.get(this._cacheKey);
            if (cache) {
                selectedSubscriptions = cache.selectedSubscriptions[account.key.accountId];
            }
            return selectedSubscriptions;
        });
    }
    saveSelectedSubscriptions(account, selectedSubscriptions) {
        return __awaiter(this, void 0, void 0, function* () {
            let selectedSubscriptionsCache = {};
            const cache = this._cacheService.get(this._cacheKey);
            if (cache) {
                selectedSubscriptionsCache = cache.selectedSubscriptions;
            }
            if (!selectedSubscriptionsCache) {
                selectedSubscriptionsCache = {};
            }
            selectedSubscriptionsCache[account.key.accountId] = selectedSubscriptions;
            this._cacheService.update(this._cacheKey, { selectedSubscriptions: selectedSubscriptionsCache });
            const filters = [];
            for (const accountId in selectedSubscriptionsCache) {
                filters.push(...selectedSubscriptionsCache[accountId].map((subcription) => `${accountId}/${subcription.id}/${subcription.name}`));
            }
            const resourceFilterConfig = this._config.inspect(AzureResourceSubscriptionFilterService.filterConfigName);
            let configTarget = vscode_1.ConfigurationTarget.Global;
            if (resourceFilterConfig) {
                if (resourceFilterConfig.workspaceFolderValue) {
                    configTarget = vscode_1.ConfigurationTarget.WorkspaceFolder;
                }
                else if (resourceFilterConfig.workspaceValue) {
                    configTarget = vscode_1.ConfigurationTarget.Workspace;
                }
                else if (resourceFilterConfig.globalValue) {
                    configTarget = vscode_1.ConfigurationTarget.Global;
                }
            }
            yield this._config.update(AzureResourceSubscriptionFilterService.filterConfigName, filters, configTarget);
        });
    }
}
AzureResourceSubscriptionFilterService.filterConfigName = 'azure.resource.config.filter';
exports.AzureResourceSubscriptionFilterService = AzureResourceSubscriptionFilterService;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/887f4e8985023602e599cf86bdb44df48bb28569/extensions/azurecore/out/azureResource/services/subscriptionFilterService.js.map
