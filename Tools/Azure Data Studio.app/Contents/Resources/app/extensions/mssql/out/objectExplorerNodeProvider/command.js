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
const nls = require("vscode-nls");
const localize = nls.loadMessageBundle(__filename);
const treeNodes_1 = require("./treeNodes");
const question_1 = require("../prompts/question");
const utils = require("../utils");
const constants = require("../constants");
function isTextEditor(editor) {
    if (editor === undefined) {
        return false;
    }
    return editor.id !== undefined && (editor.edit !== undefined || editor.document !== undefined);
}
class Command extends vscode.Disposable {
    constructor(command, appContext) {
        super(() => this.dispose());
        this.appContext = appContext;
        this.contextParsingOptions = { editor: false, uri: false };
        if (typeof command === 'string') {
            this.disposable = this.apiWrapper.registerCommand(command, (...args) => this._execute(command, ...args), this);
            return;
        }
        const subscriptions = command.map(cmd => this.apiWrapper.registerCommand(cmd, (...args) => this._execute(cmd, ...args), this));
        this.disposable = vscode.Disposable.from(...subscriptions);
    }
    dispose() {
        this.disposable && this.disposable.dispose();
    }
    get apiWrapper() {
        return this.appContext.apiWrapper;
    }
    preExecute(...args) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.execute(...args);
        });
    }
    _execute(command, ...args) {
        // TODO consider using Telemetry.trackEvent(command);
        const [context, rest] = Command.parseContext(command, this.contextParsingOptions, ...args);
        return this.preExecute(context, ...rest);
    }
    static parseContext(command, options, ...args) {
        let editor = undefined;
        let firstArg = args[0];
        if (options.editor && (firstArg === undefined || isTextEditor(firstArg))) {
            editor = firstArg;
            args = args.slice(1);
            firstArg = args[0];
        }
        if (options.uri && (firstArg === undefined || firstArg instanceof vscode.Uri)) {
            const [uri, ...rest] = args;
            return [{ command: command, type: 'uri', editor: editor, uri: uri }, rest];
        }
        if (firstArg instanceof treeNodes_1.TreeNode) {
            const [node, ...rest] = args;
            return [{ command: command, type: constants.ViewType, node: node }, rest];
        }
        if (firstArg && utils.isObjectExplorerContext(firstArg)) {
            const [explorerContext, ...rest] = args;
            return [{ command: command, type: constants.ObjectExplorerService, explorerContext: explorerContext }, rest];
        }
        return [{ command: command, type: 'unknown', editor: editor }, args];
    }
}
exports.Command = Command;
class ProgressCommand extends Command {
    constructor(command, prompter, appContext) {
        super(command, appContext);
        this.command = command;
        this.prompter = prompter;
    }
    executeWithProgress(execution, label, isCancelable = false, onCanceled) {
        return __awaiter(this, void 0, void 0, function* () {
            let disposables = [];
            const tokenSource = new vscode.CancellationTokenSource();
            const statusBarItem = this.apiWrapper.createStatusBarItem(vscode.StatusBarAlignment.Left);
            disposables.push(vscode.Disposable.from(statusBarItem));
            statusBarItem.text = localize(0, null, label);
            if (isCancelable) {
                const cancelCommandId = `cancelProgress${ProgressCommand.progressId++}`;
                disposables.push(this.apiWrapper.registerCommand(cancelCommandId, () => __awaiter(this, void 0, void 0, function* () {
                    if (yield this.confirmCancel()) {
                        tokenSource.cancel();
                    }
                })));
                statusBarItem.tooltip = localize(1, null);
                statusBarItem.command = cancelCommandId;
            }
            statusBarItem.show();
            try {
                yield execution(tokenSource);
            }
            catch (error) {
                if (isCancelable && onCanceled && tokenSource.token.isCancellationRequested) {
                    // The error can be assumed to be due to cancelation occurring. Do the callback
                    onCanceled();
                }
                else {
                    throw error;
                }
            }
            finally {
                disposables.forEach(d => d.dispose());
            }
        });
    }
    confirmCancel() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prompter.promptSingle({
                type: question_1.QuestionTypes.confirm,
                message: localize(2, null),
                default: true
            });
        });
    }
}
ProgressCommand.progressId = 0;
exports.ProgressCommand = ProgressCommand;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/887f4e8985023602e599cf86bdb44df48bb28569/extensions/mssql/out/objectExplorerNodeProvider/command.js.map
