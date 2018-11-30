/*--------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const loadStartTime = Date.now();
let loadEndTime;
const copypaste = require("copy-paste");
const vscode = require("vscode");
const vscode_azureextensionui_1 = require("vscode-azureextensionui");
const findTreeItem_1 = require("./commands/api/findTreeItem");
const pickTreeItem_1 = require("./commands/api/pickTreeItem");
const importDocuments_1 = require("./commands/importDocuments");
const constants_1 = require("./constants");
const CosmosEditorManager_1 = require("./CosmosEditorManager");
const DocDBDocumentNodeEditor_1 = require("./docdb/editors/DocDBDocumentNodeEditor");
const registerDocDBCommands_1 = require("./docdb/registerDocDBCommands");
const DocDBAccountTreeItem_1 = require("./docdb/tree/DocDBAccountTreeItem");
const DocDBDocumentTreeItem_1 = require("./docdb/tree/DocDBDocumentTreeItem");
const extensionVariables_1 = require("./extensionVariables");
const registerGraphCommands_1 = require("./graph/registerGraphCommands");
const GraphAccountTreeItem_1 = require("./graph/tree/GraphAccountTreeItem");
const MongoDocumentNodeEditor_1 = require("./mongo/editors/MongoDocumentNodeEditor");
const registerMongoCommands_1 = require("./mongo/registerMongoCommands");
const MongoAccountTreeItem_1 = require("./mongo/tree/MongoAccountTreeItem");
const MongoDocumentTreeItem_1 = require("./mongo/tree/MongoDocumentTreeItem");
const TableAccountTreeItem_1 = require("./table/tree/TableAccountTreeItem");
const AttachedAccountsTreeItem_1 = require("./tree/AttachedAccountsTreeItem");
const CosmosDBAccountProvider_1 = require("./tree/CosmosDBAccountProvider");
const cpUtil = require("./utils/cp");
function activate(context) {
    return __awaiter(this, void 0, void 0, function* () {
        extensionVariables_1.ext.context = context;
        extensionVariables_1.ext.reporter = vscode_azureextensionui_1.createTelemetryReporter(context);
        extensionVariables_1.ext.ui = new vscode_azureextensionui_1.AzureUserInput(context.globalState);
        extensionVariables_1.ext.outputChannel = vscode.window.createOutputChannel("Azure Cosmos DB");
        context.subscriptions.push(extensionVariables_1.ext.outputChannel);
        vscode_azureextensionui_1.registerUIExtensionVariables(extensionVariables_1.ext);
        yield vscode_azureextensionui_1.callWithTelemetryAndErrorHandling('cosmosDB.activate', function () {
            return __awaiter(this, void 0, void 0, function* () {
                this.properties.isActivationEvent = 'true';
                this.measurements.mainFileLoad = (loadEndTime - loadStartTime) / 1000;
                const attachedAccountsNode = new AttachedAccountsTreeItem_1.AttachedAccountsTreeItem(context.globalState);
                extensionVariables_1.ext.attachedAccountsNode = attachedAccountsNode;
                const tree = new vscode_azureextensionui_1.AzureTreeDataProvider(CosmosDBAccountProvider_1.CosmosDBAccountProvider, 'cosmosDB.loadMore', [attachedAccountsNode]);
                context.subscriptions.push(tree);
                extensionVariables_1.ext.tree = tree;
                context.subscriptions.push(vscode.window.registerTreeDataProvider('cosmosDBExplorer', tree));
                extensionVariables_1.ext.treeView = vscode.window.createTreeView('cosmosDBExplorer', { treeDataProvider: tree });
                const editorManager = new CosmosEditorManager_1.CosmosEditorManager(context.globalState);
                registerDocDBCommands_1.registerDocDBCommands(editorManager);
                registerGraphCommands_1.registerGraphCommands(context);
                registerMongoCommands_1.registerMongoCommands(context, editorManager);
                // Common commands
                const accountContextValues = [GraphAccountTreeItem_1.GraphAccountTreeItem.contextValue, DocDBAccountTreeItem_1.DocDBAccountTreeItem.contextValue, TableAccountTreeItem_1.TableAccountTreeItem.contextValue, MongoAccountTreeItem_1.MongoAccountTreeItem.contextValue];
                vscode_azureextensionui_1.registerCommand('cosmosDB.selectSubscriptions', () => vscode.commands.executeCommand("azure-account.selectSubscriptions"));
                vscode_azureextensionui_1.registerCommand('cosmosDB.createAccount', function (node) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (!node) {
                            node = (yield tree.showTreeItemPicker(vscode_azureextensionui_1.SubscriptionTreeItem.contextValue));
                        }
                        yield node.createChild(this);
                    });
                });
                vscode_azureextensionui_1.registerCommand('cosmosDB.deleteAccount', (node) => __awaiter(this, void 0, void 0, function* () {
                    if (!node) {
                        node = yield tree.showTreeItemPicker(accountContextValues);
                    }
                    yield node.deleteTreeItem();
                }));
                vscode_azureextensionui_1.registerCommand('cosmosDB.attachDatabaseAccount', () => __awaiter(this, void 0, void 0, function* () {
                    yield attachedAccountsNode.attachNewAccount();
                    yield tree.refresh(attachedAccountsNode);
                }));
                vscode_azureextensionui_1.registerCommand('cosmosDB.attachEmulator', () => __awaiter(this, void 0, void 0, function* () {
                    yield attachedAccountsNode.attachEmulator();
                    yield tree.refresh(attachedAccountsNode);
                }));
                vscode_azureextensionui_1.registerCommand('cosmosDB.refresh', (node) => __awaiter(this, void 0, void 0, function* () { return yield tree.refresh(node); }));
                vscode_azureextensionui_1.registerCommand('cosmosDB.detachDatabaseAccount', (node) => __awaiter(this, void 0, void 0, function* () {
                    if (!node) {
                        node = yield tree.showTreeItemPicker(accountContextValues.map((val) => val += AttachedAccountsTreeItem_1.AttachedAccountSuffix), attachedAccountsNode);
                    }
                    yield attachedAccountsNode.detach(node);
                    yield tree.refresh(attachedAccountsNode);
                }));
                vscode_azureextensionui_1.registerCommand('cosmosDB.importDocument', (selectedNode, uris) => //ignore first pass
                 __awaiter(this, void 0, void 0, function* () {
                    if (selectedNode instanceof vscode.Uri) {
                        yield importDocuments_1.importDocuments(uris || [selectedNode], undefined);
                    }
                    else {
                        yield importDocuments_1.importDocuments(undefined, selectedNode);
                    }
                }));
                vscode_azureextensionui_1.registerCommand('cosmosDB.openInPortal', (node) => __awaiter(this, void 0, void 0, function* () {
                    if (!node) {
                        node = yield tree.showTreeItemPicker(accountContextValues);
                    }
                    node.openInPortal();
                }));
                vscode_azureextensionui_1.registerCommand('cosmosDB.copyConnectionString', (node) => __awaiter(this, void 0, void 0, function* () {
                    if (!node) {
                        node = (yield tree.showTreeItemPicker(accountContextValues));
                    }
                    yield copyConnectionString(node);
                }));
                vscode_azureextensionui_1.registerCommand('cosmosDB.openDocument', (node) => __awaiter(this, void 0, void 0, function* () {
                    if (!node) {
                        node = (yield tree.showTreeItemPicker([MongoDocumentTreeItem_1.MongoDocumentTreeItem.contextValue, DocDBDocumentTreeItem_1.DocDBDocumentTreeItem.contextValue]));
                    }
                    const editorTabName = node.label + "-cosmos-document.json";
                    if (node instanceof MongoDocumentTreeItem_1.MongoDocumentTreeItem) {
                        yield editorManager.showDocument(new MongoDocumentNodeEditor_1.MongoDocumentNodeEditor(node), editorTabName);
                    }
                    else {
                        yield editorManager.showDocument(new DocDBDocumentNodeEditor_1.DocDBDocumentNodeEditor(node), editorTabName);
                    }
                    // tslint:disable-next-line:align
                }), constants_1.doubleClickDebounceDelay);
                vscode_azureextensionui_1.registerCommand('cosmosDB.update', (filePath) => editorManager.updateMatchingNode(filePath));
                vscode_azureextensionui_1.registerCommand('cosmosDB.loadMore', (node) => tree.loadMore(node));
                vscode_azureextensionui_1.registerEvent('cosmosDB.CosmosEditorManager.onDidSaveTextDocument', vscode.workspace.onDidSaveTextDocument, function (doc) {
                    return __awaiter(this, void 0, void 0, function* () {
                        yield editorManager.onDidSaveTextDocument(this, doc);
                    });
                });
                vscode_azureextensionui_1.registerEvent('cosmosDB.onDidChangeConfiguration', vscode.workspace.onDidChangeConfiguration, function (event) {
                    return __awaiter(this, void 0, void 0, function* () {
                        this.properties.isActivationEvent = "true";
                        this.suppressErrorDisplay = true;
                        if (event.affectsConfiguration(extensionVariables_1.ext.settingsKeys.documentLabelFields)) {
                            yield vscode.commands.executeCommand("cosmosDB.refresh");
                        }
                    });
                });
            });
        });
        return vscode_azureextensionui_1.createApiProvider([{
                findTreeItem: findTreeItem_1.findTreeItem,
                pickTreeItem: pickTreeItem_1.pickTreeItem,
                apiVersion: '1.0.0'
            }]);
    });
}
exports.activate = activate;
function copyConnectionString(node) {
    return __awaiter(this, void 0, void 0, function* () {
        if (process.platform !== 'linux' || (yield cpUtil.commandSucceeds('xclip', '-version'))) {
            copypaste.copy(node.connectionString);
        }
        else {
            vscode.window.showErrorMessage('You must have xclip installed to copy the connection string.');
        }
    });
}
// this method is called when your extension is deactivated
function deactivate() {
    // NOOP
}
exports.deactivate = deactivate;
loadEndTime = Date.now();
//# sourceMappingURL=extension.js.map