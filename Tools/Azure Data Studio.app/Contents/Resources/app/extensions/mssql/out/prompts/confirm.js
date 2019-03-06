'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
// This code is originally from https://github.com/DonJayamanne/bowerVSCode
// License: https://github.com/DonJayamanne/bowerVSCode/blob/master/LICENSE
const nls = require("vscode-nls");
const localize = nls.loadMessageBundle(__filename);
const vscode_1 = require("vscode");
const prompt_1 = require("./prompt");
const escapeException_1 = require("../escapeException");
class ConfirmPrompt extends prompt_1.default {
    constructor(question, ignoreFocusOut) {
        super(question, ignoreFocusOut);
    }
    render() {
        let choices = {};
        choices[localize(0, null)] = true;
        choices[localize(1, null)] = false;
        let options = this.defaultQuickPickOptions;
        options.placeHolder = this._question.message;
        return vscode_1.window.showQuickPick(Object.keys(choices), options)
            .then(result => {
            if (result === undefined) {
                throw new escapeException_1.default();
            }
            return choices[result] || false;
        });
    }
}
exports.default = ConfirmPrompt;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/887f4e8985023602e599cf86bdb44df48bb28569/extensions/mssql/out/prompts/confirm.js.map
