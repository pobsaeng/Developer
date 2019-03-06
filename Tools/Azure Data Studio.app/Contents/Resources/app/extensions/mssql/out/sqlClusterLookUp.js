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
const sqlops = require("sqlops");
const constants = require("./constants");
const UUID = require("vscode-languageclient/lib/utils/uuid");
function findSqlClusterConnection(obj, appContext) {
    if (!obj || !appContext) {
        return undefined;
    }
    let sqlConnProfile;
    if ('type' in obj && obj.type === constants.ObjectExplorerService
        && 'explorerContext' in obj && obj.explorerContext && obj.explorerContext.connectionProfile) {
        sqlConnProfile = obj.explorerContext.connectionProfile;
    }
    else if ('options' in obj) {
        sqlConnProfile = obj;
    }
    let sqlClusterConnection = undefined;
    if (sqlConnProfile) {
        sqlClusterConnection = findSqlClusterConnectionBySqlConnProfile(sqlConnProfile, appContext);
    }
    return sqlClusterConnection;
}
exports.findSqlClusterConnection = findSqlClusterConnection;
function findSqlClusterConnectionBySqlConnProfile(sqlConnProfile, appContext) {
    if (!sqlConnProfile || !appContext) {
        return undefined;
    }
    let sqlOeNodeProvider = appContext.getService(constants.ObjectExplorerService);
    if (!sqlOeNodeProvider) {
        return undefined;
    }
    let sqlClusterSession = sqlOeNodeProvider.findSqlClusterSessionBySqlConnProfile(sqlConnProfile);
    if (!sqlClusterSession) {
        return undefined;
    }
    return sqlClusterSession.sqlClusterConnection;
}
function getSqlClusterConnection(obj) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!obj) {
            return undefined;
        }
        let sqlClusterConnInfo = undefined;
        if ('providerName' in obj) {
            if (obj.providerName === constants.mssqlClusterProviderName) {
                sqlClusterConnInfo = 'id' in obj ? connProfileToConnectionParam(obj) : connToConnectionParam(obj);
            }
            else {
                sqlClusterConnInfo = yield createSqlClusterConnInfo(obj);
            }
        }
        else {
            sqlClusterConnInfo = yield createSqlClusterConnInfo(obj.explorerContext.connectionProfile);
        }
        return sqlClusterConnInfo;
    });
}
exports.getSqlClusterConnection = getSqlClusterConnection;
function createSqlClusterConnInfo(sqlConnInfo) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!sqlConnInfo) {
            return undefined;
        }
        let connectionId = 'id' in sqlConnInfo ? sqlConnInfo.id : sqlConnInfo.connectionId;
        if (!connectionId) {
            return undefined;
        }
        let serverInfo = yield sqlops.connection.getServerInfo(connectionId);
        if (!serverInfo || !serverInfo.options) {
            return undefined;
        }
        let endpoints = serverInfo.options[constants.clusterEndpointsProperty];
        if (!endpoints || endpoints.length === 0) {
            return undefined;
        }
        let index = endpoints.findIndex(ep => ep.serviceName === constants.hadoopKnoxEndpointName);
        if (index < 0) {
            return undefined;
        }
        let credentials = yield sqlops.connection.getCredentials(connectionId);
        if (!credentials) {
            return undefined;
        }
        let clusterConnInfo = {
            providerName: constants.mssqlClusterProviderName,
            connectionId: UUID.generateUuid(),
            options: {}
        };
        clusterConnInfo.options[constants.hostPropName] = endpoints[index].ipAddress;
        clusterConnInfo.options[constants.knoxPortPropName] = endpoints[index].port;
        clusterConnInfo.options[constants.userPropName] = 'root'; //should be the same user as sql master
        clusterConnInfo.options[constants.passwordPropName] = credentials.password;
        clusterConnInfo = connToConnectionParam(clusterConnInfo);
        return clusterConnInfo;
    });
}
function connProfileToConnectionParam(connectionProfile) {
    let result = Object.assign(connectionProfile, { connectionId: connectionProfile.id });
    return result;
}
function connToConnectionParam(connection) {
    let connectionId = connection.connectionId;
    let options = connection.options;
    let result = Object.assign(connection, {
        serverName: `${options[constants.hostPropName]},${options[constants.knoxPortPropName]}`,
        userName: options[constants.userPropName],
        password: options[constants.passwordPropName],
        id: connectionId,
    });
    return result;
}
class ConnectionParam {
}
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/887f4e8985023602e599cf86bdb44df48bb28569/extensions/mssql/out/sqlClusterLookUp.js.map
