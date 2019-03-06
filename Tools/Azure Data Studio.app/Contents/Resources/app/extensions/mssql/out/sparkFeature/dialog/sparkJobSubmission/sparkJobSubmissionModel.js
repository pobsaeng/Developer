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
const nls = require("vscode-nls");
const localize = nls.loadMessageBundle(__filename);
const fs = require("fs");
const fspath = require("path");
const os = require("os");
const constants = require("../../../constants");
const LocalizedConstants = require("../../../localizedConstants");
const utils = require("../../../utils");
const sparkJobSubmissionService_1 = require("./sparkJobSubmissionService");
const fileSources_1 = require("../../../objectExplorerNodeProvider/fileSources");
// Stores important state and service methods used by the Spark Job Submission Dialog.
class SparkJobSubmissionModel {
    constructor(_sqlClusterConnection, _dialog, _appContext, requestService) {
        this._sqlClusterConnection = _sqlClusterConnection;
        this._dialog = _dialog;
        this._appContext = _appContext;
        if (!this._sqlClusterConnection || !this._dialog || !this._appContext) {
            throw new Error(localize(0, null));
        }
        this._dialogService = new sparkJobSubmissionService_1.SparkJobSubmissionService(requestService);
        this._guidForClusterFolder = utils.generateGuid();
    }
    get guidForClusterFolder() { return this._guidForClusterFolder; }
    get connection() { return this._sqlClusterConnection; }
    get dialogService() { return this._dialogService; }
    get dialog() { return this._dialog; }
    isJarFile() {
        if (this.hdfsSubmitFilePath) {
            return this.hdfsSubmitFilePath.toLowerCase().endsWith('jar');
        }
        return false;
    }
    showDialogError(message) {
        let errorLevel = sqlops.window.modelviewdialog.MessageLevel ? sqlops.window.modelviewdialog.MessageLevel : 0;
        this._dialog.message = {
            text: message,
            level: errorLevel
        };
    }
    showDialogInfo(message) {
        let infoLevel = sqlops.window.modelviewdialog.MessageLevel ? sqlops.window.modelviewdialog.MessageLevel.Information : 2;
        this._dialog.message = {
            text: message,
            level: infoLevel
        };
    }
    getSparkClusterUrl() {
        if (this._sqlClusterConnection && this._sqlClusterConnection.host && this._sqlClusterConnection.port) {
            return `https://${this._sqlClusterConnection.host}:${this._sqlClusterConnection.port}`;
        }
        // Only for safety check, Won't happen with correct Model initialize.
        return '';
    }
    submitBatchJobByLivy(submissionArgs) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!submissionArgs) {
                    return Promise.reject(localize(1, null));
                }
                submissionArgs.setSparkClusterInfo(this._sqlClusterConnection);
                let livyBatchId = yield this._dialogService.submitBatchJob(submissionArgs);
                return livyBatchId;
            }
            catch (error) {
                return Promise.reject(error);
            }
        });
    }
    getApplicationID(submissionArgs, livyBatchId, retryTime) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: whether set timeout as 15000ms
            try {
                if (!submissionArgs) {
                    return Promise.reject(localize(2, null));
                }
                if (!utils.isValidNumber(livyBatchId)) {
                    return Promise.reject(new Error(localize(3, null)));
                }
                if (!retryTime) {
                    retryTime = constants.mssqlClusterLivyRetryTimesForCheckYarnApp;
                }
                submissionArgs.setSparkClusterInfo(this._sqlClusterConnection);
                let response = undefined;
                let timeOutCount = 0;
                do {
                    timeOutCount++;
                    yield this.sleep(constants.mssqlClusterLivyTimeInMSForCheckYarnApp);
                    response = yield this._dialogService.getYarnAppId(submissionArgs, livyBatchId);
                } while (response.appId === '' && timeOutCount < retryTime);
                if (response.appId === '') {
                    return Promise.reject(localize(4, null, os.EOL, response.log));
                }
                else {
                    return response.appId;
                }
            }
            catch (error) {
                return Promise.reject(error);
            }
        });
    }
    uploadFile(localFilePath, hdfsFolderPath) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!localFilePath || !hdfsFolderPath) {
                    return Promise.reject(localize(5, null));
                }
                if (!fs.existsSync(localFilePath)) {
                    return Promise.reject(LocalizedConstants.sparkJobSubmissionLocalFileNotExisted(localFilePath));
                }
                let fileSource = this._sqlClusterConnection.createHdfsFileSource();
                yield fileSource.writeFile(new fileSources_1.File(localFilePath, false), hdfsFolderPath);
            }
            catch (error) {
                return Promise.reject(error);
            }
        });
    }
    isClusterFileExisted(path) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!path) {
                    return Promise.reject(localize(6, null));
                }
                let fileSource = this._sqlClusterConnection.createHdfsFileSource();
                return yield fileSource.exists(path);
            }
            catch (error) {
                return Promise.reject(error);
            }
        });
    }
    updateModelByLocalPath(localPath) {
        if (localPath) {
            this.localFileSourcePath = localPath;
            this.hdfsFolderDestinationPath = this.generateDestinationFolder();
            let fileName = fspath.basename(localPath);
            this.hdfsSubmitFilePath = fileSources_1.joinHdfsPath(this.hdfsFolderDestinationPath, fileName);
        }
        else {
            this.hdfsSubmitFilePath = '';
        }
    }
    // Example path: /SparkSubmission/2018/08/21/b682a6c4-1954-401e-8542-9c573d69d9c0/default_artifact.jar
    generateDestinationFolder() {
        let day = new Date();
        return `/SparkSubmission/${day.getUTCFullYear()}/${day.getUTCMonth() + 1}/${day.getUTCDate()}/${this._guidForClusterFolder}`;
    }
    // Example: https://host:30443/gateway/default/yarn/cluster/app/application_1532646201938_0057
    generateYarnUIUrl(submissionArgs, appId) {
        return `https://${submissionArgs.host}:${submissionArgs.port}/gateway/default/yarn/cluster/app/${appId}`;
    }
    // Example: https://host:30443/gateway/default/yarn/proxy/application_1532646201938_0411
    generateSparkTrackingUIUrl(submissionArgs, appId) {
        return `https://${submissionArgs.host}:${submissionArgs.port}/gateway/default/yarn/proxy/${appId}`;
    }
    // Example: https://host:30443/gateway/default/sparkhistory/history/application_1532646201938_0057/1
    generateSparkHistoryUIUrl(submissionArgs, appId) {
        return `https://${submissionArgs.host}:${submissionArgs.port}/gateway/default/sparkhistory/history/${appId}/1`;
    }
    sleep(ms) {
        return __awaiter(this, void 0, void 0, function* () {
            // tslint:disable-next-line no-string-based-set-timeout
            return new Promise(resolve => setTimeout(resolve, ms));
        });
    }
}
exports.SparkJobSubmissionModel = SparkJobSubmissionModel;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/887f4e8985023602e599cf86bdb44df48bb28569/extensions/mssql/out/sparkFeature/dialog/sparkJobSubmission/sparkJobSubmissionModel.js.map
