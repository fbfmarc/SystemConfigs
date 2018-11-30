"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const const_1 = require("../const");
class CompareSelectionWithClipboardCommand {
    constructor(diffPresenter, selectionInfoRegistry, clipboard) {
        this.diffPresenter = diffPresenter;
        this.selectionInfoRegistry = selectionInfoRegistry;
        this.clipboard = clipboard;
    }
    execute(editor) {
        return __awaiter(this, void 0, void 0, function* () {
            const text = yield this.clipboard.read();
            this.selectionInfoRegistry.set(const_1.TextKey.CLIPBOARD, {
                text,
                fileName: 'Clipboard',
                lineRanges: []
            });
            this.selectionInfoRegistry.set(const_1.TextKey.REGISTER2, {
                text: editor.selectedText,
                fileName: editor.fileName,
                lineRanges: editor.selectedLineRanges
            });
            yield this.diffPresenter.takeDiff(const_1.TextKey.CLIPBOARD, const_1.TextKey.REGISTER2);
        });
    }
}
exports.default = CompareSelectionWithClipboardCommand;
//# sourceMappingURL=compare-selection-with-clipboard.js.map