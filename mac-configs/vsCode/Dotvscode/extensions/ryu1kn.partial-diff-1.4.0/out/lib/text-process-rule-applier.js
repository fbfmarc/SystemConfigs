"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TextProcessRuleApplier {
    constructor(normalisationRuleStore) {
        this.normalisationRuleStore = normalisationRuleStore;
    }
    applyTo(text) {
        const rules = this.normalisationRuleStore.activeRules;
        return rules.length !== 0 ? this.applyRulesToText(rules, text) : text;
    }
    applyRulesToText(rules, text) {
        return rules.reduce((newText, rule) => this.applyRuleToText(rule, newText), text);
    }
    applyRuleToText(rule, text) {
        const pattern = new RegExp(rule.match, 'g');
        if (typeof rule.replaceWith === 'string') {
            return text.replace(pattern, rule.replaceWith);
        }
        return text.replace(pattern, matched => {
            // Type guard above is not working, so even though this `if` is
            // unnecessary logic, I need it to make typescript happy
            if (typeof rule.replaceWith === 'string')
                return matched;
            switch (rule.replaceWith.letterCase) {
                case 'lower':
                    return matched.toLowerCase();
                case 'upper':
                    return matched.toUpperCase();
                default:
                    return matched;
            }
        });
    }
}
exports.default = TextProcessRuleApplier;
//# sourceMappingURL=text-process-rule-applier.js.map