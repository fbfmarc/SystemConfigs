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
const command_wrapper_1 = require("../command-wrapper");
class CommandAdaptor {
    constructor(commands, parseUri, telemetryReporter, logger) {
        this.commands = commands;
        this.parseUri = parseUri;
        this.telemetryReporter = telemetryReporter;
        this.logger = logger;
    }
    executeCommand(name, uri1, uri2, title) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.commands.executeCommand(name, this.parseUri(uri1), this.parseUri(uri2), title);
        });
    }
    registerCommand(cmd) {
        const registerer = this.getCommandRegisterer(cmd.type);
        const command = new command_wrapper_1.default(cmd.name, cmd.command, this.telemetryReporter, this.logger);
        return registerer(cmd.name, command.execute, command);
    }
    getCommandRegisterer(commandType) {
        return commandType === 'TEXT_EDITOR'
            ? this.commands.registerTextEditorCommand
            : this.commands.registerCommand;
    }
}
exports.default = CommandAdaptor;
//# sourceMappingURL=command.js.map