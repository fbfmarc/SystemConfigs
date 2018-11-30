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
class CompareVisibleEditorsCommand {
    constructor(diffPresenter, selectionInfoRegistry, windowAdaptor) {
        this.windowAdaptor = windowAdaptor;
        this.diffPresenter = diffPresenter;
        this.selectionInfoRegistry = selectionInfoRegistry;
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const editors = this.windowAdaptor.visibleTextEditors;
            if (editors.length !== 2) {
                this.windowAdaptor.showInformationMessage('Please first open 2 documents to compare.');
                return;
            }
            const textInfos = editors.map(editor => ({
                text: editor.selectedText,
                fileName: editor.fileName,
                lineRanges: editor.selectedLineRanges
            }));
            this.registerTextInfo(textInfos, editors[0].viewColumn > editors[1].viewColumn);
            yield 'HACK'; // HACK: Avoid "TextEditor has been disposed" error
            yield this.diffPresenter.takeDiff(const_1.TextKey.VISIBLE_EDITOR1, const_1.TextKey.VISIBLE_EDITOR2);
        });
    }
    registerTextInfo(textInfos, isReverseOrder) {
        const textInfo1 = textInfos[isReverseOrder ? 1 : 0];
        const textInfo2 = textInfos[isReverseOrder ? 0 : 1];
        this.selectionInfoRegistry.set(const_1.TextKey.VISIBLE_EDITOR1, textInfo1);
        this.selectionInfoRegistry.set(const_1.TextKey.VISIBLE_EDITOR2, textInfo2);
    }
}
exports.default = CompareVisibleEditorsCommand;
//# sourceMappingURL=compare-visible-editors.js.map