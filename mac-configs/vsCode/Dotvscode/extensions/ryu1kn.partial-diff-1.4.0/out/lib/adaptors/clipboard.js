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
const PLATFORM_WINDOWS = 'win32';
class Clipboard {
    constructor(clipboardy, platform) {
        this.clipboardy = clipboardy;
        this.platform = platform;
    }
    read() {
        return __awaiter(this, void 0, void 0, function* () {
            const text = yield this.clipboardy.read();
            return this.windows ? this.dropCRFromEOL(text) : text;
        });
    }
    get windows() {
        return this.platform === PLATFORM_WINDOWS;
    }
    dropCRFromEOL(text) {
        return text.split('\r\r\n').join('\r\n');
    }
}
exports.default = Clipboard;
//# sourceMappingURL=clipboard.js.map