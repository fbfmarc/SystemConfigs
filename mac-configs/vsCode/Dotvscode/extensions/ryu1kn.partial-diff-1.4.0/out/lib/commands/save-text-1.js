"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const const_1 = require("../const");
class SaveText1Command {
    constructor(selectionInfoRegistry) {
        this.selectionInfoRegistry = selectionInfoRegistry;
    }
    execute(editor) {
        const textInfo = {
            text: editor.selectedText,
            fileName: editor.fileName,
            lineRanges: editor.selectedLineRanges
        };
        this.selectionInfoRegistry.set(const_1.TextKey.REGISTER1, textInfo);
    }
}
exports.default = SaveText1Command;
//# sourceMappingURL=save-text-1.js.map