"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ShowNotebookPreview {
    constructor(engine) {
        this.engine = engine;
        this.id = 'notebook.showPreview';
    }
    async execute(document, textContent) {
        return this.engine.renderText(document, textContent);
    }
}
exports.ShowNotebookPreview = ShowNotebookPreview;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/887f4e8985023602e599cf86bdb44df48bb28569/extensions/markdown-language-features/out/commands/showNotebookPreview.js.map
