/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const sqlops = require("sqlops");
const types = require("./types");
const Constants = require("./constants");
var BuiltInCommands;
(function (BuiltInCommands) {
    BuiltInCommands["SetContext"] = "setContext";
})(BuiltInCommands = exports.BuiltInCommands || (exports.BuiltInCommands = {}));
var ContextKeys;
(function (ContextKeys) {
    ContextKeys["ISCLOUD"] = "mssql:iscloud";
    ContextKeys["EDITIONID"] = "mssql:engineedition";
    ContextKeys["ISCLUSTER"] = "mssql:iscluster";
    ContextKeys["SERVERMAJORVERSION"] = "mssql:servermajorversion";
})(ContextKeys = exports.ContextKeys || (exports.ContextKeys = {}));
const isCloudEditions = [
    5,
    6
];
function setCommandContext(key, value) {
    return vscode.commands.executeCommand(BuiltInCommands.SetContext, key, value);
}
exports.setCommandContext = setCommandContext;
class ContextProvider {
    constructor() {
        this._disposables = new Array();
        this._disposables.push(sqlops.workspace.onDidOpenDashboard(this.onDashboardOpen, this));
        this._disposables.push(sqlops.workspace.onDidChangeToDashboard(this.onDashboardOpen, this));
    }
    onDashboardOpen(e) {
        let iscloud;
        let edition;
        let isCluster = false;
        let serverMajorVersion;
        if (e.profile.providerName.toLowerCase() === 'mssql' && !types.isUndefinedOrNull(e.serverInfo) && !types.isUndefinedOrNull(e.serverInfo.engineEditionId)) {
            if (isCloudEditions.some(i => i === e.serverInfo.engineEditionId)) {
                iscloud = true;
            }
            else {
                iscloud = false;
            }
            edition = e.serverInfo.engineEditionId;
            if (!types.isUndefinedOrNull(e.serverInfo.options)) {
                let isBigDataCluster = e.serverInfo.options[Constants.isBigDataClusterProperty];
                if (isBigDataCluster) {
                    isCluster = isBigDataCluster;
                }
            }
            serverMajorVersion = e.serverInfo.serverMajorVersion;
        }
        if (iscloud === true || iscloud === false) {
            setCommandContext(ContextKeys.ISCLOUD, iscloud);
        }
        if (!types.isUndefinedOrNull(edition)) {
            setCommandContext(ContextKeys.EDITIONID, edition);
        }
        if (!types.isUndefinedOrNull(isCluster)) {
            setCommandContext(ContextKeys.ISCLUSTER, isCluster);
        }
        if (!types.isUndefinedOrNull(serverMajorVersion)) {
            setCommandContext(ContextKeys.SERVERMAJORVERSION, serverMajorVersion);
        }
    }
    dispose() {
        this._disposables = this._disposables.map(i => i.dispose());
    }
}
exports.default = ContextProvider;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/887f4e8985023602e599cf86bdb44df48bb28569/extensions/mssql/out/contextProvider.js.map
