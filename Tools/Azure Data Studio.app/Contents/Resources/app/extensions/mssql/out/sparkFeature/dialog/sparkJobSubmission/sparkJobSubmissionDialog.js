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
const vscode = require("vscode");
const nls = require("vscode-nls");
const utils = require("../../../utils");
const LocalizedConstants = require("../../../localizedConstants");
const sparkJobSubmissionModel_1 = require("./sparkJobSubmissionModel");
const sparkConfigurationTab_1 = require("./sparkConfigurationTab");
const sparkJobSubmissionService_1 = require("./sparkJobSubmissionService");
const sparkAdvancedTab_1 = require("./sparkAdvancedTab");
const localize = nls.loadMessageBundle(__filename);
class SparkJobSubmissionDialog {
    constructor(sqlClusterConnection, appContext, outputChannel) {
        this.sqlClusterConnection = sqlClusterConnection;
        this.appContext = appContext;
        this.outputChannel = outputChannel;
        if (!this.sqlClusterConnection || !this.appContext || !this.outputChannel) {
            throw new Error(localize(0, null));
        }
    }
    get apiWrapper() {
        return this.appContext.apiWrapper;
    }
    openDialog(path) {
        return __awaiter(this, void 0, void 0, function* () {
            this._dialog = this.apiWrapper.createDialog(localize(1, null));
            this._dataModel = new sparkJobSubmissionModel_1.SparkJobSubmissionModel(this.sqlClusterConnection, this._dialog, this.appContext);
            this._sparkConfigTab = new sparkConfigurationTab_1.SparkConfigurationTab(this._dataModel, this.appContext, path);
            this._sparkAdvancedTab = new sparkAdvancedTab_1.SparkAdvancedTab(this.appContext);
            this._dialog.content = [this._sparkConfigTab.tab, this._sparkAdvancedTab.tab];
            this._dialog.cancelButton.label = localize(2, null);
            this._dialog.okButton.label = localize(3, null);
            this._dialog.okButton.onClick(() => this.onClickOk());
            this._dialog.registerCloseValidator(() => this.handleValidate());
            yield this.apiWrapper.openDialog(this._dialog);
        });
    }
    onClickOk() {
        let jobName = localize(4, null, this._sparkConfigTab.getInputValues()[0]);
        this.apiWrapper.startBackgroundOperation({
            connection: this.sqlClusterConnection.connection,
            displayName: jobName,
            description: jobName,
            isCancelable: false,
            operation: op => {
                this.onSubmit(op);
            }
        });
    }
    onSubmit(op) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.outputChannel.show();
                let msg = localize(5, null);
                this.outputChannel.appendLine(msg);
                // 1. Upload local file to HDFS for local source.
                if (this._dataModel.isMainSourceFromLocal) {
                    try {
                        this.outputChannel.appendLine(this.addInfoTag(LocalizedConstants.sparkJobSubmissionPrepareUploadingFile(this._dataModel.localFileSourcePath, this._dataModel.hdfsFolderDestinationPath)));
                        op.updateStatus(sqlops.TaskStatus.InProgress, LocalizedConstants.sparkJobSubmissionPrepareUploadingFile(this._dataModel.localFileSourcePath, this._dataModel.hdfsFolderDestinationPath));
                        yield this._dataModel.uploadFile(this._dataModel.localFileSourcePath, this._dataModel.hdfsFolderDestinationPath);
                        vscode.window.showInformationMessage(LocalizedConstants.sparkJobSubmissionUploadingFileSucceeded);
                        this.outputChannel.appendLine(this.addInfoTag(LocalizedConstants.sparkJobSubmissionUploadingFileSucceeded));
                        op.updateStatus(sqlops.TaskStatus.InProgress, LocalizedConstants.sparkJobSubmissionUploadingFileSucceeded);
                    }
                    catch (error) {
                        vscode.window.showErrorMessage(LocalizedConstants.sparkJobSubmissionUploadingFileFailed(utils.getErrorMessage(error)));
                        this.outputChannel.appendLine(this.addErrorTag(LocalizedConstants.sparkJobSubmissionUploadingFileFailed(utils.getErrorMessage(error))));
                        op.updateStatus(sqlops.TaskStatus.Failed, LocalizedConstants.sparkJobSubmissionUploadingFileFailed(utils.getErrorMessage(error)));
                        this.outputChannel.appendLine(LocalizedConstants.sparkJobSubmissionEndMessage);
                        return;
                    }
                }
                // 2. Submit job to cluster.
                let submissionSettings = this.getSubmissionInput();
                this.outputChannel.appendLine(this.addInfoTag(LocalizedConstants.sparkJobSubmissionPrepareSubmitJob(submissionSettings.jobName)));
                op.updateStatus(sqlops.TaskStatus.InProgress, LocalizedConstants.sparkJobSubmissionPrepareSubmitJob(submissionSettings.jobName));
                let livyBatchId = yield this._dataModel.submitBatchJobByLivy(submissionSettings);
                vscode.window.showInformationMessage(LocalizedConstants.sparkJobSubmissionSparkJobHasBeenSubmitted);
                this.outputChannel.appendLine(this.addInfoTag(LocalizedConstants.sparkJobSubmissionSparkJobHasBeenSubmitted));
                op.updateStatus(sqlops.TaskStatus.InProgress, LocalizedConstants.sparkJobSubmissionSparkJobHasBeenSubmitted);
                // 3. Get SparkHistory/YarnUI Url.
                try {
                    let appId = yield this._dataModel.getApplicationID(submissionSettings, livyBatchId);
                    let sparkHistoryUrl = this._dataModel.generateSparkHistoryUIUrl(submissionSettings, appId);
                    vscode.window.showInformationMessage(LocalizedConstants.sparkJobSubmissionSparkHistoryLinkMessage(sparkHistoryUrl));
                    this.outputChannel.appendLine(this.addInfoTag(LocalizedConstants.sparkJobSubmissionSparkHistoryLinkMessage(sparkHistoryUrl)));
                    op.updateStatus(sqlops.TaskStatus.Succeeded, LocalizedConstants.sparkJobSubmissionSparkHistoryLinkMessage(sparkHistoryUrl));
                    /*
                    // Spark Tracking URl is not working now.
                    let sparkTrackingUrl = this._dataModel.generateSparkTrackingUIUrl(submissionSettings, appId);
                    vscode.window.showInformationMessage(LocalizedConstants.sparkJobSubmissionTrackingLinkMessage(sparkTrackingUrl));
                    this.outputChannel.appendLine(this.addInfoTag(LocalizedConstants.sparkJobSubmissionTrackingLinkMessage(sparkTrackingUrl)));
                    op.updateStatus(sqlops.TaskStatus.Succeeded, LocalizedConstants.sparkJobSubmissionTrackingLinkMessage(sparkTrackingUrl));
                    */
                    let yarnUIUrl = this._dataModel.generateYarnUIUrl(submissionSettings, appId);
                    vscode.window.showInformationMessage(LocalizedConstants.sparkJobSubmissionYarnUIMessage(yarnUIUrl));
                    this.outputChannel.appendLine(this.addInfoTag(LocalizedConstants.sparkJobSubmissionYarnUIMessage(yarnUIUrl)));
                    op.updateStatus(sqlops.TaskStatus.Succeeded, LocalizedConstants.sparkJobSubmissionYarnUIMessage(yarnUIUrl));
                }
                catch (error) {
                    vscode.window.showErrorMessage(LocalizedConstants.sparkJobSubmissionGetApplicationIdFailed(utils.getErrorMessage(error)));
                    this.outputChannel.appendLine(this.addErrorTag(LocalizedConstants.sparkJobSubmissionGetApplicationIdFailed(utils.getErrorMessage(error))));
                    op.updateStatus(sqlops.TaskStatus.Failed, LocalizedConstants.sparkJobSubmissionGetApplicationIdFailed(utils.getErrorMessage(error)));
                    this.outputChannel.appendLine(LocalizedConstants.sparkJobSubmissionEndMessage);
                    return;
                }
                this.outputChannel.appendLine(LocalizedConstants.sparkJobSubmissionEndMessage);
            }
            catch (error) {
                vscode.window.showErrorMessage(LocalizedConstants.sparkJobSubmissionSubmitJobFailed(utils.getErrorMessage(error)));
                this.outputChannel.appendLine(this.addErrorTag(LocalizedConstants.sparkJobSubmissionSubmitJobFailed(utils.getErrorMessage(error))));
                op.updateStatus(sqlops.TaskStatus.Failed, LocalizedConstants.sparkJobSubmissionSubmitJobFailed(utils.getErrorMessage(error)));
                this.outputChannel.appendLine(LocalizedConstants.sparkJobSubmissionEndMessage);
            }
        });
    }
    handleValidate() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._sparkConfigTab.validate();
        });
    }
    getSubmissionInput() {
        let generalConfig = this._sparkConfigTab.getInputValues();
        let advancedConfig = this._sparkAdvancedTab.getInputValues();
        return new sparkJobSubmissionService_1.SparkJobSubmissionInput(generalConfig[0], this._dataModel.hdfsSubmitFilePath, generalConfig[1], generalConfig[2], advancedConfig[0], advancedConfig[1], advancedConfig[2]);
    }
    addInfoTag(info) {
        return `[Info]  ${info}`;
    }
    addErrorTag(error) {
        return `[Error] ${error}`;
    }
}
exports.SparkJobSubmissionDialog = SparkJobSubmissionDialog;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/887f4e8985023602e599cf86bdb44df48bb28569/extensions/mssql/out/sparkFeature/dialog/sparkJobSubmission/sparkJobSubmissionDialog.js.map
