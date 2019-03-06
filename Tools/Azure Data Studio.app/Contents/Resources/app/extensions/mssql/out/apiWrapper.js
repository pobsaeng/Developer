/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const sqlops = require("sqlops");
/**
 * Wrapper class to act as a facade over VSCode and Data APIs and allow us to test / mock callbacks into
 * this API from our code
 *
 * @export
 * @class ApiWrapper
 */
class ApiWrapper {
    // Data APIs
    registerConnectionProvider(provider) {
        return sqlops.dataprotocol.registerConnectionProvider(provider);
    }
    registerObjectExplorerNodeProvider(provider) {
        return sqlops.dataprotocol.registerObjectExplorerNodeProvider(provider);
    }
    registerTaskServicesProvider(provider) {
        return sqlops.dataprotocol.registerTaskServicesProvider(provider);
    }
    registerFileBrowserProvider(provider) {
        return sqlops.dataprotocol.registerFileBrowserProvider(provider);
    }
    createDialog(title) {
        return sqlops.window.modelviewdialog.createDialog(title);
    }
    openDialog(dialog) {
        return sqlops.window.modelviewdialog.openDialog(dialog);
    }
    closeDialog(dialog) {
        return sqlops.window.modelviewdialog.closeDialog(dialog);
    }
    registerTaskHandler(taskId, handler) {
        sqlops.tasks.registerTask(taskId, handler);
    }
    startBackgroundOperation(operationInfo) {
        sqlops.tasks.startBackgroundOperation(operationInfo);
    }
    getActiveConnections() {
        return sqlops.connection.getActiveConnections();
    }
    // VSCode APIs
    executeCommand(command, ...rest) {
        return vscode.commands.executeCommand(command, ...rest);
    }
    registerCommand(command, callback, thisArg) {
        return vscode.commands.registerCommand(command, callback, thisArg);
    }
    showErrorMessage(message, ...items) {
        return vscode.window.showErrorMessage(message, ...items);
    }
    showWarningMessage(message, ...items) {
        return vscode.window.showWarningMessage(message, ...items);
    }
    showInformationMessage(message, ...items) {
        return vscode.window.showInformationMessage(message, ...items);
    }
    showOpenDialog(options) {
        return vscode.window.showOpenDialog(options);
    }
    showSaveDialog(options) {
        return vscode.window.showSaveDialog(options);
    }
    openTextDocument(uriOrOptions) {
        return vscode.workspace.openTextDocument(uriOrOptions);
    }
    showTextDocument(document, column, preserveFocus, preview) {
        let options = {
            viewColumn: column,
            preserveFocus: preserveFocus,
            preview: preview
        };
        return vscode.window.showTextDocument(document, options);
    }
    get workspaceFolders() {
        return vscode.workspace.workspaceFolders;
    }
    createStatusBarItem(alignment, priority) {
        return vscode.window.createStatusBarItem(alignment, priority);
    }
    createOutputChannel(name) {
        return vscode.window.createOutputChannel(name);
    }
    createTab(title) {
        return sqlops.window.modelviewdialog.createTab(title);
    }
}
exports.ApiWrapper = ApiWrapper;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/887f4e8985023602e599cf86bdb44df48bb28569/extensions/mssql/out/apiWrapper.js.map
