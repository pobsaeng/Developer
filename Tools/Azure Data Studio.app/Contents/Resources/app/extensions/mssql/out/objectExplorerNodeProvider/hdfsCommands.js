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
const sqlops = require("sqlops");
const fs = require("fs");
const fspath = require("path");
const clipboardy = require("clipboardy");
const nls = require("vscode-nls");
const localize = nls.loadMessageBundle(__filename);
const command_1 = require("./command");
const fileSources_1 = require("./fileSources");
const question_1 = require("../prompts/question");
const constants = require("../constants");
const LocalizedConstants = require("../localizedConstants");
const utils = require("../utils");
function getSaveableUri(apiWrapper, fileName, isPreview) {
    let root = utils.getUserHome();
    let workspaceFolders = apiWrapper.workspaceFolders;
    if (workspaceFolders && workspaceFolders.length > 0) {
        root = workspaceFolders[0].uri.fsPath;
    }
    // Cannot preview with a file path that already exists, so keep looking for a valid path that does not exist
    if (isPreview) {
        let fileNum = 1;
        let fileNameWithoutExtension = fspath.parse(fileName).name;
        let fileExtension = fspath.parse(fileName).ext;
        while (fs.existsSync(fspath.join(root, fileName))) {
            fileName = `${fileNameWithoutExtension}-${fileNum}${fileExtension}`;
            fileNum++;
        }
    }
    return vscode.Uri.file(fspath.join(root, fileName));
}
function getNode(context, appContext) {
    return __awaiter(this, void 0, void 0, function* () {
        let node = undefined;
        if (context && context.type === constants.ViewType && context.node) {
            node = context.node;
        }
        else if (context && context.type === constants.ObjectExplorerService) {
            let oeNodeProvider = appContext.getService(constants.ObjectExplorerService);
            if (oeNodeProvider) {
                node = yield oeNodeProvider.findSqlClusterNodeByContext(context);
            }
        }
        else {
            throw new Error(LocalizedConstants.msgMissingNodeContext);
        }
        return node;
    });
}
exports.getNode = getNode;
class UploadFilesCommand extends command_1.ProgressCommand {
    constructor(prompter, appContext) {
        super('mssqlCluster.uploadFiles', prompter, appContext);
    }
    preExecute(context, args = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.execute(context, args);
        });
    }
    execute(context, ...args) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let folderNode = yield getNode(context, this.appContext);
                const allFilesFilter = localize(0, null);
                let filter = {};
                filter[allFilesFilter] = '*';
                if (folderNode) {
                    let options = {
                        canSelectFiles: true,
                        canSelectFolders: false,
                        canSelectMany: true,
                        openLabel: localize(1, null),
                        filters: filter
                    };
                    let fileUris = yield this.apiWrapper.showOpenDialog(options);
                    if (fileUris) {
                        let files = fileUris.map(uri => uri.fsPath).map(this.mapPathsToFiles());
                        yield this.executeWithProgress((cancelToken) => __awaiter(this, void 0, void 0, function* () { return this.writeFiles(files, folderNode, cancelToken); }), localize(2, null), true, () => this.apiWrapper.showInformationMessage(localize(3, null)));
                        if (context.type === constants.ObjectExplorerService) {
                            let objectExplorerNode = yield sqlops.objectexplorer.getNode(context.explorerContext.connectionProfile.id, folderNode.getNodeInfo().nodePath);
                            yield objectExplorerNode.refresh();
                        }
                    }
                }
            }
            catch (err) {
                this.apiWrapper.showErrorMessage(localize(4, null, utils.getErrorMessage(err)));
            }
        });
    }
    mapPathsToFiles() {
        return (path) => {
            let isDir = fs.lstatSync(path).isDirectory();
            return new fileSources_1.File(path, isDir);
        };
    }
    writeFiles(files, folderNode, cancelToken) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let file of files) {
                if (cancelToken.token.isCancellationRequested) {
                    // Throw here so that all recursion is ended
                    throw new Error('Upload canceled');
                }
                if (file.isDirectory) {
                    let dirName = fspath.basename(file.path);
                    let subFolder = yield folderNode.mkdir(dirName);
                    let children = fs.readdirSync(file.path)
                        .map(childFileName => fileSources_1.joinHdfsPath(file.path, childFileName))
                        .map(this.mapPathsToFiles());
                    this.writeFiles(children, subFolder, cancelToken);
                }
                else {
                    yield folderNode.writeFile(file);
                }
            }
        });
    }
}
exports.UploadFilesCommand = UploadFilesCommand;
class MkDirCommand extends command_1.ProgressCommand {
    constructor(prompter, appContext) {
        super('mssqlCluster.mkdir', prompter, appContext);
    }
    preExecute(context, args = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.execute(context, args);
        });
    }
    execute(context, ...args) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let folderNode = yield getNode(context, this.appContext);
                if (folderNode) {
                    let fileName = yield this.getDirName();
                    if (fileName && fileName.length > 0) {
                        yield this.executeWithProgress((cancelToken) => __awaiter(this, void 0, void 0, function* () { return this.mkDir(fileName, folderNode, cancelToken); }), localize(5, null), true, () => this.apiWrapper.showInformationMessage(localize(6, null)));
                        if (context.type === constants.ObjectExplorerService) {
                            let objectExplorerNode = yield sqlops.objectexplorer.getNode(context.explorerContext.connectionProfile.id, folderNode.getNodeInfo().nodePath);
                            yield objectExplorerNode.refresh();
                        }
                    }
                }
            }
            catch (err) {
                this.apiWrapper.showErrorMessage(localize(7, null, utils.getErrorMessage(err)));
            }
        });
    }
    getDirName() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prompter.promptSingle({
                type: question_1.QuestionTypes.input,
                name: 'enterDirName',
                message: localize(8, null),
                default: ''
            }).then(confirmed => confirmed);
        });
    }
    mkDir(fileName, folderNode, cancelToken) {
        return __awaiter(this, void 0, void 0, function* () {
            let subFolder = yield folderNode.mkdir(fileName);
        });
    }
}
exports.MkDirCommand = MkDirCommand;
class DeleteFilesCommand extends command_1.Command {
    constructor(prompter, appContext) {
        super('mssqlCluster.deleteFiles', appContext);
        this.prompter = prompter;
    }
    preExecute(context, args = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.execute(context, args);
        });
    }
    execute(context, ...args) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let node = yield getNode(context, this.appContext);
                if (node) {
                    // TODO ideally would let node define if it's deletable
                    // TODO also, would like to change this to getNodeInfo as OE is the primary use case now
                    let treeItem = yield node.getTreeItem();
                    let oeNodeToRefresh = undefined;
                    if (context.type === constants.ObjectExplorerService) {
                        let oeNodeToDelete = yield sqlops.objectexplorer.getNode(context.explorerContext.connectionProfile.id, node.getNodeInfo().nodePath);
                        oeNodeToRefresh = yield oeNodeToDelete.getParent();
                    }
                    switch (treeItem.contextValue) {
                        case constants.MssqlClusterItems.Folder:
                            yield this.deleteFolder(node);
                            break;
                        case constants.MssqlClusterItems.File:
                            yield this.deleteFile(node);
                            break;
                        default:
                            return;
                    }
                    if (oeNodeToRefresh) {
                        yield oeNodeToRefresh.refresh();
                    }
                }
                else {
                    this.apiWrapper.showErrorMessage(LocalizedConstants.msgMissingNodeContext);
                }
            }
            catch (err) {
                this.apiWrapper.showErrorMessage(localize(9, null, utils.getErrorMessage(err)));
            }
        });
    }
    confirmDelete(deleteMsg) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prompter.promptSingle({
                type: question_1.QuestionTypes.confirm,
                message: deleteMsg,
                default: false
            }).then(confirmed => confirmed);
        });
    }
    deleteFolder(node) {
        return __awaiter(this, void 0, void 0, function* () {
            if (node) {
                let confirmed = yield this.confirmDelete(localize(10, null));
                if (confirmed) {
                    // TODO prompt for recursive delete if non-empty?
                    yield node.delete(true);
                }
            }
        });
    }
    deleteFile(node) {
        return __awaiter(this, void 0, void 0, function* () {
            if (node) {
                let confirmed = yield this.confirmDelete(localize(11, null));
                if (confirmed) {
                    yield node.delete();
                }
            }
        });
    }
}
exports.DeleteFilesCommand = DeleteFilesCommand;
class SaveFileCommand extends command_1.ProgressCommand {
    constructor(prompter, appContext) {
        super('mssqlCluster.saveFile', prompter, appContext);
    }
    preExecute(context, args = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.execute(context, args);
        });
    }
    execute(context, ...args) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let fileNode = yield getNode(context, this.appContext);
                if (fileNode) {
                    let defaultUri = getSaveableUri(this.apiWrapper, fspath.basename(fileNode.hdfsPath));
                    let fileUri = yield this.apiWrapper.showSaveDialog({
                        defaultUri: defaultUri
                    });
                    if (fileUri) {
                        yield this.executeWithProgress((cancelToken) => __awaiter(this, void 0, void 0, function* () { return this.doSaveAndOpen(fileUri, fileNode, cancelToken); }), localize(12, null), true, () => this.apiWrapper.showInformationMessage(localize(13, null)));
                    }
                }
                else {
                    this.apiWrapper.showErrorMessage(LocalizedConstants.msgMissingNodeContext);
                }
            }
            catch (err) {
                this.apiWrapper.showErrorMessage(localize(14, null, utils.getErrorMessage(err)));
            }
        });
    }
    doSaveAndOpen(fileUri, fileNode, cancelToken) {
        return __awaiter(this, void 0, void 0, function* () {
            yield fileNode.writeFileContentsToDisk(fileUri.fsPath, cancelToken);
            yield this.apiWrapper.executeCommand('vscode.open', fileUri);
        });
    }
}
exports.SaveFileCommand = SaveFileCommand;
class PreviewFileCommand extends command_1.ProgressCommand {
    constructor(prompter, appContext) {
        super('mssqlCluster.previewFile', prompter, appContext);
    }
    preExecute(context, args = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.execute(context, args);
        });
    }
    execute(context, ...args) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let fileNode = yield getNode(context, this.appContext);
                if (fileNode) {
                    yield this.executeWithProgress((cancelToken) => __awaiter(this, void 0, void 0, function* () {
                        let contents = yield fileNode.getFileContentsAsString(PreviewFileCommand.DefaultMaxSize);
                        let doc = yield this.openTextDocument(fspath.basename(fileNode.hdfsPath));
                        let editor = yield this.apiWrapper.showTextDocument(doc, vscode.ViewColumn.Active, false);
                        yield editor.edit(edit => {
                            edit.insert(new vscode.Position(0, 0), contents);
                        });
                    }), localize(15, null), false);
                }
                else {
                    this.apiWrapper.showErrorMessage(LocalizedConstants.msgMissingNodeContext);
                }
            }
            catch (err) {
                this.apiWrapper.showErrorMessage(localize(16, null, utils.getErrorMessage(err)));
            }
        });
    }
    openTextDocument(fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            let docUri = getSaveableUri(this.apiWrapper, fileName, true);
            if (docUri) {
                docUri = docUri.with({ scheme: constants.UNTITLED_SCHEMA });
                return yield this.apiWrapper.openTextDocument(docUri);
            }
            else {
                // Can't reliably create a filename to save as so just use untitled
                let language = fspath.extname(fileName);
                if (language && language.length > 0) {
                    // trim the '.'
                    language = language.substring(1);
                }
                return yield this.apiWrapper.openTextDocument({
                    language: language
                });
            }
        });
    }
}
PreviewFileCommand.DefaultMaxSize = 30 * 1024 * 1024;
exports.PreviewFileCommand = PreviewFileCommand;
class CopyPathCommand extends command_1.Command {
    constructor(appContext) {
        super('mssqlCluster.copyPath', appContext);
    }
    preExecute(context, args = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.execute(context, args);
        });
    }
    execute(context, ...args) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let node = yield getNode(context, this.appContext);
                if (node) {
                    let path = node.hdfsPath;
                    clipboardy.writeSync(path);
                }
                else {
                    this.apiWrapper.showErrorMessage(LocalizedConstants.msgMissingNodeContext);
                }
            }
            catch (err) {
                this.apiWrapper.showErrorMessage(localize(17, null, utils.getErrorMessage(err)));
            }
        });
    }
}
CopyPathCommand.DefaultMaxSize = 30 * 1024 * 1024;
exports.CopyPathCommand = CopyPathCommand;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/887f4e8985023602e599cf86bdb44df48bb28569/extensions/mssql/out/objectExplorerNodeProvider/hdfsCommands.js.map
