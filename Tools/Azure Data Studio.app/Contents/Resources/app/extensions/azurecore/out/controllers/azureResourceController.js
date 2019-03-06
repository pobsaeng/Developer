/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const controllerBase_1 = require("./controllerBase");
const constants_1 = require("../azureResource/constants");
const treeProvider_1 = require("../azureResource/tree/treeProvider");
const commands_1 = require("../azureResource/commands");
const accountService_1 = require("../azureResource/services/accountService");
const subscriptionService_1 = require("../azureResource/services/subscriptionService");
const subscriptionFilterService_1 = require("../azureResource/services/subscriptionFilterService");
const cacheService_1 = require("../azureResource/services/cacheService");
const tenantService_1 = require("../azureResource/services/tenantService");
const commands_2 = require("../azureResource/providers/databaseServer/commands");
const commands_3 = require("../azureResource/providers/database/commands");
const utils_1 = require("../azureResource/utils");
class AzureResourceController extends controllerBase_1.default {
    activate() {
        this.appContext.registerService(constants_1.AzureResourceServiceNames.cacheService, new cacheService_1.AzureResourceCacheService(this.extensionContext));
        this.appContext.registerService(constants_1.AzureResourceServiceNames.accountService, new accountService_1.AzureResourceAccountService(this.apiWrapper));
        this.appContext.registerService(constants_1.AzureResourceServiceNames.subscriptionService, new subscriptionService_1.AzureResourceSubscriptionService());
        this.appContext.registerService(constants_1.AzureResourceServiceNames.subscriptionFilterService, new subscriptionFilterService_1.AzureResourceSubscriptionFilterService(new cacheService_1.AzureResourceCacheService(this.extensionContext)));
        this.appContext.registerService(constants_1.AzureResourceServiceNames.tenantService, new tenantService_1.AzureResourceTenantService());
        const azureResourceTree = new treeProvider_1.AzureResourceTreeProvider(this.appContext);
        this.extensionContext.subscriptions.push(this.apiWrapper.registerTreeDataProvider('azureResourceExplorer', azureResourceTree));
        let previousAccounts = undefined;
        this.appContext.getService(constants_1.AzureResourceServiceNames.accountService).onDidChangeAccounts((e) => {
            // the onDidChangeAccounts event will trigger in many cases where the accounts didn't actually change
            // the notifyNodeChanged event triggers a refresh which triggers a getChildren which can trigger this callback
            // this below check short-circuits the infinite callback loop
            if (!utils_1.equals(e.accounts, previousAccounts)) {
                azureResourceTree.notifyNodeChanged(undefined);
            }
            previousAccounts = e.accounts;
        });
        commands_1.registerAzureResourceCommands(this.appContext, azureResourceTree);
        commands_2.registerAzureResourceDatabaseServerCommands(this.appContext);
        commands_3.registerAzureResourceDatabaseCommands(this.appContext);
        return Promise.resolve(true);
    }
    deactivate() {
    }
}
exports.default = AzureResourceController;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/887f4e8985023602e599cf86bdb44df48bb28569/extensions/azurecore/out/controllers/azureResourceController.js.map
