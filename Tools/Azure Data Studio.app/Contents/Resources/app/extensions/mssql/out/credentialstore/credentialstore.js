/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const dataprotocol_client_1 = require("dataprotocol-client");
const service_downloader_1 = require("service-downloader");
const vscode_languageclient_1 = require("vscode-languageclient");
const UUID = require("vscode-languageclient/lib/utils/uuid");
const sqlops = require("sqlops");
const Contracts = require("./contracts");
const Constants = require("./constants");
const Utils = require("../utils");
class CredentialsFeature extends dataprotocol_client_1.SqlOpsFeature {
    constructor(client) {
        super(client, CredentialsFeature.messagesTypes);
    }
    fillClientCapabilities(capabilities) {
        Utils.ensure(Utils.ensure(capabilities, 'credentials'), 'credentials').dynamicRegistration = true;
    }
    initialize(capabilities) {
        this.register(this.messages, {
            id: UUID.generateUuid(),
            registerOptions: undefined
        });
    }
    registerProvider(options) {
        const client = this._client;
        let readCredential = (credentialId) => {
            return client.sendRequest(Contracts.ReadCredentialRequest.type, { credentialId });
        };
        let saveCredential = (credentialId, password) => {
            return client.sendRequest(Contracts.SaveCredentialRequest.type, { credentialId, password });
        };
        let deleteCredential = (credentialId) => {
            return client.sendRequest(Contracts.DeleteCredentialRequest.type, { credentialId });
        };
        return sqlops.credentials.registerProvider({
            deleteCredential,
            readCredential,
            saveCredential,
            handle: 0
        });
    }
}
CredentialsFeature.messagesTypes = [
    Contracts.DeleteCredentialRequest.type,
    Contracts.SaveCredentialRequest.type,
    Contracts.ReadCredentialRequest.type
];
/**
 * Implements a credential storage for Windows, Mac (darwin), or Linux.
 *
 * Allows a single credential to be stored per service (that is, one username per service);
 */
class CredentialStore {
    constructor(baseConfig) {
        if (baseConfig) {
            this._config = JSON.parse(JSON.stringify(baseConfig));
            this._config.executableFiles = ['MicrosoftSqlToolsCredentials.exe', 'MicrosoftSqlToolsCredentials'];
        }
    }
    start() {
        let serverdownloader = new service_downloader_1.ServerProvider(this._config);
        let clientOptions = {
            providerId: Constants.providerId,
            features: [CredentialsFeature]
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
        let launchArgs = Utils.getCommonLaunchArgsAndCleanupOldLogFiles('credentialstore', executablePath);
        return { command: executablePath, args: launchArgs, transport: vscode_languageclient_1.TransportKind.stdio };
    }
}
exports.CredentialStore = CredentialStore;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/887f4e8985023602e599cf86bdb44df48bb28569/extensions/mssql/out/credentialstore/credentialstore.js.map
