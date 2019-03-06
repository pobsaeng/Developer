/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const nls = require("vscode-nls");
const localize = nls.loadMessageBundle(__filename);
const constants = require("../constants");
const fileSources_1 = require("./fileSources");
class SqlClusterConnection {
    constructor(connectionInfo) {
        this.validate(connectionInfo);
        if ('id' in connectionInfo) {
            this._profile = connectionInfo;
            this._connection = this.toConnection(this._profile);
        }
        else {
            this._connection = connectionInfo;
            this._profile = this.toConnectionProfile(this._connection);
        }
        this._host = this._connection.options[constants.hostPropName];
        this._port = this._connection.options[constants.knoxPortPropName];
        this._user = this._connection.options[constants.userPropName];
        this._password = this._connection.options[constants.passwordPropName];
    }
    get connection() { return this._connection; }
    get profile() { return this._profile; }
    get host() { return this._host; }
    get port() { return this._port || constants.defaultKnoxPort; }
    get user() { return this._user; }
    get password() { return this._password; }
    isMatch(connection) {
        if (!connection) {
            return false;
        }
        let options1 = connection instanceof SqlClusterConnection ?
            connection._connection.options : connection.options;
        let options2 = this._connection.options;
        return [constants.hostPropName, constants.knoxPortPropName, constants.userPropName]
            .every(e => options1[e] === options2[e]);
    }
    createHdfsFileSource() {
        let options = {
            protocol: 'https',
            host: this.host,
            port: this.port,
            user: this.user,
            path: 'gateway/default/webhdfs/v1',
            requestParams: {
                auth: {
                    user: this.user,
                    pass: this.password
                }
            }
        };
        return fileSources_1.FileSourceFactory.instance.createHdfsFileSource(options);
    }
    validate(connectionInfo) {
        if (!connectionInfo) {
            throw new Error(localize(0, null));
        }
        if (!connectionInfo.options) {
            throw new Error(localize(1, null));
        }
        let missingProperties = this.getMissingProperties(connectionInfo);
        if (missingProperties && missingProperties.length > 0) {
            throw new Error(localize(2, null, missingProperties.join(', ')));
        }
    }
    getMissingProperties(connectionInfo) {
        if (!connectionInfo || !connectionInfo.options) {
            return undefined;
        }
        return [
            constants.hostPropName, constants.knoxPortPropName,
            constants.userPropName, constants.passwordPropName
        ].filter(e => connectionInfo.options[e] === undefined);
    }
    toConnection(connProfile) {
        let connection = Object.assign(connProfile, { connectionId: this._profile.id });
        return connection;
    }
    toConnectionProfile(connectionInfo) {
        let options = connectionInfo.options;
        let connProfile = Object.assign({}, connectionInfo, {
            serverName: `${options[constants.hostPropName]},${options[constants.knoxPortPropName]}`,
            userName: options[constants.userPropName],
            password: options[constants.passwordPropName],
            id: connectionInfo.connectionId,
        });
        return connProfile;
    }
}
exports.SqlClusterConnection = SqlClusterConnection;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/887f4e8985023602e599cf86bdb44df48bb28569/extensions/mssql/out/objectExplorerNodeProvider/connection.js.map
