/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const sqlops = require("sqlops");
const service_downloader_1 = require("service-downloader");
const dataprotocol_client_1 = require("dataprotocol-client");
const vscode_languageclient_1 = require("vscode-languageclient");
const UUID = require("vscode-languageclient/lib/utils/uuid");
const contracts_1 = require("./contracts");
const Constants = require("./constants");
const Utils = require("../utils");
class FireWallFeature extends dataprotocol_client_1.SqlOpsFeature {
    constructor(client) {
        super(client, FireWallFeature.messagesTypes);
    }
    fillClientCapabilities(capabilities) {
        Utils.ensure(Utils.ensure(capabilities, 'firewall'), 'firwall').dynamicRegistration = true;
    }
    initialize(capabilities) {
        this.register(this.messages, {
            id: UUID.generateUuid(),
            registerOptions: undefined
        });
    }
    registerProvider(options) {
        const client = this._client;
        let createFirewallRule = (account, firewallruleInfo) => {
            return client.sendRequest(contracts_1.CreateFirewallRuleRequest.type, asCreateFirewallRuleParams(account, firewallruleInfo));
        };
        let handleFirewallRule = (errorCode, errorMessage, connectionTypeId) => {
            let params = { errorCode: errorCode, errorMessage: errorMessage, connectionTypeId: connectionTypeId };
            return client.sendRequest(contracts_1.HandleFirewallRuleRequest.type, params);
        };
        return sqlops.resources.registerResourceProvider({
            displayName: 'Azure SQL Resource Provider',
            id: 'Microsoft.Azure.SQL.ResourceProvider',
            settings: {}
        }, {
            handleFirewallRule,
            createFirewallRule
        });
    }
}
FireWallFeature.messagesTypes = [
    contracts_1.CreateFirewallRuleRequest.type,
    contracts_1.HandleFirewallRuleRequest.type
];
function asCreateFirewallRuleParams(account, params) {
    return {
        account: account,
        serverName: params.serverName,
        startIpAddress: params.startIpAddress,
        endIpAddress: params.endIpAddress,
        securityTokenMappings: params.securityTokenMappings
    };
}
class AzureResourceProvider {
    constructor(baseConfig) {
        if (baseConfig) {
            this._config = JSON.parse(JSON.stringify(baseConfig));
            this._config.executableFiles = ['SqlToolsResourceProviderService.exe', 'SqlToolsResourceProviderService'];
        }
    }
    start() {
        let serverdownloader = new service_downloader_1.ServerProvider(this._config);
        let clientOptions = {
            providerId: Constants.providerId,
            features: [FireWallFeature]
        };
        serverdownloader.getOrDownloadServer().then(e => {
            let serverOptions = this.generateServerOptions(e);
            this._client = new dataprotocol_client_1.SqlOpsDataClient(Constants.serviceName, serverOptions, clientOptions);
            this._client.start();
        });
    }
    dispose() {
        if (this._client) {
            this._client.stop();
        }
    }
    generateServerOptions(executablePath) {
        let launchArgs = Utils.getCommonLaunchArgsAndCleanupOldLogFiles('resourceprovider', executablePath);
        return { command: executablePath, args: launchArgs, transport: vscode_languageclient_1.TransportKind.stdio };
    }
}
exports.AzureResourceProvider = AzureResourceProvider;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/887f4e8985023602e599cf86bdb44df48bb28569/extensions/mssql/out/resourceProvider/resourceProvider.js.map
