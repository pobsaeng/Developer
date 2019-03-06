'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
// This code is originally from https://github.com/DonJayamanne/bowerVSCode
// License: https://github.com/DonJayamanne/bowerVSCode/blob/master/LICENSE
const vscode_1 = require("vscode");
const prompt_1 = require("./prompt");
const escapeException_1 = require("../escapeException");
class ListPrompt extends prompt_1.default {
    constructor(question, ignoreFocusOut) {
        super(question, ignoreFocusOut);
    }
    render() {
        const choices = this._question.choices.reduce((result, choice) => {
            result[choice.name] = choice.value;
            return result;
        }, {});
        let options = this.defaultQuickPickOptions;
        options.placeHolder = this._question.message;
        return vscode_1.window.showQuickPick(Object.keys(choices), options)
            .then(result => {
            if (result === undefined) {
                throw new escapeException_1.default();
            }
            return choices[result];
        });
    }
}
exports.default = ListPrompt;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/887f4e8985023602e599cf86bdb44df48bb28569/extensions/mssql/out/prompts/list.js.map
