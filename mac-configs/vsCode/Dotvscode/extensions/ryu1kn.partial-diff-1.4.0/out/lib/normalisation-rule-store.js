"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isEqual = require("lodash.isequal");
const omit = require("lodash.omit");
const clone = (value) => JSON.parse(JSON.stringify(value));
class NormalisationRuleStore {
    constructor(workspace) {
        this.workspace = workspace;
        this.setupRules(this.workspace.get('preComparisonTextNormalizationRules'));
    }
    setupRules(rules) {
        this.baseRules = clone(rules);
        this.rules = this.resetRuleStatus(this.baseRules);
    }
    resetRuleStatus(rules) {
        return rules.map(rule => Object.assign({}, omit(rule, ['enableOnStart']), {
            active: rule.enableOnStart !== false
        }));
    }
    getAllRules() {
        const newBaseRules = this.workspace.get('preComparisonTextNormalizationRules');
        if (!isEqual(newBaseRules, this.baseRules)) {
            this.setupRules(newBaseRules);
        }
        return this.rules;
    }
    get activeRules() {
        return this.getAllRules().filter(rule => rule.active);
    }
    get hasActiveRules() {
        return this.activeRules.length > 0;
    }
    specifyActiveRules(ruleIndices) {
        this.rules = this.rules.map((rule, index) => Object.assign({}, rule, { active: ruleIndices.includes(index) }));
    }
}
exports.default = NormalisationRuleStore;
//# sourceMappingURL=normalisation-rule-store.js.map