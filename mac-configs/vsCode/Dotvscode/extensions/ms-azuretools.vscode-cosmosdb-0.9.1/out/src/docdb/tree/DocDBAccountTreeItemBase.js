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
const deleteCosmosDBAccount_1 = require("../../commands/deleteCosmosDBAccount");
const timeout_1 = require("../../utils/timeout");
const getDocumentClient_1 = require("../getDocumentClient");
const DocDBTreeItemBase_1 = require("./DocDBTreeItemBase");
/**
 * This class provides common logic for DocumentDB, Graph, and Table accounts
 * (DocumentDB is the base type for all Cosmos DB accounts)
 */
class DocDBAccountTreeItemBase extends DocDBTreeItemBase_1.DocDBTreeItemBase {
    constructor(parent, id, label, documentEndpoint, masterKey, isEmulator, databaseAccount) {
        super(parent);
        this.databaseAccount = databaseAccount;
        this.childTypeLabel = "Database";
        this.id = id;
        this.label = label;
        this._root = Object.assign({}, parent.root, {
            documentEndpoint,
            masterKey,
            isEmulator,
            getDocumentClient: () => getDocumentClient_1.getDocumentClient(documentEndpoint, masterKey, isEmulator)
        });
    }
    // overrides ISubscriptionRoot with an object that also has DocDB info
    get root() {
        return this._root;
    }
    get connectionString() {
        return `AccountEndpoint=${this.root.documentEndpoint};AccountKey=${this.root.masterKey}`;
    }
    get iconPath() {
        return {
            light: path.join(__filename, '..', '..', '..', '..', '..', 'resources', 'icons', 'light', 'CosmosDBAccount.svg'),
            dark: path.join(__filename, '..', '..', '..', '..', '..', 'resources', 'icons', 'dark', 'CosmosDBAccount.svg')
        };
    }
    getIterator(client, feedOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield client.readDatabases(feedOptions);
        });
    }
    createChildImpl(showCreatingTreeItem) {
        return __awaiter(this, void 0, void 0, function* () {
            const databaseName = yield vscode.window.showInputBox({
                placeHolder: 'Database Name',
                validateInput: DocDBAccountTreeItemBase.validateDatabaseName,
                ignoreFocusOut: true
            });
            if (databaseName) {
                showCreatingTreeItem(databaseName);
                const client = this.root.getDocumentClient();
                const database = yield new Promise((resolve, reject) => {
                    client.createDatabase({ id: databaseName }, (err, db) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(db);
                        }
                    });
                });
                return this.initChild(database);
            }
            throw new vscode_azureextensionui_1.UserCancelledError();
        });
    }
    loadMoreChildrenImpl(clearCache) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            if (this._root.isEmulator) {
                let unableToReachEmulatorMessage = "Unable to reach emulator. Please ensure it is started and writing to the appropriate port. Then try again.";
                return yield timeout_1.rejectOnTimeout(2000, () => _super("loadMoreChildrenImpl").call(this, clearCache), unableToReachEmulatorMessage);
            }
            else {
                return yield _super("loadMoreChildrenImpl").call(this, clearCache);
            }
        });
    }
    static validateDatabaseName(name) {
        if (!name || name.length < 1 || name.length > 255) {
            return "Name has to be between 1 and 255 chars long";
        }
        if (name.endsWith(" ")) {
            return "Database name cannot end with space";
        }
        if (/[/\\?#]/.test(name)) {
            return `Database name cannot contain the characters '\\', '/', '#', '?'`;
        }
        return undefined;
    }
    deleteTreeItemImpl() {
        return __awaiter(this, void 0, void 0, function* () {
            yield deleteCosmosDBAccount_1.deleteCosmosDBAccount(this);
        });
    }
}
exports.DocDBAccountTreeItemBase = DocDBAccountTreeItemBase;
//# sourceMappingURL=DocDBAccountTreeItemBase.js.map