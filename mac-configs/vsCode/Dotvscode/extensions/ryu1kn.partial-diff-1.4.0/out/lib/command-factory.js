"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const save_text_1_1 = require("./commands/save-text-1");
const compare_selection_with_text1_1 = require("./commands/compare-selection-with-text1");
const compare_selection_with_clipboard_1 = require("./commands/compare-selection-with-clipboard");
const compare_visible_editors_1 = require("./commands/compare-visible-editors");
const diff_presenter_1 = require("./diff-presenter");
const toggle_normalisation_rules_1 = require("./commands/toggle-normalisation-rules");
class CommandFactory {
    constructor(selectionInfoRegistry, normalisationRuleStore, commandAdaptor, windowAdaptor, clipboard, getCurrentDate) {
        this.normalisationRuleStore = normalisationRuleStore;
        this.selectionInfoRegistry = selectionInfoRegistry;
        this.commandAdaptor = commandAdaptor;
        this.windowAdaptor = windowAdaptor;
        this.clipboard = clipboard;
        this.getCurrentDate = getCurrentDate;
    }
    crateSaveText1Command() {
        return new save_text_1_1.default(this.selectionInfoRegistry);
    }
    createCompareSelectionWithText1Command() {
        return new compare_selection_with_text1_1.default(this.getDiffPresenter(), this.selectionInfoRegistry);
    }
    createCompareSelectionWithClipboardCommand() {
        return new compare_selection_with_clipboard_1.default(this.getDiffPresenter(), this.selectionInfoRegistry, this.clipboard);
    }
    createCompareVisibleEditorsCommand() {
        return new compare_visible_editors_1.default(this.getDiffPresenter(), this.selectionInfoRegistry, this.windowAdaptor);
    }
    createToggleNormalisationRulesCommand() {
        return new toggle_normalisation_rules_1.default(this.normalisationRuleStore, this.windowAdaptor);
    }
    getDiffPresenter() {
        this.diffPresenter = this.diffPresenter || this.createDiffPresenter();
        return this.diffPresenter;
    }
    createDiffPresenter() {
        return new diff_presenter_1.default(this.selectionInfoRegistry, this.normalisationRuleStore, this.commandAdaptor, this.getCurrentDate);
    }
}
exports.default = CommandFactory;
//# sourceMappingURL=command-factory.js.map