'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
// This code is originally from https://github.com/DonJayamanne/bowerVSCode
// License: https://github.com/DonJayamanne/bowerVSCode/blob/master/LICENSE
const vscode_1 = require("vscode");
const prompt_1 = require("./prompt");
const escapeException_1 = require("../escapeException");
const figures = require('figures');
class CheckboxPrompt extends prompt_1.default {
    constructor(question, ignoreFocusOut) {
        super(question, ignoreFocusOut);
    }
    render() {
        let choices = this._question.choices.reduce((result, choice) => {
            let choiceName = choice.name || choice;
            result[`${choice.checked === true ? figures.radioOn : figures.radioOff} ${choiceName}`] = choice;
            return result;
        }, {});
        let options = this.defaultQuickPickOptions;
        options.placeHolder = this._question.message;
        let quickPickOptions = Object.keys(choices);
        quickPickOptions.push(figures.tick);
        return vscode_1.window.showQuickPick(quickPickOptions, options)
            .then(result => {
            if (result === undefined) {
                throw new escapeException_1.default();
            }
            if (result !== figures.tick) {
                choices[result].checked = !choices[result].checked;
                return this.render();
            }
            return this._question.choices.reduce((result2, choice) => {
                if (choice.checked === true) {
                    result2.push(choice.value);
                }
                return result2;
            }, []);
        });
    }
}
exports.default = CheckboxPrompt;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/887f4e8985023602e599cf86bdb44df48bb28569/extensions/mssql/out/prompts/checkbox.js.map
