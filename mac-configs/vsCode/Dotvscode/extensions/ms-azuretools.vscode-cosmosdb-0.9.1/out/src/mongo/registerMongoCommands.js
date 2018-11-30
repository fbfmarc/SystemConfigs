"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const vscode_azureextensionui_1 = require("vscode-azureextensionui");
const extensionVariables_1 = require("../extensionVariables");
const vscodeUtil = require("../utils/vscodeUtils");
const MongoCollectionNodeEditor_1 = require("./editors/MongoCollectionNodeEditor");
const languageClient_1 = require("./languageClient");
const MongoScrapbook_1 = require("./MongoScrapbook");
const MongoCodeLensProvider_1 = require("./services/MongoCodeLensProvider");
const MongoAccountTreeItem_1 = require("./tree/MongoAccountTreeItem");
const MongoCollectionTreeItem_1 = require("./tree/MongoCollectionTreeItem");
const MongoDatabaseTreeItem_1 = require("./tree/MongoDatabaseTreeItem");
const MongoDocumentTreeItem_1 = require("./tree/MongoDocumentTreeItem");
const connectedDBKey = 'ms-azuretools.vscode-cosmosdb.connectedDB';
let diagnosticsCollection;
function registerMongoCommands(context, editorManager) {
    let languageClient = new languageClient_1.MongoDBLanguageClient(context);
    const codeLensProvider = new MongoCodeLensProvider_1.MongoCodeLensProvider();
    context.subscriptions.push(vscode.languages.registerCodeLensProvider('mongo', codeLensProvider));
    diagnosticsCollection = vscode.languages.createDiagnosticCollection('cosmosDB.mongo');
    context.subscriptions.push(diagnosticsCollection);
    setUpErrorReporting();
    const loadPersistedMongoDBTask = loadPersistedMongoDB(context, languageClient, codeLensProvider);
    vscode_azureextensionui_1.registerCommand('cosmosDB.createMongoDatabase', (node) => __awaiter(this, void 0, void 0, function* () {
        if (!node) {
            node = (yield extensionVariables_1.ext.tree.showTreeItemPicker(MongoAccountTreeItem_1.MongoAccountTreeItem.contextValue));
        }
        const databaseNode = yield node.createChild();
        // reveal the database treeItem in case user cancels collection creation
        yield extensionVariables_1.ext.treeView.reveal(databaseNode, { focus: false });
        const collectionNode = yield databaseNode.createChild();
        yield extensionVariables_1.ext.treeView.reveal(collectionNode, { focus: true });
        yield vscode.commands.executeCommand('cosmosDB.connectMongoDB', databaseNode);
    }));
    vscode_azureextensionui_1.registerCommand('cosmosDB.createMongoCollection', (node) => __awaiter(this, void 0, void 0, function* () {
        if (!node) {
            node = (yield extensionVariables_1.ext.tree.showTreeItemPicker(MongoDatabaseTreeItem_1.MongoDatabaseTreeItem.contextValue));
        }
        const collectionNode = yield node.createChild();
        yield extensionVariables_1.ext.treeView.reveal(collectionNode);
        yield vscode.commands.executeCommand('cosmosDB.connectMongoDB', collectionNode.parent);
    }));
    vscode_azureextensionui_1.registerCommand('cosmosDB.createMongoDocument', (node) => __awaiter(this, void 0, void 0, function* () {
        if (!node) {
            node = (yield extensionVariables_1.ext.tree.showTreeItemPicker(MongoCollectionTreeItem_1.MongoCollectionTreeItem.contextValue));
        }
        const documentNode = yield node.createChild();
        yield extensionVariables_1.ext.treeView.reveal(documentNode);
        yield vscode.commands.executeCommand("cosmosDB.openDocument", documentNode);
    }));
    vscode_azureextensionui_1.registerCommand('cosmosDB.connectMongoDB', (node) => __awaiter(this, void 0, void 0, function* () {
        if (!node) {
            node = (yield extensionVariables_1.ext.tree.showTreeItemPicker(MongoDatabaseTreeItem_1.MongoDatabaseTreeItem.contextValue));
        }
        const oldNodeId = extensionVariables_1.ext.connectedMongoDB && extensionVariables_1.ext.connectedMongoDB.fullId;
        yield languageClient.connect(node.connectionString, node.databaseName);
        context.globalState.update(connectedDBKey, node.fullId);
        setConnectedNode(node, codeLensProvider);
        yield node.refresh();
        if (oldNodeId) {
            // We have to use findTreeItem to get the instance of the old node that's being displayed in the ext.tree. Our specific instance might have been out-of-date
            const oldNode = yield extensionVariables_1.ext.tree.findTreeItem(oldNodeId);
            if (oldNode) {
                yield oldNode.refresh();
            }
        }
    }));
    vscode_azureextensionui_1.registerCommand('cosmosDB.deleteMongoDB', (node) => __awaiter(this, void 0, void 0, function* () {
        if (!node) {
            node = (yield extensionVariables_1.ext.tree.showTreeItemPicker(MongoDatabaseTreeItem_1.MongoDatabaseTreeItem.contextValue));
        }
        yield node.deleteTreeItem();
        if (extensionVariables_1.ext.connectedMongoDB && extensionVariables_1.ext.connectedMongoDB.fullId === node.fullId) {
            setConnectedNode(undefined, codeLensProvider);
            context.globalState.update(connectedDBKey, undefined);
            languageClient.disconnect();
        }
    }));
    vscode_azureextensionui_1.registerCommand('cosmosDB.deleteMongoCollection', (node) => __awaiter(this, void 0, void 0, function* () {
        if (!node) {
            node = (yield extensionVariables_1.ext.tree.showTreeItemPicker(MongoCollectionTreeItem_1.MongoCollectionTreeItem.contextValue));
        }
        yield node.deleteTreeItem();
    }));
    vscode_azureextensionui_1.registerCommand('cosmosDB.deleteMongoDocument', (node) => __awaiter(this, void 0, void 0, function* () {
        if (!node) {
            node = (yield extensionVariables_1.ext.tree.showTreeItemPicker(MongoDocumentTreeItem_1.MongoDocumentTreeItem.contextValue));
        }
        yield node.deleteTreeItem();
    }));
    vscode_azureextensionui_1.registerCommand('cosmosDB.openCollection', (node) => __awaiter(this, void 0, void 0, function* () {
        if (!node) {
            node = (yield extensionVariables_1.ext.tree.showTreeItemPicker(MongoCollectionTreeItem_1.MongoCollectionTreeItem.contextValue));
        }
        yield editorManager.showDocument(new MongoCollectionNodeEditor_1.MongoCollectionNodeEditor(node), node.label + '-cosmos-collection.json');
    }));
    vscode_azureextensionui_1.registerCommand('cosmosDB.launchMongoShell', launchMongoShell);
    vscode_azureextensionui_1.registerCommand('cosmosDB.newMongoScrapbook', () => __awaiter(this, void 0, void 0, function* () { return yield vscodeUtil.showNewFile('', context.extensionPath, 'Scrapbook', '.mongo'); }));
    vscode_azureextensionui_1.registerCommand('cosmosDB.executeMongoCommand', function (commandText) {
        return __awaiter(this, void 0, void 0, function* () {
            yield loadPersistedMongoDBTask;
            if (typeof commandText === "string") {
                yield MongoScrapbook_1.executeCommandFromText(extensionVariables_1.ext.connectedMongoDB, context.extensionPath, editorManager, this, commandText);
            }
            else {
                yield MongoScrapbook_1.executeCommandFromActiveEditor(extensionVariables_1.ext.connectedMongoDB, context.extensionPath, editorManager, this);
            }
        });
    });
    vscode_azureextensionui_1.registerCommand('cosmosDB.executeAllMongoCommands', function () {
        return __awaiter(this, void 0, void 0, function* () {
            yield loadPersistedMongoDBTask;
            yield MongoScrapbook_1.executeAllCommandsFromActiveEditor(extensionVariables_1.ext.connectedMongoDB, context.extensionPath, editorManager, this);
        });
    });
}
exports.registerMongoCommands = registerMongoCommands;
function loadPersistedMongoDB(context, languageClient, codeLensProvider) {
    return __awaiter(this, void 0, void 0, function* () {
        // NOTE: We want to make sure this function never throws or returns a rejected promise because it gets awaited multiple times
        yield vscode_azureextensionui_1.callWithTelemetryAndErrorHandling('cosmosDB.loadPersistedMongoDB', function () {
            return __awaiter(this, void 0, void 0, function* () {
                this.suppressErrorDisplay = true;
                this.properties.isActivationEvent = 'true';
                try {
                    const persistedNodeId = context.globalState.get(connectedDBKey);
                    if (persistedNodeId) {
                        const persistedNode = yield extensionVariables_1.ext.tree.findTreeItem(persistedNodeId);
                        if (persistedNode) {
                            yield languageClient.client.onReady();
                            yield vscode.commands.executeCommand('cosmosDB.connectMongoDB', persistedNode);
                        }
                    }
                }
                finally {
                    // Get code lens provider out of initializing state if there's no connected DB
                    if (!extensionVariables_1.ext.connectedMongoDB) {
                        codeLensProvider.setConnectedDatabase(undefined);
                    }
                }
            });
        });
    });
}
function launchMongoShell() {
    const terminal = vscode.window.createTerminal('Mongo Shell');
    terminal.sendText(`mongo`);
    terminal.show();
}
function setConnectedNode(node, codeLensProvider) {
    extensionVariables_1.ext.connectedMongoDB = node;
    let dbName = node && node.label;
    codeLensProvider.setConnectedDatabase(dbName);
}
function setUpErrorReporting() {
    // Update errors immediately in case a scrapbook is already open
    vscode_azureextensionui_1.callWithTelemetryAndErrorHandling("initialUpdateErrorsInActiveDocument", function () {
        return __awaiter(this, void 0, void 0, function* () {
            updateErrorsInScrapbook(this, vscode.window.activeTextEditor && vscode.window.activeTextEditor.document);
        });
    });
    // Update errors when document opened/changed
    vscode_azureextensionui_1.registerEvent('vscode.workspace.onDidOpenTextDocument', vscode.workspace.onDidOpenTextDocument, function (document) {
        return __awaiter(this, void 0, void 0, function* () {
            updateErrorsInScrapbook(this, document);
        });
    });
    vscode_azureextensionui_1.registerEvent('vscode.workspace.onDidChangeTextDocument', vscode.workspace.onDidChangeTextDocument, function (event) {
        return __awaiter(this, void 0, void 0, function* () {
            // Always suppress success telemetry - event happens on every keystroke
            this.suppressTelemetry = true;
            updateErrorsInScrapbook(this, event.document);
        });
    });
    vscode_azureextensionui_1.registerEvent('vscode.workspace.onDidCloseTextDocument', vscode.workspace.onDidCloseTextDocument, function (document) {
        return __awaiter(this, void 0, void 0, function* () {
            // Remove errors when closed
            if (isScrapbook(document)) {
                diagnosticsCollection.set(document.uri, []);
            }
            else {
                this.suppressTelemetry = true;
            }
        });
    });
}
function isScrapbook(document) {
    return document && document.languageId === 'mongo';
}
function updateErrorsInScrapbook(context, document) {
    if (isScrapbook(document)) {
        let errors = MongoScrapbook_1.getAllErrorsFromTextDocument(document);
        diagnosticsCollection.set(document.uri, errors);
    }
    else {
        context.suppressTelemetry = true;
    }
}
//# sourceMappingURL=registerMongoCommands.js.map