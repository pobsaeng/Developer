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
const nls = require("vscode-nls");
const vscode = require("vscode");
const localize = nls.loadMessageBundle(__filename);
const command_1 = require("../../objectExplorerNodeProvider/command");
const sparkJobSubmissionDialog_1 = require("./sparkJobSubmission/sparkJobSubmissionDialog");
const utils_1 = require("../../utils");
const constants = require("../../constants");
const hdfsCommands_1 = require("../../objectExplorerNodeProvider/hdfsCommands");
const LocalizedConstants = require("../../localizedConstants");
const SqlClusterLookUp = require("../../sqlClusterLookUp");
const connection_1 = require("../../objectExplorerNodeProvider/connection");
class OpenSparkJobSubmissionDialogCommand extends command_1.Command {
    constructor(appContext, outputChannel) {
        super(constants.mssqlClusterLivySubmitSparkJobCommand, appContext);
        this.outputChannel = outputChannel;
    }
    preExecute(context, args = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.execute(context, args);
        });
    }
    execute(context, ...args) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let sqlClusterConnection = undefined;
                if (context.type === constants.ObjectExplorerService) {
                    sqlClusterConnection = SqlClusterLookUp.findSqlClusterConnection(context, this.appContext);
                }
                if (!sqlClusterConnection) {
                    sqlClusterConnection = yield this.selectConnection();
                }
                let dialog = new sparkJobSubmissionDialog_1.SparkJobSubmissionDialog(sqlClusterConnection, this.appContext, this.outputChannel);
                yield dialog.openDialog();
            }
            catch (error) {
                this.appContext.apiWrapper.showErrorMessage(utils_1.getErrorMessage(error));
            }
        });
    }
    selectConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            let connectionList = yield this.apiWrapper.getActiveConnections();
            let displayList = new Array();
            let connectionMap = new Map();
            if (connectionList && connectionList.length > 0) {
                connectionList.forEach(conn => {
                    if (conn.providerName === constants.sqlProviderName) {
                        displayList.push(conn.options.host);
                        connectionMap.set(conn.options.host, conn);
                    }
                });
            }
            let selectedHost = yield vscode.window.showQuickPick(displayList, {
                placeHolder: localize(0, null)
            });
            let errorMsg = localize(1, null);
            if (!selectedHost) {
                throw new Error(errorMsg);
            }
            let sqlConnection = connectionMap.get(selectedHost);
            if (!sqlConnection) {
                throw new Error(errorMsg);
            }
            let sqlClusterConnection = yield SqlClusterLookUp.getSqlClusterConnection(sqlConnection);
            if (!sqlClusterConnection) {
                throw new Error(LocalizedConstants.sparkJobSubmissionNoSqlBigDataClusterFound);
            }
            return new connection_1.SqlClusterConnection(sqlClusterConnection);
        });
    }
}
exports.OpenSparkJobSubmissionDialogCommand = OpenSparkJobSubmissionDialogCommand;
// Open the submission dialog for a specific file path.
class OpenSparkJobSubmissionDialogFromFileCommand extends command_1.Command {
    constructor(appContext, outputChannel) {
        super(constants.mssqlClusterLivySubmitSparkJobFromFileCommand, appContext);
        this.outputChannel = outputChannel;
    }
    preExecute(context, args = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.execute(context, args);
        });
    }
    execute(context, ...args) {
        return __awaiter(this, void 0, void 0, function* () {
            let path = undefined;
            try {
                let node = yield hdfsCommands_1.getNode(context, this.appContext);
                if (node && node.hdfsPath) {
                    path = node.hdfsPath;
                }
                else {
                    this.apiWrapper.showErrorMessage(LocalizedConstants.msgMissingNodeContext);
                    return;
                }
            }
            catch (err) {
                this.apiWrapper.showErrorMessage(localize(2, null, err));
                return;
            }
            try {
                let sqlClusterConnection = undefined;
                if (context.type === constants.ObjectExplorerService) {
                    sqlClusterConnection = yield SqlClusterLookUp.findSqlClusterConnection(context, this.appContext);
                }
                if (!sqlClusterConnection) {
                    throw new Error(LocalizedConstants.sparkJobSubmissionNoSqlBigDataClusterFound);
                }
                let dialog = new sparkJobSubmissionDialog_1.SparkJobSubmissionDialog(sqlClusterConnection, this.appContext, this.outputChannel);
                yield dialog.openDialog(path);
            }
            catch (error) {
                this.appContext.apiWrapper.showErrorMessage(utils_1.getErrorMessage(error));
            }
        });
    }
}
exports.OpenSparkJobSubmissionDialogFromFileCommand = OpenSparkJobSubmissionDialogFromFileCommand;
class OpenSparkJobSubmissionDialogTask {
    constructor(appContext, outputChannel) {
        this.appContext = appContext;
        this.outputChannel = outputChannel;
    }
    execute(profile, ...args) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let sqlClusterConnection = SqlClusterLookUp.findSqlClusterConnection(profile, this.appContext);
                if (!sqlClusterConnection) {
                    throw new Error(LocalizedConstants.sparkJobSubmissionNoSqlBigDataClusterFound);
                }
                let dialog = new sparkJobSubmissionDialog_1.SparkJobSubmissionDialog(sqlClusterConnection, this.appContext, this.outputChannel);
                yield dialog.openDialog();
            }
            catch (error) {
                this.appContext.apiWrapper.showErrorMessage(utils_1.getErrorMessage(error));
            }
        });
    }
}
exports.OpenSparkJobSubmissionDialogTask = OpenSparkJobSubmissionDialogTask;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/887f4e8985023602e599cf86bdb44df48bb28569/extensions/mssql/out/sparkFeature/dialog/dialogCommands.js.map
