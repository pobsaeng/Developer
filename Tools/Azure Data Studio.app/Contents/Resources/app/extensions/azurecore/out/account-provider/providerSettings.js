/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const nls = require("vscode-nls");
const localize = nls.loadMessageBundle(__filename);
const publicAzureSettings = {
    configKey: 'enablePublicCloud',
    metadata: {
        displayName: localize(0, null),
        id: 'azurePublicCloud',
        settings: {
            host: 'https://login.microsoftonline.com/',
            clientId: 'a69788c6-1d43-44ed-9ca3-b83e194da255',
            signInResourceId: 'https://management.core.windows.net/',
            graphResource: {
                id: 'https://graph.windows.net/',
                endpoint: 'https://graph.windows.net'
            },
            armResource: {
                id: 'https://management.core.windows.net/',
                endpoint: 'https://management.azure.com'
            },
            sqlResource: {
                id: 'https://database.windows.net/',
                endpoint: 'https://database.windows.net'
            },
            redirectUri: 'http://localhost/redirect'
        }
    }
};
/* Leaving for reference
const usGovAzureSettings: ProviderSettings = {
    configKey: 'enableUsGovCloud',
    metadata: {
        displayName: localize('usGovCloudDisplayName', 'Azure (US Government)'),
        id: 'usGovAzureCloud',
        settings: {
            host: 'https://login.microsoftonline.com/',
            clientId: 'TBD',
            signInResourceId: 'https://management.core.usgovcloudapi.net/',
            graphResource: {
                id: 'https://graph.usgovcloudapi.net/',
                endpoint: 'https://graph.usgovcloudapi.net'
            },
            armResource: {
                id: 'https://management.core.usgovcloudapi.net/',
                endpoint: 'https://management.usgovcloudapi.net'
            },
            redirectUri: 'http://localhost/redirect'
        }
    }
};
const chinaAzureSettings: ProviderSettings = {
    configKey: 'enableChinaCloud',
    metadata: {
        displayName: localize('chinaCloudDisplayName', 'Azure (China)'),
        id: 'chinaAzureCloud',
        settings: {
            host: 'https://login.chinacloudapi.cn/',
            clientId: 'TBD',
            signInResourceId: 'https://management.core.chinacloudapi.cn/',
            graphResource: {
                id: 'https://graph.chinacloudapi.cn/',
                endpoint: 'https://graph.chinacloudapi.cn'
            },
            armResource: {
                id: 'https://management.core.chinacloudapi.cn/',
                endpoint: 'https://managemement.chinacloudapi.net'
            },
            redirectUri: 'http://localhost/redirect'
        }
    }
};
const germanyAzureSettings: ProviderSettings = {
    configKey: 'enableGermanyCloud',
    metadata: {
        displayName: localize('germanyCloud', 'Azure (Germany)'),
        id: 'germanyAzureCloud',
        settings: {
            host: 'https://login.microsoftazure.de/',
            clientId: 'TBD',
            signInResourceId: 'https://management.core.cloudapi.de/',
            graphResource: {
                id: 'https://graph.cloudapi.de/',
                endpoint: 'https://graph.cloudapi.de'
            },
            armResource: {
                id: 'https://management.core.cloudapi.de/',
                endpoint: 'https://management.microsoftazure.de'
            },
            redirectUri: 'http://localhost/redirect'
        }
    }
};
*/
// TODO: Enable China, Germany, and US Gov clouds: (#3031)
exports.default = [publicAzureSettings,];
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/887f4e8985023602e599cf86bdb44df48bb28569/extensions/azurecore/out/account-provider/providerSettings.js.map
