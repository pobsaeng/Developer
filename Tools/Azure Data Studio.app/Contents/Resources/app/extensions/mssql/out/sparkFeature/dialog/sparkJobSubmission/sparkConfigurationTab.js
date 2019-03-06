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
const fspath = require("path");
const fs = require("fs");
const utils = require("../../../utils");
const LocalizedConstants = require("../../../localizedConstants");
const constants = require("../../../constants");
const sparkJobSubmissionService_1 = require("./sparkJobSubmissionService");
const localize = nls.loadMessageBundle(__filename);
class SparkConfigurationTab {
    // If path is specified, means the default source setting for this tab is HDFS file, otherwise, it would be local file.
    constructor(_dataModel, appContext, _path) {
        this._dataModel = _dataModel;
        this.appContext = appContext;
        this._path = _path;
        this._tab = this.apiWrapper.createTab(localize(0, null));
        this._tab.registerContent((modelView) => __awaiter(this, void 0, void 0, function* () {
            let builder = modelView.modelBuilder;
            let parentLayout = {
                horizontal: false,
                componentWidth: '400px'
            };
            let formContainer = builder.formContainer();
            this._jobNameInputBox = builder.inputBox().withProperties({
                placeHolder: localize(1, null),
                value: (this._path) ? fspath.basename(this._path) : ''
            }).component();
            formContainer.addFormItem({
                component: this._jobNameInputBox,
                title: localize(2, null),
                required: true
            }, parentLayout);
            this._sparkContextLabel = builder.text().withProperties({
                value: this._dataModel.getSparkClusterUrl()
            }).component();
            formContainer.addFormItem({
                component: this._sparkContextLabel,
                title: localize(3, null)
            }, parentLayout);
            this._fileSourceDropDown = builder.dropDown().withProperties({
                values: [sparkJobSubmissionService_1.SparkFileSource.Local.toString(), sparkJobSubmissionService_1.SparkFileSource.HDFS.toString()],
                value: (this._path) ? sparkJobSubmissionService_1.SparkFileSource.HDFS.toString() : sparkJobSubmissionService_1.SparkFileSource.Local.toString()
            }).component();
            this._fileSourceDropDown.onValueChanged(selection => {
                let isLocal = selection.selected === sparkJobSubmissionService_1.SparkFileSource.Local.toString();
                // Disable browser button for cloud source.
                if (this._filePickerButton) {
                    this._filePickerButton.updateProperties({
                        enabled: isLocal,
                        required: isLocal
                    });
                }
                // Clear the path When switching source.
                if (this._sparkSourceFileInputBox) {
                    this._sparkSourceFileInputBox.value = '';
                }
                if (this._localUploadDestinationLabel) {
                    if (isLocal) {
                        this._localUploadDestinationLabel.value = LocalizedConstants.sparkLocalFileDestinationHint;
                    }
                    else {
                        this._localUploadDestinationLabel.value = '';
                    }
                }
            });
            this._sparkSourceFileInputBox = builder.inputBox().withProperties({
                required: true,
                placeHolder: localize(4, null),
                value: (this._path) ? this._path : ''
            }).component();
            this._sparkSourceFileInputBox.onTextChanged(text => {
                if (this._fileSourceDropDown.value === sparkJobSubmissionService_1.SparkFileSource.Local.toString()) {
                    this._dataModel.updateModelByLocalPath(text);
                    if (this._localUploadDestinationLabel) {
                        if (text) {
                            this._localUploadDestinationLabel.value = localize(5, null, this._dataModel.hdfsSubmitFilePath);
                        }
                        else {
                            this._localUploadDestinationLabel.value = LocalizedConstants.sparkLocalFileDestinationHint;
                        }
                    }
                }
                else {
                    this._dataModel.hdfsSubmitFilePath = text;
                }
                // main class disable/enable is according to whether it's jar file.
                let isJarFile = this._dataModel.isJarFile();
                this._mainClassInputBox.updateProperties({ enabled: isJarFile, required: isJarFile });
                if (!isJarFile) {
                    // Clear main class for py file.
                    this._mainClassInputBox.value = '';
                }
            });
            this._filePickerButton = builder.button().withProperties({
                required: (this._path) ? false : true,
                enabled: (this._path) ? false : true,
                label: '•••',
                width: constants.mssqlClusterSparkJobFileSelectorButtonWidth,
                height: constants.mssqlClusterSparkJobFileSelectorButtonHeight
            }).component();
            this._filePickerButton.onDidClick(() => this.onSelectFile());
            this._sourceFlexContainer = builder.flexContainer().component();
            this._sourceFlexContainer.addItem(this._fileSourceDropDown, { flex: '0 0 auto', CSSStyles: { 'minWidth': '75px', 'marginBottom': '5px', 'paddingRight': '3px' } });
            this._sourceFlexContainer.addItem(this._sparkSourceFileInputBox, { flex: '1 1 auto', CSSStyles: { 'marginBottom': '5px', 'paddingRight': '3px' } });
            // Do not add margin for file picker button as the label forces it to have 5px margin
            this._sourceFlexContainer.addItem(this._filePickerButton, { flex: '0 0 auto' });
            this._sourceFlexContainer.setLayout({
                flexFlow: 'row',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                alignContent: 'stretch'
            });
            this._localUploadDestinationLabel = builder.text().withProperties({
                value: (this._path) ? '' : LocalizedConstants.sparkLocalFileDestinationHint
            }).component();
            this._sourceFlexContainerWithHint = builder.flexContainer().component();
            this._sourceFlexContainerWithHint.addItem(this._sourceFlexContainer, { flex: '0 0 auto' });
            this._sourceFlexContainerWithHint.addItem(this._localUploadDestinationLabel, { flex: '1 1 auto' });
            this._sourceFlexContainerWithHint.setLayout({
                flexFlow: 'column',
                width: '100%',
                justifyContent: 'center',
                alignItems: 'stretch',
                alignContent: 'stretch'
            });
            formContainer.addFormItem({
                component: this._sourceFlexContainerWithHint,
                title: localize(6, null),
                required: true
            }, parentLayout);
            this._mainClassInputBox = builder.inputBox().component();
            formContainer.addFormItem({
                component: this._mainClassInputBox,
                title: localize(7, null),
                required: true
            }, parentLayout);
            this._argumentsInputBox = builder.inputBox().component();
            formContainer.addFormItem({
                component: this._argumentsInputBox,
                title: localize(8, null)
            }, Object.assign({ info: localize(9, null) }, parentLayout));
            yield modelView.initializeModel(formContainer.component());
        }));
    }
    get tab() { return this._tab; }
    get apiWrapper() {
        return this.appContext.apiWrapper;
    }
    validate() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._jobNameInputBox.value) {
                this._dataModel.showDialogError(localize(10, null));
                return false;
            }
            if (this._fileSourceDropDown.value === sparkJobSubmissionService_1.SparkFileSource.Local.toString()) {
                if (this._sparkSourceFileInputBox.value) {
                    this._dataModel.isMainSourceFromLocal = true;
                    this._dataModel.updateModelByLocalPath(this._sparkSourceFileInputBox.value);
                }
                else {
                    this._dataModel.showDialogError(localize(11, null));
                    return false;
                }
            }
            else {
                if (this._sparkSourceFileInputBox.value) {
                    this._dataModel.isMainSourceFromLocal = false;
                    this._dataModel.hdfsSubmitFilePath = this._sparkSourceFileInputBox.value;
                }
                else {
                    this._dataModel.showDialogError(localize(12, null));
                    return false;
                }
            }
            if (this._dataModel.isJarFile() && !this._mainClassInputBox.value) {
                this._dataModel.showDialogError(localize(13, null));
                return false;
            }
            // 1. For local file Source check whether they existed.
            if (this._dataModel.isMainSourceFromLocal) {
                if (!fs.existsSync(this._dataModel.localFileSourcePath)) {
                    this._dataModel.showDialogError(LocalizedConstants.sparkJobSubmissionLocalFileNotExisted(this._dataModel.localFileSourcePath));
                    return false;
                }
            }
            else {
                // 2. Check HDFS file existed for HDFS source.
                try {
                    let isFileExisted = yield this._dataModel.isClusterFileExisted(this._dataModel.hdfsSubmitFilePath);
                    if (!isFileExisted) {
                        this._dataModel.showDialogError(localize(14, null, this._dataModel.hdfsSubmitFilePath));
                        return false;
                    }
                }
                catch (error) {
                    this._dataModel.showDialogError(localize(15, null));
                    return false;
                }
            }
            return true;
        });
    }
    onSelectFile() {
        return __awaiter(this, void 0, void 0, function* () {
            let filePath = yield this.pickFile();
            if (filePath) {
                this._sparkSourceFileInputBox.value = filePath;
            }
        });
    }
    getInputValues() {
        return [this._jobNameInputBox.value, this._mainClassInputBox.value, this._argumentsInputBox.value];
    }
    pickFile() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let filter = { 'JAR/py files': ['jar', 'py'] };
                let options = {
                    canSelectFiles: true,
                    canSelectFolders: false,
                    canSelectMany: false,
                    openLabel: localize(16, null),
                    filters: filter
                };
                let fileUris = yield this.apiWrapper.showOpenDialog(options);
                if (fileUris && fileUris[0]) {
                    return fileUris[0].fsPath;
                }
                return undefined;
            }
            catch (err) {
                this.apiWrapper.showErrorMessage(localize(17, null, utils.getErrorMessage(err)));
                return undefined;
            }
        });
    }
}
exports.SparkConfigurationTab = SparkConfigurationTab;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/887f4e8985023602e599cf86bdb44df48bb28569/extensions/mssql/out/sparkFeature/dialog/sparkJobSubmission/sparkConfigurationTab.js.map
