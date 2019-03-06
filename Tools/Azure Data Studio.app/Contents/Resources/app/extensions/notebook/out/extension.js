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
const os = require("os");
const nls = require("vscode-nls");
const localize = nls.loadMessageBundle(__filename);
const JUPYTER_NOTEBOOK_PROVIDER = 'jupyter';
const msgSampleCodeDataFrame = localize(0, null);
const noNotebookVisible = localize(1, null);
let counter = 0;
function activate(extensionContext) {
    extensionContext.subscriptions.push(vscode.commands.registerCommand('notebook.command.new', (connectionId) => {
        newNotebook(connectionId);
    }));
    extensionContext.subscriptions.push(vscode.commands.registerCommand('notebook.command.open', () => {
        openNotebook();
    }));
    extensionContext.subscriptions.push(vscode.commands.registerCommand('notebook.command.runactivecell', () => {
        runActiveCell();
    }));
    extensionContext.subscriptions.push(vscode.commands.registerCommand('notebook.command.addcode', () => {
        addCell('code');
    }));
    extensionContext.subscriptions.push(vscode.commands.registerCommand('notebook.command.addtext', () => {
        addCell('markdown');
    }));
    extensionContext.subscriptions.push(vscode.commands.registerCommand('notebook.command.analyzeNotebook', (explorerContext) => {
        analyzeNotebook(explorerContext);
    }));
}
exports.activate = activate;
function newNotebook(connectionId) {
    let title = `Untitled-${counter++}`;
    let untitledUri = vscode.Uri.parse(`untitled:${title}`);
    let options = connectionId ? {
        viewColumn: null,
        preserveFocus: true,
        preview: null,
        providerId: null,
        connectionId: connectionId,
        defaultKernel: null
    } : null;
    sqlops.nb.showNotebookDocument(untitledUri, options).then(success => {
    }, (err) => {
        vscode.window.showErrorMessage(err.message);
    });
}
function openNotebook() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let filter = {};
            // TODO support querying valid notebook file types
            filter[localize(2, null)] = ['ipynb'];
            let file = yield vscode.window.showOpenDialog({
                filters: filter
            });
            if (file) {
                let doc = yield vscode.workspace.openTextDocument(file[0]);
                vscode.window.showTextDocument(doc);
            }
        }
        catch (err) {
            vscode.window.showErrorMessage(err);
        }
    });
}
function runActiveCell() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let notebook = sqlops.nb.activeNotebookEditor;
            if (notebook) {
                yield notebook.runCell();
            }
            else {
                throw new Error(noNotebookVisible);
            }
        }
        catch (err) {
            vscode.window.showErrorMessage(err);
        }
    });
}
function addCell(cellType) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let notebook = sqlops.nb.activeNotebookEditor;
            if (notebook) {
                yield notebook.edit((editBuilder) => {
                    // TODO should prompt and handle cell placement
                    editBuilder.insertCell({
                        cell_type: cellType,
                        source: ''
                    });
                });
            }
            else {
                throw new Error(noNotebookVisible);
            }
        }
        catch (err) {
            vscode.window.showErrorMessage(err);
        }
    });
}
function analyzeNotebook(oeContext) {
    return __awaiter(this, void 0, void 0, function* () {
        // Ensure we get a unique ID for the notebook. For now we're using a different prefix to the built-in untitled files
        // to handle this. We should look into improving this in the future
        let untitledUri = vscode.Uri.parse(`untitled:Notebook-${counter++}`);
        let editor = yield sqlops.nb.showNotebookDocument(untitledUri, {
            connectionId: oeContext ? oeContext.connectionProfile.id : '',
            providerId: JUPYTER_NOTEBOOK_PROVIDER,
            preview: false,
            defaultKernel: {
                name: 'pyspark3kernel',
                display_name: 'PySpark3',
                language: 'python'
            }
        });
        if (oeContext && oeContext.nodeInfo && oeContext.nodeInfo.nodePath) {
            // Get the file path after '/HDFS'
            let hdfsPath = oeContext.nodeInfo.nodePath.substring(oeContext.nodeInfo.nodePath.indexOf('/HDFS') + '/HDFS'.length);
            if (hdfsPath.length > 0) {
                let analyzeCommand = "#" + msgSampleCodeDataFrame + os.EOL + "df = (spark.read.option(\"inferSchema\", \"true\")"
                    + os.EOL + ".option(\"header\", \"true\")" + os.EOL + ".csv('{0}'))" + os.EOL + "df.show(10)";
                editor.edit(editBuilder => {
                    editBuilder.replace(0, {
                        cell_type: 'code',
                        source: analyzeCommand.replace('{0}', hdfsPath)
                    });
                });
            }
        }
    });
}
// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/887f4e8985023602e599cf86bdb44df48bb28569/extensions/notebook/out/extension.js.map
