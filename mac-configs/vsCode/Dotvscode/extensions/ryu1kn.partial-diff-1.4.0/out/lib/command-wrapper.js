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
const text_editor_1 = require("./adaptors/text-editor");
class CommandWrapper {
    constructor(name, command, telemetryReporter, logger) {
        this.name = name;
        this.command = command;
        this.telemetryReporter = telemetryReporter;
        this.logger = logger;
    }
    execute(editor) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.telemetryReporter.logCommandTrigger(this.name);
                return yield this.command.execute(editor && new text_editor_1.default(editor));
            }
            catch (e) {
                this.handleError(e);
            }
        });
    }
    handleError(e) {
        this.telemetryReporter.logCommandErrored(this.name);
        this.logger.error(e.stack);
    }
}
exports.default = CommandWrapper;
//# sourceMappingURL=command-wrapper.js.map