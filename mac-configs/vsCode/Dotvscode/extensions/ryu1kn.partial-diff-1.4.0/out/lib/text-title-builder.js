"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TextTitleBuilder {
    build(textInfo) {
        if (!textInfo)
            return 'N/A';
        const suffix = this.lineRangesSuffix(textInfo.lineRanges);
        return `${textInfo.fileName}${suffix}`;
    }
    lineRangesSuffix(lineRanges) {
        return lineRanges.length !== 0
            ? ` (${lineRanges.map(this.lineRangeLabel)})`
            : '';
    }
    lineRangeLabel(lineRange) {
        const isOneLine = lineRange.start === lineRange.end;
        return isOneLine
            ? `l.${lineRange.start + 1}`
            : `ll.${lineRange.start + 1}-${lineRange.end + 1}`;
    }
}
exports.default = TextTitleBuilder;
//# sourceMappingURL=text-title-builder.js.map