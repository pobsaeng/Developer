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
const nls = require("vscode-nls");
const localize = nls.loadMessageBundle(__filename);
class SparkAdvancedTab {
    constructor(appContext) {
        this.appContext = appContext;
        this._tab = this.apiWrapper.createTab(localize(0, null));
        this._tab.registerContent((modelView) => __awaiter(this, void 0, void 0, function* () {
            let builder = modelView.modelBuilder;
            let parentLayout = {
                horizontal: false,
                componentWidth: '400px'
            };
            let formContainer = builder.formContainer();
            this._referenceJARFilesInputBox = builder.inputBox().component();
            formContainer.addFormItem({
                component: this._referenceJARFilesInputBox,
                title: localize(1, null)
            }, Object.assign({
                info: localize(2, null)
            }, parentLayout));
            this._referencePyFilesInputBox = builder.inputBox().component();
            formContainer.addFormItem({
                component: this._referencePyFilesInputBox,
                title: localize(3, null)
            }, Object.assign({
                info: localize(4, null)
            }, parentLayout));
            this._referenceFilesInputBox = builder.inputBox().component();
            formContainer.addFormItem({
                component: this._referenceFilesInputBox,
                title: localize(5, null)
            }, Object.assign({
                info: localize(6, null)
            }, parentLayout));
            yield modelView.initializeModel(formContainer.component());
        }));
    }
    get tab() { return this._tab; }
    get apiWrapper() {
        return this.appContext.apiWrapper;
    }
    getInputValues() {
        return [this._referenceJARFilesInputBox.value, this._referencePyFilesInputBox.value, this._referenceFilesInputBox.value];
    }
}
exports.SparkAdvancedTab = SparkAdvancedTab;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/887f4e8985023602e599cf86bdb44df48bb28569/extensions/mssql/out/sparkFeature/dialog/sparkJobSubmission/sparkAdvancedTab.js.map
