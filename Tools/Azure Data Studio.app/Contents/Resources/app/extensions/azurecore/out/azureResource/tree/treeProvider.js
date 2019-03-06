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
const vscode_1 = require("vscode");
const timers_1 = require("timers");
const nls = require("vscode-nls");
const localize = nls.loadMessageBundle(__filename);
const accountTreeNode_1 = require("./accountTreeNode");
const accountNotSignedInTreeNode_1 = require("./accountNotSignedInTreeNode");
const messageTreeNode_1 = require("../messageTreeNode");
const baseTreeNodes_1 = require("./baseTreeNodes");
const utils_1 = require("../utils");
const constants_1 = require("../constants");
class AzureResourceTreeProvider {
    constructor(appContext) {
        this.appContext = appContext;
        this.isSystemInitialized = false;
        this._loadingTimer = undefined;
        this._onDidChangeTreeData = new vscode_1.EventEmitter();
    }
    getChildren(element) {
        return __awaiter(this, void 0, void 0, function* () {
            if (element) {
                return element.getChildren(true);
            }
            if (!this.isSystemInitialized && !this._loadingTimer) {
                this._loadingTimer = timers_1.setInterval(() => __awaiter(this, void 0, void 0, function* () {
                    try {
                        // Call sqlops.accounts.getAllAccounts() to determine whether the system has been initialized.
                        yield this.appContext.getService(constants_1.AzureResourceServiceNames.accountService).getAccounts();
                        // System has been initialized
                        this.isSystemInitialized = true;
                        if (this._loadingTimer) {
                            timers_1.clearInterval(this._loadingTimer);
                        }
                        this._onDidChangeTreeData.fire(undefined);
                    }
                    catch (error) {
                        // System not initialized yet
                        this.isSystemInitialized = false;
                    }
                }), AzureResourceTreeProvider.loadingTimerInterval);
                return [messageTreeNode_1.AzureResourceMessageTreeNode.create(AzureResourceTreeProvider.loadingLabel, undefined)];
            }
            try {
                const accounts = yield this.appContext.getService(constants_1.AzureResourceServiceNames.accountService).getAccounts();
                if (accounts && accounts.length > 0) {
                    return accounts.map((account) => new accountTreeNode_1.AzureResourceAccountTreeNode(account, this.appContext, this));
                }
                else {
                    return [new accountNotSignedInTreeNode_1.AzureResourceAccountNotSignedInTreeNode()];
                }
            }
            catch (error) {
                return [messageTreeNode_1.AzureResourceMessageTreeNode.create(utils_1.AzureResourceErrorMessageUtil.getErrorMessage(error), undefined)];
            }
        });
    }
    get onDidChangeTreeData() {
        return this._onDidChangeTreeData.event;
    }
    notifyNodeChanged(node) {
        this._onDidChangeTreeData.fire(node);
    }
    refresh(node, isClearingCache) {
        return __awaiter(this, void 0, void 0, function* () {
            if (isClearingCache) {
                if ((node instanceof baseTreeNodes_1.AzureResourceContainerTreeNodeBase)) {
                    node.clearCache();
                }
            }
            this._onDidChangeTreeData.fire(node);
        });
    }
    getTreeItem(element) {
        return element.getTreeItem();
    }
}
AzureResourceTreeProvider.loadingLabel = localize(0, null);
AzureResourceTreeProvider.loadingTimerInterval = 5000;
exports.AzureResourceTreeProvider = AzureResourceTreeProvider;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/887f4e8985023602e599cf86bdb44df48bb28569/extensions/azurecore/out/azureResource/tree/treeProvider.js.map
