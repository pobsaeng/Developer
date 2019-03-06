'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
class Prompt {
    constructor(question, ignoreFocusOut) {
        this._question = question;
        this._ignoreFocusOut = ignoreFocusOut ? ignoreFocusOut : false;
    }
    get defaultQuickPickOptions() {
        return {
            ignoreFocusOut: this._ignoreFocusOut
        };
    }
    get defaultInputBoxOptions() {
        return {
            ignoreFocusOut: this._ignoreFocusOut
        };
    }
}
exports.default = Prompt;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/887f4e8985023602e599cf86bdb44df48bb28569/extensions/mssql/out/prompts/prompt.js.map
