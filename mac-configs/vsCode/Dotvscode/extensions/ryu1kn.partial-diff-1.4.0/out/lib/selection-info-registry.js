"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SelectionInfoRegistry {
    constructor() {
        this.data = Object.create(null);
    }
    set(key, textInfo) {
        this.data[key] = {
            text: textInfo.text,
            fileName: textInfo.fileName,
            lineRanges: textInfo.lineRanges || []
        };
    }
    get(key) {
        return this.data[key];
    }
}
exports.default = SelectionInfoRegistry;
//# sourceMappingURL=selection-info-registry.js.map