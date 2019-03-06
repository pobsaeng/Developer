"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
class ShowSourceCommand {
    constructor(previewManager) {
        this.previewManager = previewManager;
        this.id = 'markdown.showSource';
    }
    execute() {
        if (this.previewManager.activePreviewResource) {
            return vscode.workspace.openTextDocument(this.previewManager.activePreviewResource)
                .then(document => vscode.window.showTextDocument(document));
        }
        return undefined;
    }
}
exports.ShowSourceCommand = ShowSourceCommand;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/887f4e8985023602e599cf86bdb44df48bb28569/extensions/markdown-language-features/out/commands/showSource.js.map
