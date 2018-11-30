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
const fse = require("fs-extra");
const path = require("path");
const process = require("process");
const vscode = require("vscode");
const vscode_azureextensionui_1 = require("vscode-azureextensionui");
const extensionVariables_1 = require("../../extensionVariables");
const cpUtils = require("../../utils/cp");
const connectToMongoClient_1 = require("../connectToMongoClient");
const mongoConnectionStrings_1 = require("../mongoConnectionStrings");
const shell_1 = require("../shell");
const MongoCollectionTreeItem_1 = require("./MongoCollectionTreeItem");
const opn = require("opn");
const mongoExecutableFileName = process.platform === 'win32' ? 'mongo.exe' : 'mongo';
class MongoDatabaseTreeItem extends vscode_azureextensionui_1.AzureParentTreeItem {
    constructor(parent, databaseName, connectionString) {
        super(parent);
        this.contextValue = MongoDatabaseTreeItem.contextValue;
        this.childTypeLabel = "Collection";
        this.databaseName = databaseName;
        this.connectionString = mongoConnectionStrings_1.addDatabaseToAccountConnectionString(connectionString, this.databaseName);
    }
    get label() {
        return this.databaseName;
    }
    get description() {
        return extensionVariables_1.ext.connectedMongoDB && extensionVariables_1.ext.connectedMongoDB.fullId === this.fullId ? 'Connected' : '';
    }
    get id() {
        return this.databaseName;
    }
    get iconPath() {
        return {
            light: path.join(__filename, '..', '..', '..', '..', '..', 'resources', 'icons', 'theme-agnostic', 'Database.svg'),
            dark: path.join(__filename, '..', '..', '..', '..', '..', 'resources', 'icons', 'theme-agnostic', 'Database.svg')
        };
    }
    hasMoreChildrenImpl() {
        return false;
    }
    loadMoreChildrenImpl(_clearCache) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield this.getDb();
            const collections = yield db.collections();
            return collections.map(collection => new MongoCollectionTreeItem_1.MongoCollectionTreeItem(this, collection));
        });
    }
    createChildImpl(showCreatingTreeItem) {
        return __awaiter(this, void 0, void 0, function* () {
            const collectionName = yield extensionVariables_1.ext.ui.showInputBox({
                placeHolder: "Collection Name",
                prompt: "Enter the name of the collection",
                validateInput: validateMongoCollectionName,
                ignoreFocusOut: true
            });
            showCreatingTreeItem(collectionName);
            return yield this.createCollection(collectionName);
        });
    }
    deleteTreeItemImpl() {
        return __awaiter(this, void 0, void 0, function* () {
            const message = `Are you sure you want to delete database '${this.label}'?`;
            const result = yield vscode.window.showWarningMessage(message, { modal: true }, vscode_azureextensionui_1.DialogResponses.deleteResponse, vscode_azureextensionui_1.DialogResponses.cancel);
            if (result === vscode_azureextensionui_1.DialogResponses.deleteResponse) {
                const db = yield this.getDb();
                yield db.dropDatabase();
            }
            else {
                throw new vscode_azureextensionui_1.UserCancelledError();
            }
        });
    }
    getDb() {
        return __awaiter(this, void 0, void 0, function* () {
            const accountConnection = yield connectToMongoClient_1.connectToMongoClient(this.connectionString, vscode_azureextensionui_1.appendExtensionUserAgent());
            return accountConnection.db(this.databaseName);
        });
    }
    executeCommand(command, context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (command.collection) {
                let db = yield this.getDb();
                const collection = db.collection(command.collection);
                if (collection) {
                    const collectionTreeItem = new MongoCollectionTreeItem_1.MongoCollectionTreeItem(this, collection, command.arguments);
                    const result = yield collectionTreeItem.executeCommand(command.name, command.arguments);
                    if (result) {
                        return result;
                    }
                }
                return withProgress(this.executeCommandInShell(command, context), 'Executing command');
            }
            if (command.name === 'createCollection') {
                return withProgress(this.createCollection(stripQuotes(command.arguments.join(','))).then(() => JSON.stringify({ 'Created': 'Ok' })), 'Creating collection');
            }
            else {
                return withProgress(this.executeCommandInShell(command, context), 'Executing command');
            }
        });
    }
    createCollection(collectionName) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield this.getDb();
            const newCollection = db.collection(collectionName);
            // db.createCollection() doesn't create empty collections for some reason
            // However, we can 'insert' and then 'delete' a document, which has the side-effect of creating an empty collection
            const result = yield newCollection.insertOne({});
            yield newCollection.deleteOne({ _id: result.insertedId });
            return new MongoCollectionTreeItem_1.MongoCollectionTreeItem(this, newCollection);
        });
    }
    executeCommandInShell(command, context) {
        context.properties["executeInShell"] = "true";
        return this.getShell().then(shell => shell.exec(command.text));
    }
    getShell() {
        return __awaiter(this, void 0, void 0, function* () {
            let shellPathSetting = vscode.workspace.getConfiguration().get(extensionVariables_1.ext.settingsKeys.mongoShellPath);
            if (!this._cachedShellPathOrCmd || this._previousShellPathSetting !== shellPathSetting) {
                // Only do this if setting changed since last time
                this._previousShellPathSetting = shellPathSetting;
                yield this._determineShellPathOrCmd(shellPathSetting);
            }
            return yield this.createShell(this._cachedShellPathOrCmd);
        });
    }
    _determineShellPathOrCmd(shellPathSetting) {
        return __awaiter(this, void 0, void 0, function* () {
            this._cachedShellPathOrCmd = shellPathSetting;
            if (!shellPathSetting) {
                // User hasn't specified the path
                if (yield cpUtils.commandSucceeds('mongo', '--version')) {
                    // If the user already has mongo in their system path, just use that
                    this._cachedShellPathOrCmd = 'mongo';
                }
                else {
                    // If all else fails, prompt the user for the mongo path
                    // tslint:disable-next-line:no-constant-condition
                    const openFile = { title: `Browse to ${mongoExecutableFileName}` };
                    const browse = { title: 'Open installation page' };
                    let response = yield vscode.window.showErrorMessage('This functionality requires the Mongo DB shell, but we could not find it in the path or using the mongo.shell.path setting.', browse, openFile);
                    if (response === openFile) {
                        // tslint:disable-next-line:no-constant-condition
                        while (true) {
                            let newPath = yield vscode.window.showOpenDialog({
                                filters: { 'Executable Files': [process.platform === 'win32' ? 'exe' : ''] },
                                openLabel: `Select ${mongoExecutableFileName}`
                            });
                            if (newPath && newPath.length) {
                                let fsPath = newPath[0].fsPath;
                                let baseName = path.basename(fsPath);
                                if (baseName !== mongoExecutableFileName) {
                                    const useAnyway = { title: 'Use anyway' };
                                    const tryAgain = { title: 'Try again' };
                                    let response2 = yield extensionVariables_1.ext.ui.showWarningMessage(`Expected a file named "${mongoExecutableFileName}, but the selected filename is "${baseName}"`, useAnyway, tryAgain);
                                    if (response2 === tryAgain) {
                                        continue;
                                    }
                                }
                                this._cachedShellPathOrCmd = fsPath;
                                yield vscode.workspace.getConfiguration().update(extensionVariables_1.ext.settingsKeys.mongoShellPath, this._cachedShellPathOrCmd, vscode.ConfigurationTarget.Global);
                                return;
                            }
                            else {
                                throw new vscode_azureextensionui_1.UserCancelledError();
                            }
                        }
                    }
                    else if (response === browse) {
                        this._cachedShellPathOrCmd = undefined;
                        opn('https://docs.mongodb.com/manual/installation/');
                    }
                    throw new vscode_azureextensionui_1.UserCancelledError();
                }
            }
            else {
                // User has specified the path or command.  Sometimes they set the folder instead of a path to the file, let's check that and auto fix
                if (yield fse.pathExists(shellPathSetting)) {
                    let stat = yield fse.stat(shellPathSetting);
                    if (stat.isDirectory()) {
                        this._cachedShellPathOrCmd = path.join(shellPathSetting, mongoExecutableFileName);
                    }
                }
            }
        });
    }
    createShell(shellPath) {
        return __awaiter(this, void 0, void 0, function* () {
            return shell_1.Shell.create(shellPath, this.connectionString, this.root.isEmulator)
                .then(shell => {
                return shell.useDatabase(this.databaseName).then(() => shell);
            }, error => vscode.window.showErrorMessage(error));
        });
    }
}
MongoDatabaseTreeItem.contextValue = "mongoDb";
exports.MongoDatabaseTreeItem = MongoDatabaseTreeItem;
function validateMongoCollectionName(collectionName) {
    // https://docs.mongodb.com/manual/reference/limits/#Restriction-on-Collection-Names
    if (!collectionName) {
        return "Collection name cannot be empty";
    }
    const systemPrefix = "system.";
    if (collectionName.startsWith(systemPrefix)) {
        return `"${systemPrefix}" prefix is reserved for internal use`;
    }
    if (/[$]/.test(collectionName)) {
        return "Collection name cannot contain $";
    }
    return undefined;
}
exports.validateMongoCollectionName = validateMongoCollectionName;
function withProgress(promise, title, location = vscode.ProgressLocation.Window) {
    return vscode.window.withProgress({
        location: location,
        title: title
    }, (_progress) => {
        return promise;
    });
}
function stripQuotes(term) {
    if ((term.startsWith('\'') && term.endsWith('\''))
        || (term.startsWith('"') && term.endsWith('"'))) {
        return term.substring(1, term.length - 1);
    }
    return term;
}
exports.stripQuotes = stripQuotes;
//# sourceMappingURL=MongoDatabaseTreeItem.js.map