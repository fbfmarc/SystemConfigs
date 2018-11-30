"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const text_process_rule_applier_1 = require("./text-process-rule-applier");
const text_resource_1 = require("./utils/text-resource");
class ContentProvider {
    constructor(selectionInfoRegistry, normalisationRuleStore) {
        this.selectionInfoRegistry = selectionInfoRegistry;
        this.textProcessRuleApplier = new text_process_rule_applier_1.default(normalisationRuleStore);
    }
    provideTextDocumentContent(uri) {
        const textKey = text_resource_1.extractTextKey(uri);
        const registeredText = (this.selectionInfoRegistry.get(textKey) || { text: '' }).text;
        return this.textProcessRuleApplier.applyTo(registeredText);
    }
}
exports.default = ContentProvider;
//# sourceMappingURL=content-provider.js.map