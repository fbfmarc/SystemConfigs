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
const path = require("path");
const vscode = require("vscode");
const vscode_azureextensionui_1 = require("vscode-azureextensionui");
const apiCache_1 = require("../commands/api/apiCache");
const constants_1 = require("../constants");
const docDBConnectionStrings_1 = require("../docdb/docDBConnectionStrings");
const DocDBAccountTreeItem_1 = require("../docdb/tree/DocDBAccountTreeItem");
const DocDBAccountTreeItemBase_1 = require("../docdb/tree/DocDBAccountTreeItemBase");
const experiences_1 = require("../experiences");
const GraphAccountTreeItem_1 = require("../graph/tree/GraphAccountTreeItem");
const connectToMongoClient_1 = require("../mongo/connectToMongoClient");
const mongoConnectionStrings_1 = require("../mongo/mongoConnectionStrings");
const MongoAccountTreeItem_1 = require("../mongo/tree/MongoAccountTreeItem");
const TableAccountTreeItem_1 = require("../table/tree/TableAccountTreeItem");
const vscodeUtils_1 = require("../utils/vscodeUtils");
exports.AttachedAccountSuffix = 'Attached';
exports.MONGO_CONNECTION_EXPECTED = 'Connection string must start with "mongodb://" or "mongodb+srv://"';
const localMongoConnectionString = 'mongodb://127.0.0.1:27017';
class AttachedAccountsTreeItem extends vscode_azureextensionui_1.RootTreeItem {
    constructor(_globalState) {
        super(new AttachedAccountRoot());
        this._globalState = _globalState;
        this.contextValue = AttachedAccountsTreeItem.contextValue;
        this.id = 'cosmosDBAttachedAccounts';
        this.label = 'Attached Database Accounts';
        this.childTypeLabel = 'Account';
        this._serviceName = "ms-azuretools.vscode-cosmosdb.connectionStrings";
        this._keytar = vscodeUtils_1.tryfetchNodeModule('keytar');
        this._loadPersistedAccountsTask = this.loadPersistedAccounts();
    }
    getAttachedAccounts() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._attachedAccounts) {
                try {
                    this._attachedAccounts = yield this._loadPersistedAccountsTask;
                }
                catch (_a) {
                    this._attachedAccounts = [];
                    throw new Error('Failed to load persisted Database Accounts. Reattach the accounts manually.');
                }
            }
            return this._attachedAccounts;
        });
    }
    get iconPath() {
        return {
            light: path.join(__filename, '..', '..', '..', '..', 'resources', 'icons', 'light', 'ConnectPlugged.svg'),
            dark: path.join(__filename, '..', '..', '..', '..', 'resources', 'icons', 'dark', 'ConnectPlugged.svg')
        };
    }
    hasMoreChildrenImpl() {
        return false;
    }
    loadMoreChildrenImpl(clearCache) {
        return __awaiter(this, void 0, void 0, function* () {
            if (clearCache) {
                this._attachedAccounts = undefined;
                this._loadPersistedAccountsTask = this.loadPersistedAccounts();
            }
            const attachedAccounts = yield this.getAttachedAccounts();
            return attachedAccounts.length > 0 ? attachedAccounts : [new vscode_azureextensionui_1.GenericTreeItem(this, {
                    contextValue: 'cosmosDBAttachDatabaseAccount',
                    label: 'Attach Database Account...',
                    commandId: 'cosmosDB.attachDatabaseAccount'
                })];
        });
    }
    isAncestorOfImpl(contextValue) {
        switch (contextValue) {
            // We have to make sure the Attached Accounts node is not shown for commands like
            // 'Open in Portal', which only work for the non-attached version
            case GraphAccountTreeItem_1.GraphAccountTreeItem.contextValue:
            case MongoAccountTreeItem_1.MongoAccountTreeItem.contextValue:
            case DocDBAccountTreeItem_1.DocDBAccountTreeItem.contextValue:
            case TableAccountTreeItem_1.TableAccountTreeItem.contextValue:
            case vscode_azureextensionui_1.SubscriptionTreeItem.contextValue:
                return false;
            default:
                return true;
        }
    }
    canConnectToLocalMongoDB() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let db = yield connectToMongoClient_1.connectToMongoClient(localMongoConnectionString, vscode_azureextensionui_1.appendExtensionUserAgent());
                db.close();
                return true;
            }
            catch (error) {
                return false;
            }
        });
    }
    attachNewAccount() {
        return __awaiter(this, void 0, void 0, function* () {
            const defaultExperiencePick = yield vscode.window.showQuickPick(experiences_1.getExperienceQuickPicks(), { placeHolder: "Select a Database Account API...", ignoreFocusOut: true });
            if (defaultExperiencePick) {
                const defaultExperience = defaultExperiencePick.data;
                let placeholder;
                let defaultValue;
                let validateInput;
                if (defaultExperience.api === experiences_1.API.MongoDB) {
                    placeholder = 'mongodb://host:port';
                    if (yield this.canConnectToLocalMongoDB()) {
                        defaultValue = placeholder = localMongoConnectionString;
                    }
                    validateInput = AttachedAccountsTreeItem.validateMongoConnectionString;
                }
                else {
                    placeholder = 'AccountEndpoint=...;AccountKey=...';
                    validateInput = AttachedAccountsTreeItem.validateDocDBConnectionString;
                }
                const connectionString = yield vscode.window.showInputBox({
                    placeHolder: placeholder,
                    prompt: 'Enter the connection string for your database account',
                    validateInput: validateInput,
                    ignoreFocusOut: true,
                    value: defaultValue
                });
                if (connectionString) {
                    let treeItem = yield this.createTreeItem(connectionString, defaultExperience.api);
                    yield this.attachAccount(treeItem, connectionString);
                }
            }
            else {
                throw new vscode_azureextensionui_1.UserCancelledError();
            }
        });
    }
    attachConnectionString(connectionString, api) {
        return __awaiter(this, void 0, void 0, function* () {
            const treeItem = yield this.createTreeItem(connectionString, api);
            yield this.attachAccount(treeItem, connectionString);
            this.refresh();
            return treeItem;
        });
    }
    attachEmulator() {
        return __awaiter(this, void 0, void 0, function* () {
            let connectionString;
            const defaultExperiencePick = yield vscode.window.showQuickPick([
                experiences_1.getExperienceQuickPick(experiences_1.API.MongoDB),
                experiences_1.getExperienceQuickPick(experiences_1.API.DocumentDB)
            ], {
                placeHolder: "Select a Database Account API...",
                ignoreFocusOut: true
            });
            if (defaultExperiencePick) {
                const defaultExperience = defaultExperiencePick.data;
                let port;
                if (defaultExperience.api === experiences_1.API.MongoDB) {
                    port = vscode.workspace.getConfiguration().get("cosmosDB.emulator.mongoPort");
                }
                else {
                    port = vscode.workspace.getConfiguration().get("cosmosDB.emulator.port");
                }
                if (port) {
                    if (defaultExperience.api === experiences_1.API.MongoDB) {
                        // Mongo shell doesn't parse passwords with slashes, so we need to URI encode it. The '/' before the options is required by mongo conventions
                        connectionString = `mongodb://localhost:${encodeURIComponent(constants_1.emulatorPassword)}@localhost:${port}/?ssl=true`;
                    }
                    else {
                        connectionString = `AccountEndpoint=https://localhost:${port}/;AccountKey=${constants_1.emulatorPassword};`;
                    }
                    const label = `${defaultExperience.shortName} Emulator`;
                    let treeItem = yield this.createTreeItem(connectionString, defaultExperience.api, label);
                    if (treeItem instanceof DocDBAccountTreeItem_1.DocDBAccountTreeItem || treeItem instanceof GraphAccountTreeItem_1.GraphAccountTreeItem || treeItem instanceof TableAccountTreeItem_1.TableAccountTreeItem || treeItem instanceof MongoAccountTreeItem_1.MongoAccountTreeItem) {
                        treeItem.root.isEmulator = true;
                    }
                    yield this.attachAccount(treeItem, connectionString);
                }
            }
        });
    }
    attachAccount(treeItem, connectionString) {
        return __awaiter(this, void 0, void 0, function* () {
            const attachedAccounts = yield this.getAttachedAccounts();
            if (attachedAccounts.find(s => s.id === treeItem.id)) {
                vscode.window.showWarningMessage(`Database Account '${treeItem.id}' is already attached.`);
            }
            else {
                attachedAccounts.push(treeItem);
                if (this._keytar) {
                    yield this._keytar.setPassword(this._serviceName, treeItem.id, connectionString);
                    yield this.persistIds(attachedAccounts);
                }
            }
        });
    }
    detach(node) {
        return __awaiter(this, void 0, void 0, function* () {
            const attachedAccounts = yield this.getAttachedAccounts();
            const index = attachedAccounts.findIndex((account) => account.fullId === node.fullId);
            if (index !== -1) {
                attachedAccounts.splice(index, 1);
                if (this._keytar) {
                    yield this._keytar.deletePassword(this._serviceName, node.id); // intentionally using 'id' instead of 'fullId' for the sake of backwards compatability
                    yield this.persistIds(attachedAccounts);
                }
                if (node instanceof MongoAccountTreeItem_1.MongoAccountTreeItem) {
                    const parsedCS = yield mongoConnectionStrings_1.parseMongoConnectionString(node.connectionString);
                    apiCache_1.removeTreeItemFromCache(parsedCS);
                }
                else if (node instanceof DocDBAccountTreeItemBase_1.DocDBAccountTreeItemBase) {
                    const parsedCS = yield docDBConnectionStrings_1.parseDocDBConnectionString(node.connectionString);
                    apiCache_1.removeTreeItemFromCache(parsedCS);
                }
            }
        });
    }
    loadPersistedAccounts() {
        return __awaiter(this, void 0, void 0, function* () {
            const persistedAccounts = [];
            const value = this._globalState.get(this._serviceName);
            if (value && this._keytar) {
                const accounts = JSON.parse(value);
                yield Promise.all(accounts.map((account) => __awaiter(this, void 0, void 0, function* () {
                    let id;
                    let label;
                    let api;
                    let isEmulator;
                    if (typeof (account) === 'string') {
                        // Default to Mongo if the value is a string for the sake of backwards compatiblity
                        // (Mongo was originally the only account type that could be attached)
                        id = account;
                        api = experiences_1.API.MongoDB;
                        label = `${account} (${experiences_1.getExperience(api).shortName})`;
                        isEmulator = false;
                    }
                    else {
                        id = account.id;
                        api = account.defaultExperience;
                        isEmulator = account.isEmulator;
                        label = isEmulator ? `${experiences_1.getExperience(api).shortName} Emulator` : `${id} (${experiences_1.getExperience(api).shortName})`;
                    }
                    const connectionString = yield this._keytar.getPassword(this._serviceName, id);
                    persistedAccounts.push(yield this.createTreeItem(connectionString, api, label, id, isEmulator));
                })));
            }
            return persistedAccounts;
        });
    }
    createTreeItem(connectionString, api, label, id, isEmulator) {
        return __awaiter(this, void 0, void 0, function* () {
            let treeItem;
            // tslint:disable-next-line:possible-timing-attack // not security related
            if (api === experiences_1.API.MongoDB) {
                if (id === undefined) {
                    const parsedCS = yield mongoConnectionStrings_1.parseMongoConnectionString(connectionString);
                    id = parsedCS.fullId;
                }
                label = label || `${id} (${experiences_1.getExperience(api).shortName})`;
                treeItem = new MongoAccountTreeItem_1.MongoAccountTreeItem(this, id, label, connectionString, isEmulator);
            }
            else {
                const parsedCS = docDBConnectionStrings_1.parseDocDBConnectionString(connectionString);
                label = label || `${parsedCS.accountId} (${experiences_1.getExperience(api).shortName})`;
                switch (api) {
                    case experiences_1.API.Table:
                        treeItem = new TableAccountTreeItem_1.TableAccountTreeItem(this, parsedCS.accountId, label, parsedCS.documentEndpoint, parsedCS.masterKey, isEmulator);
                        break;
                    case experiences_1.API.Graph:
                        treeItem = new GraphAccountTreeItem_1.GraphAccountTreeItem(this, parsedCS.accountId, label, parsedCS.documentEndpoint, undefined, parsedCS.masterKey, isEmulator);
                        break;
                    case experiences_1.API.DocumentDB:
                        treeItem = new DocDBAccountTreeItem_1.DocDBAccountTreeItem(this, parsedCS.accountId, label, parsedCS.documentEndpoint, parsedCS.masterKey, isEmulator);
                        break;
                    default:
                        throw new Error(`Unexpected defaultExperience "${api}".`);
                }
            }
            treeItem.contextValue += exports.AttachedAccountSuffix;
            return treeItem;
        });
    }
    persistIds(attachedAccounts) {
        return __awaiter(this, void 0, void 0, function* () {
            const value = attachedAccounts.map((node) => {
                let experience;
                let isEmulator;
                if (node instanceof MongoAccountTreeItem_1.MongoAccountTreeItem || node instanceof DocDBAccountTreeItem_1.DocDBAccountTreeItem || node instanceof GraphAccountTreeItem_1.GraphAccountTreeItem || node instanceof TableAccountTreeItem_1.TableAccountTreeItem) {
                    isEmulator = node.root.isEmulator;
                }
                if (node instanceof MongoAccountTreeItem_1.MongoAccountTreeItem) {
                    experience = experiences_1.API.MongoDB;
                }
                else if (node instanceof GraphAccountTreeItem_1.GraphAccountTreeItem) {
                    experience = experiences_1.API.Graph;
                }
                else if (node instanceof TableAccountTreeItem_1.TableAccountTreeItem) {
                    experience = experiences_1.API.Table;
                }
                else if (node instanceof DocDBAccountTreeItem_1.DocDBAccountTreeItem) {
                    experience = experiences_1.API.DocumentDB;
                }
                else {
                    throw new Error(`Unexpected account node "${node.constructor.name}".`);
                }
                return { id: node.id, defaultExperience: experience, isEmulator: isEmulator };
            });
            yield this._globalState.update(this._serviceName, JSON.stringify(value));
        });
    }
    static validateMongoConnectionString(value) {
        if (value && value.match(/^mongodb(\+srv)?:\/\//)) {
            return undefined;
        }
        return exports.MONGO_CONNECTION_EXPECTED;
    }
    static validateDocDBConnectionString(value) {
        try {
            docDBConnectionStrings_1.parseDocDBConnectionString(value);
            return undefined;
        }
        catch (error) {
            return 'Connection string must be of the form "AccountEndpoint=...;AccountKey=..."';
        }
    }
}
AttachedAccountsTreeItem.contextValue = 'cosmosDBAttachedAccounts' + (process.platform === 'win32' ? 'WithEmulator' : 'WithoutEmulator');
exports.AttachedAccountsTreeItem = AttachedAccountsTreeItem;
class AttachedAccountRoot {
    constructor() {
        this._error = new Error('Cannot retrieve Azure subscription information for an attached account.');
    }
    get credentials() {
        throw this._error;
    }
    get subscriptionDisplayName() {
        throw this._error;
    }
    get subscriptionId() {
        throw this._error;
    }
    get subscriptionPath() {
        throw this._error;
    }
    get tenantId() {
        throw this._error;
    }
    get userId() {
        throw this._error;
    }
    get environment() {
        throw this._error;
    }
}
//# sourceMappingURL=AttachedAccountsTreeItem.js.map