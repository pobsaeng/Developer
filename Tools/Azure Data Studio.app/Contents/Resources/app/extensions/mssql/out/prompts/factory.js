'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const input_1 = require("./input");
const password_1 = require("./password");
const list_1 = require("./list");
const confirm_1 = require("./confirm");
const checkbox_1 = require("./checkbox");
const expand_1 = require("./expand");
class PromptFactory {
    static createPrompt(question, ignoreFocusOut) {
        switch (question.type || 'input') {
            case 'string':
            case 'input':
                return new input_1.default(question, ignoreFocusOut);
            case 'password':
                return new password_1.default(question, ignoreFocusOut);
            case 'list':
                return new list_1.default(question, ignoreFocusOut);
            case 'confirm':
                return new confirm_1.default(question, ignoreFocusOut);
            case 'checkbox':
                return new checkbox_1.default(question, ignoreFocusOut);
            case 'expand':
                return new expand_1.default(question, ignoreFocusOut);
            default:
                throw new Error(`Could not find a prompt for question type ${question.type}`);
        }
    }
}
exports.default = PromptFactory;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/887f4e8985023602e599cf86bdb44df48bb28569/extensions/mssql/out/prompts/factory.js.map
