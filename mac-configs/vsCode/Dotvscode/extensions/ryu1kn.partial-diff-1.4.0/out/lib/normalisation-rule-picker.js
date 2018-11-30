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
class NormalisationRulePicker {
    constructor(windowAdaptor) {
        this.windowAdaptor = windowAdaptor;
    }
    show(rules) {
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.convertToQuickPickItems(rules);
            const userSelection = yield this.windowAdaptor.showQuickPick(items);
            const activeItems = userSelection || items.filter(item => item.picked);
            return this.convertToRules(activeItems);
        });
    }
    convertToQuickPickItems(rules) {
        return rules.map((rule, index) => ({
            label: rule.name || '(no "name" set for this rule)',
            picked: rule.active,
            ruleIndex: index,
            description: ''
        }));
    }
    convertToRules(pickedItems) {
        return pickedItems.map(pickedItem => pickedItem.ruleIndex);
    }
}
exports.default = NormalisationRulePicker;
//# sourceMappingURL=normalisation-rule-picker.js.map