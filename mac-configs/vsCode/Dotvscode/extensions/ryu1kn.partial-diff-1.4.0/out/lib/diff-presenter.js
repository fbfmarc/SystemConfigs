"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const text_resource_1 = require("./utils/text-resource");
const diff_title_builder_1 = require("./diff-title-builder");
class DiffPresenter {
    constructor(selectionInfoRegistry, normalisationRuleStore, commandAdaptor, getCurrentDate) {
        this.getCurrentDate = getCurrentDate;
        this.diffTitleBuilder = new diff_title_builder_1.default(normalisationRuleStore, selectionInfoRegistry);
        this.commandAdaptor = commandAdaptor;
    }
    takeDiff(textKey1, textKey2) {
        const getUri = (textKey) => text_resource_1.makeUriString(textKey, this.getCurrentDate());
        const title = this.diffTitleBuilder.build(textKey1, textKey2);
        return this.commandAdaptor.executeCommand('vscode.diff', getUri(textKey1), getUri(textKey2), title);
    }
}
exports.default = DiffPresenter;
//# sourceMappingURL=diff-presenter.js.map