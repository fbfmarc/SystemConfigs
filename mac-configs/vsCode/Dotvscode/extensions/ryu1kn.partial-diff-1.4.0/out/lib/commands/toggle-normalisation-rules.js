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
const normalisation_rule_picker_1 = require("../normalisation-rule-picker");
class ToggleNormalisationRulesCommand {
    constructor(normalisationRuleStore, windowAdaptor) {
        this.windowAdaptor = windowAdaptor;
        this.normalisationRulePicker = new normalisation_rule_picker_1.default(windowAdaptor);
        this.normalisationRuleStore = normalisationRuleStore;
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const rules = this.normalisationRuleStore.getAllRules();
            if (rules.length > 0) {
                const newRules = yield this.normalisationRulePicker.show(rules);
                this.normalisationRuleStore.specifyActiveRules(newRules);
            }
            else {
                yield this.windowAdaptor.showInformationMessage('Please set `partialDiff.preComparisonTextNormalizationRules` first');
            }
        });
    }
}
exports.default = ToggleNormalisationRulesCommand;
//# sourceMappingURL=toggle-normalisation-rules.js.map