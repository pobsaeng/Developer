'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
// This code is originally from https://github.com/DonJayamanne/bowerVSCode
// License: https://github.com/DonJayamanne/bowerVSCode/blob/master/LICENSE
const input_1 = require("./input");
class PasswordPrompt extends input_1.default {
    constructor(question, ignoreFocusOut) {
        super(question, ignoreFocusOut);
        this._options.password = true;
    }
}
exports.default = PasswordPrompt;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/887f4e8985023602e599cf86bdb44df48bb28569/extensions/mssql/out/prompts/password.js.map
