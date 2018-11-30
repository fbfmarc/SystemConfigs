"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const text_title_builder_1 = require("./text-title-builder");
const DiffModeSymbols = {
    NORMALISED: '\u007e',
    AS_IS: '\u2194'
};
class DiffTitleBuilder {
    constructor(normalisationRuleStore, selectionInfoRegistry) {
        this.normalisationRuleStore = normalisationRuleStore;
        this.selectionInfoRegistry = selectionInfoRegistry;
        this.textTitleBuilder = new text_title_builder_1.default();
    }
    build(textKey1, textKey2) {
        const title1 = this.buildTextTitle(textKey1);
        const title2 = this.buildTextTitle(textKey2);
        const comparisonSymbol = this.normalisationRuleStore.hasActiveRules
            ? DiffModeSymbols.NORMALISED
            : DiffModeSymbols.AS_IS;
        return `${title1} ${comparisonSymbol} ${title2}`;
    }
    buildTextTitle(textKey) {
        const textInfo = this.selectionInfoRegistry.get(textKey);
        return this.textTitleBuilder.build(textInfo);
    }
}
exports.default = DiffTitleBuilder;
//# sourceMappingURL=diff-title-builder.js.map