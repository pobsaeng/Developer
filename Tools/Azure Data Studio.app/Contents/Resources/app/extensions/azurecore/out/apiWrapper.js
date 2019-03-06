/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const sqlops = require("sqlops");
const constants = require("./constants");
/**
 * Wrapper class to act as a facade over VSCode and Data APIs and allow us to test / mock callbacks into
 * this API from our code
 *
 * @export
 * @class ApiWrapper
 */
class ApiWrapper {
    constructor() {
        this.onDidChangeAccounts = sqlops.accounts.onDidChangeAccounts;
    }
    // Data APIs
    registerConnectionProvider(provider) {
        return sqlops.dataprotocol.registerConnectionProvider(provider);
    }
    registerObjectExplorerProvider(provider) {
        return sqlops.dataprotocol.registerObjectExplorerProvider(provider);
    }
    registerTaskServicesProvider(provider) {
        return sqlops.dataprotocol.registerTaskServicesProvider(provider);
    }
    registerFileBrowserProvider(provider) {
        return sqlops.dataprotocol.registerFileBrowserProvider(provider);
    }
    registerCapabilitiesServiceProvider(provider) {
        return sqlops.dataprotocol.registerCapabilitiesServiceProvider(provider);
    }
    registerModelViewProvider(widgetId, handler) {
        return sqlops.ui.registerModelViewProvider(widgetId, handler);
    }
    registerWebviewProvider(widgetId, handler) {
        return sqlops.dashboard.registerWebviewProvider(widgetId, handler);
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
    getCurrentConnection() {
        return sqlops.connection.getCurrentConnection();
    }
    createModelViewEditor(title, options) {
        return sqlops.workspace.createModelViewEditor(title, options);
    }
    // VSCode APIs
    createTerminal(name, shellPath, shellArgs) {
        return vscode.window.createTerminal(name, shellPath, shellArgs);
    }
    createTerminalWithOptions(options) {
        return vscode.window.createTerminal(options);
    }
    executeCommand(command, ...rest) {
        return vscode.commands.executeCommand(command, ...rest);
    }
    getFilePathRelativeToWorkspace(uri) {
        return vscode.workspace.asRelativePath(uri);
    }
    getWorkspaceFolders() {
        return vscode.workspace.workspaceFolders;
    }
    getWorkspacePathFromUri(uri) {
        let workspaceFolder = vscode.workspace.getWorkspaceFolder(uri);
        return workspaceFolder ? workspaceFolder.uri.fsPath : undefined;
    }
    registerCommand(command, callback, thisArg) {
        return vscode.commands.registerCommand(command, callback, thisArg);
    }
    registerDocumentOpenHandler(handler) {
        return vscode.workspace.onDidOpenTextDocument(handler);
    }
    registerTreeDataProvider(viewId, treeDataProvider) {
        return vscode.window.registerTreeDataProvider(viewId, treeDataProvider);
    }
    setCommandContext(key, value) {
        return vscode.commands.executeCommand(constants.BuiltInCommands.SetContext, key, value);
    }
    /**
     * Get the configuration for a extensionName
     * @param extensionName The string name of the extension to get the configuration for
     * @param resource The optional URI, as a URI object or a string, to use to get resource-scoped configurations
     */
    getConfiguration(extensionName, resource) {
        if (typeof resource === 'string') {
            try {
                resource = this.parseUri(resource);
            }
            catch (e) {
                resource = undefined;
            }
        }
        return vscode.workspace.getConfiguration(extensionName, resource);
    }
    getExtensionConfiguration() {
        return this.getConfiguration(constants.extensionConfigSectionName);
    }
    /**
     * Parse uri
     */
    parseUri(uri) {
        return vscode.Uri.parse(uri);
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
    showErrorMessage(message, ...items) {
        return vscode.window.showErrorMessage(message, ...items);
    }
    showWarningMessage(message, ...items) {
        return vscode.window.showWarningMessage(message, ...items);
    }
    showInformationMessage(message, ...items) {
        return vscode.window.showInformationMessage(message, ...items);
    }
    createStatusBarItem(alignment, priority) {
        return vscode.window.createStatusBarItem(alignment, priority);
    }
    get workspaceFolders() {
        return vscode.workspace.workspaceFolders;
    }
    createOutputChannel(name) {
        return vscode.window.createOutputChannel(name);
    }
    createWizardPage(title) {
        return sqlops.window.modelviewdialog.createWizardPage(title);
    }
    registerCompletionItemProvider(selector, provider, ...triggerCharacters) {
        return vscode.languages.registerCompletionItemProvider(selector, provider, ...triggerCharacters);
    }
    createTab(title) {
        return sqlops.window.modelviewdialog.createTab(title);
    }
    // Account APIs
    getAllAccounts() {
        return sqlops.accounts.getAllAccounts();
    }
    getSecurityToken(account, resource) {
        return sqlops.accounts.getSecurityToken(account, resource);
    }
    // Connection APIs
    openConnectionDialog(providers, initialConnectionProfile, connectionCompletionOptions) {
        return sqlops.connection.openConnectionDialog(providers, initialConnectionProfile, connectionCompletionOptions);
    }
}
exports.ApiWrapper = ApiWrapper;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/887f4e8985023602e599cf86bdb44df48bb28569/extensions/azurecore/out/apiWrapper.js.map
