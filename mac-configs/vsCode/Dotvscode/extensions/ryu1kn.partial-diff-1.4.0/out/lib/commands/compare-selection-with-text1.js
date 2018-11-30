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
class CompareSelectionWithText1Command {
    constructor(diffPresenter, selectionInfoRegistry) {
        this.diffPresenter = diffPresenter;
        this.selectionInfoRegistry = selectionInfoRegistry;
    }
    execute(editor) {
        return __awaiter(this, void 0, void 0, function* () {
            const textInfo = {
                text: editor.selectedText,
                fileName: editor.fileName,
                lineRanges: editor.selectedLineRanges
            };
            this.selectionInfoRegistry.set(const_1.TextKey.REGISTER2, textInfo);
            yield 'HACK'; // HACK: To avoid TextEditor has been disposed error
            yield this.diffPresenter.takeDiff(const_1.TextKey.REGISTER1, const_1.TextKey.REGISTER2);
        });
    }
}
exports.default = CompareSelectionWithText1Command;
//# sourceMappingURL=compare-selection-with-text1.js.map