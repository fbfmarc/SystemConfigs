"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
class TextEditor {
    constructor(vsEditor) {
        this.extractTextFromSelection = (selection) => this.vsEditor.document.getText(selection);
        this.vsEditor = vsEditor;
    }
    get fileName() {
        return path_1.basename(this.vsEditor.document.fileName);
    }
    get viewColumn() {
        return this.vsEditor.viewColumn;
    }
    get selectedText() {
        const validSelections = this.collectNonEmptySelections(this.vsEditor.selections);
        return this.extractText(validSelections);
    }
    get selectedLineRanges() {
        const validSelections = this.collectNonEmptySelections(this.vsEditor.selections);
        return this.extractLineRanges(validSelections);
    }
    collectNonEmptySelections(selections) {
        return selections.filter(s => !s.isEmpty).sort((s1, s2) => {
            const lineComparison = s1.start.line - s2.start.line;
            return lineComparison !== 0
                ? lineComparison
                : s1.start.character - s2.start.character;
        });
    }
    extractText(selections) {
        return selections.length === 0
            ? this.extractTextFromSelection()
            : selections.map(this.extractTextFromSelection).join('\n');
    }
    extractLineRanges(selections) {
        return selections.map(selection => ({
            start: selection.start.line,
            end: selection.end.line
        }));
    }
}
exports.default = TextEditor;
//# sourceMappingURL=text-editor.js.map