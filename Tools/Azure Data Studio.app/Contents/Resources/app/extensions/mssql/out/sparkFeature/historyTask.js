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
const vscode = require("vscode");
const utils_1 = require("../utils");
const SqlClusterLookUp = require("../sqlClusterLookUp");
class OpenSparkYarnHistoryTask {
    constructor(appContext) {
        this.appContext = appContext;
    }
    execute(sqlConnProfile, isSpark) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let sqlClusterConnection = SqlClusterLookUp.findSqlClusterConnection(sqlConnProfile, this.appContext);
                if (!sqlClusterConnection) {
                    let name = isSpark ? 'Spark' : 'Yarn';
                    this.appContext.apiWrapper.showErrorMessage(`Please connect to the Spark cluster before View ${name} History.`);
                    return;
                }
                if (isSpark) {
                    vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(this.generateSparkHistoryUrl(sqlClusterConnection.host, sqlClusterConnection.port)));
                }
                else {
                    vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(this.generateYarnHistoryUrl(sqlClusterConnection.host, sqlClusterConnection.port)));
                }
            }
            catch (error) {
                this.appContext.apiWrapper.showErrorMessage(utils_1.getErrorMessage(error));
            }
        });
    }
    generateSparkHistoryUrl(host, port) {
        return `https://${host}:${port}/gateway/default/sparkhistory/`;
    }
    generateYarnHistoryUrl(host, port) {
        return `https://${host}:${port}/gateway/default/yarn/cluster/apps`;
    }
}
exports.OpenSparkYarnHistoryTask = OpenSparkYarnHistoryTask;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/887f4e8985023602e599cf86bdb44df48bb28569/extensions/mssql/out/sparkFeature/historyTask.js.map
