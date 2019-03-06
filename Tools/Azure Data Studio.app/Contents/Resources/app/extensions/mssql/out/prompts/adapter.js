'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
// This code is originally from https://github.com/DonJayamanne/bowerVSCode
// License: https://github.com/DonJayamanne/bowerVSCode/blob/master/LICENSE
const vscode_1 = require("vscode");
const factory_1 = require("./factory");
const escapeException_1 = require("../escapeException");
// Supports simple pattern for prompting for user input and acting on this
class CodeAdapter {
    constructor() {
        this.outBuffer = '';
        this.messageLevelFormatters = {};
        // TODO Decide whether output channel logging should be saved here?
        this.outChannel = vscode_1.window.createOutputChannel('test');
        // this.outChannel.clear();
    }
    logError(message) {
        let line = `error: ${message.message}\n    Code - ${message.code}`;
        this.outBuffer += `${line}\n`;
        this.outChannel.appendLine(line);
    }
    formatMessage(message) {
        const prefix = `${message.level}: (${message.id}) `;
        return `${prefix}${message.message}`;
    }
    clearLog() {
        this.outChannel.clear();
    }
    showLog() {
        this.outChannel.show();
    }
    // TODO define question interface
    fixQuestion(question) {
        if (question.type === 'checkbox' && Array.isArray(question.choices)) {
            // For some reason when there's a choice of checkboxes, they aren't formatted properly
            // Not sure where the issue is
            question.choices = question.choices.map(item => {
                if (typeof (item) === 'string') {
                    return { checked: false, name: item, value: item };
                }
                else {
                    return item;
                }
            });
        }
    }
    promptSingle(question, ignoreFocusOut) {
        let questions = [question];
        return this.prompt(questions, ignoreFocusOut).then((answers) => {
            if (answers) {
                let response = answers[question.name];
                return response || undefined;
            }
        });
    }
    prompt(questions, ignoreFocusOut) {
        let answers = {};
        // Collapse multiple questions into a set of prompt steps
        let promptResult = questions.reduce((promise, question) => {
            this.fixQuestion(question);
            return promise.then(() => {
                return factory_1.default.createPrompt(question, ignoreFocusOut);
            }).then(prompt => {
                if (!question.shouldPrompt || question.shouldPrompt(answers) === true) {
                    return prompt.render().then(result => {
                        answers[question.name] = result;
                        if (question.onAnswered) {
                            question.onAnswered(result);
                        }
                        return answers;
                    });
                }
                return answers;
            });
        }, Promise.resolve());
        return promptResult.catch(err => {
            if (err instanceof escapeException_1.default || err instanceof TypeError) {
                return undefined;
            }
            vscode_1.window.showErrorMessage(err.message);
        });
    }
    // Helper to make it possible to prompt using callback pattern. Generally Promise is a preferred flow
    promptCallback(questions, callback) {
        // Collapse multiple questions into a set of prompt steps
        this.prompt(questions).then(answers => {
            if (callback) {
                callback(answers);
            }
        });
    }
}
exports.default = CodeAdapter;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/887f4e8985023602e599cf86bdb44df48bb28569/extensions/mssql/out/prompts/adapter.js.map
