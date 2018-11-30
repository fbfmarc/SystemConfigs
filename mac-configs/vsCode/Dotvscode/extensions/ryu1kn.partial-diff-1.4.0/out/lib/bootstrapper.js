"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const const_1 = require("./const");
class Bootstrapper {
    constructor(commandFactory, contentProvider, workspaceAdaptor, commandAdaptor) {
        this.commandFactory = commandFactory;
        this.contentProvider = contentProvider;
        this.workspaceAdaptor = workspaceAdaptor;
        this.commandAdaptor = commandAdaptor;
    }
    initiate(context) {
        this.registerProviders(context);
        this.registerCommands(context);
    }
    registerProviders(context) {
        const disposable = this.workspaceAdaptor.registerTextDocumentContentProvider(const_1.EXTENSION_SCHEME, this.contentProvider);
        context.subscriptions.push(disposable);
    }
    registerCommands(context) {
        this.commandList.forEach(cmd => {
            const disposable = this.commandAdaptor.registerCommand(cmd);
            context.subscriptions.push(disposable);
        });
    }
    get commandList() {
        return [
            {
                name: `${const_1.EXTENSION_NAMESPACE}.diffVisibleEditors`,
                type: 'GENERAL',
                command: this.commandFactory.createCompareVisibleEditorsCommand()
            },
            {
                name: `${const_1.EXTENSION_NAMESPACE}.markSection1`,
                type: 'TEXT_EDITOR',
                command: this.commandFactory.crateSaveText1Command()
            },
            {
                name: `${const_1.EXTENSION_NAMESPACE}.markSection2AndTakeDiff`,
                type: 'TEXT_EDITOR',
                command: this.commandFactory.createCompareSelectionWithText1Command()
            },
            {
                name: `${const_1.EXTENSION_NAMESPACE}.diffSelectionWithClipboard`,
                type: 'TEXT_EDITOR',
                command: this.commandFactory.createCompareSelectionWithClipboardCommand()
            },
            {
                name: `${const_1.EXTENSION_NAMESPACE}.togglePreComparisonTextNormalizationRules`,
                type: 'GENERAL',
                command: this.commandFactory.createToggleNormalisationRulesCommand()
            }
        ];
    }
}
exports.default = Bootstrapper;
//# sourceMappingURL=bootstrapper.js.map