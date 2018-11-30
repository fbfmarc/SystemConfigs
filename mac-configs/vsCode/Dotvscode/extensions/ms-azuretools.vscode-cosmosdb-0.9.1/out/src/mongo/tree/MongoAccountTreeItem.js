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
const vscode_azureextensionui_1 = require("vscode-azureextensionui");
const deleteCosmosDBAccount_1 = require("../../commands/deleteCosmosDBAccount");
const extensionVariables_1 = require("../../extensionVariables");
const connectToMongoClient_1 = require("../connectToMongoClient");
const mongoConnectionStrings_1 = require("../mongoConnectionStrings");
const MongoCollectionTreeItem_1 = require("./MongoCollectionTreeItem");
const MongoDatabaseTreeItem_1 = require("./MongoDatabaseTreeItem");
const MongoDocumentTreeItem_1 = require("./MongoDocumentTreeItem");
class MongoAccountTreeItem extends vscode_azureextensionui_1.AzureParentTreeItem {
    constructor(parent, id, label, connectionString, isEmulator, databaseAccount) {
        super(parent);
        this.databaseAccount = databaseAccount;
        this.contextValue = MongoAccountTreeItem.contextValue;
        this.childTypeLabel = "Database";
        this.id = id;
        this.label = label;
        this.connectionString = connectionString;
        this._root = Object.assign({}, parent.root, { isEmulator });
    }
    // overrides ISubscriptionRoot with an object that also has Mongo info
    get root() {
        return this._root;
    }
    get iconPath() {
        return {
            light: path.join(__filename, '..', '..', '..', '..', '..', 'resources', 'icons', 'light', 'CosmosDBAccount.svg'),
            dark: path.join(__filename, '..', '..', '..', '..', '..', 'resources', 'icons', 'dark', 'CosmosDBAccount.svg')
        };
    }
    hasMoreChildrenImpl() {
        return false;
    }
    loadMoreChildrenImpl(_clearCache) {
        return __awaiter(this, void 0, void 0, function* () {
            let db;
            try {
                let databases;
                if (!this.connectionString) {
                    throw new Error('Missing connection string');
                }
                db = yield connectToMongoClient_1.connectToMongoClient(this.connectionString, vscode_azureextensionui_1.appendExtensionUserAgent());
                let databaseInConnectionString = mongoConnectionStrings_1.getDatabaseNameFromConnectionString(this.connectionString);
                if (databaseInConnectionString && !this.root.isEmulator) { // emulator violates the connection string format
                    // If the database is in the connection string, that's all we connect to (we might not even have permissions to list databases)
                    databases = [{
                            name: databaseInConnectionString,
                            empty: false
                        }];
                }
                else {
                    let result = yield db.admin().listDatabases();
                    databases = result.databases;
                }
                return databases
                    .filter((database) => !(database.name && database.name.toLowerCase() === "admin" && database.empty)) // Filter out the 'admin' database if it's empty
                    .map(database => new MongoDatabaseTreeItem_1.MongoDatabaseTreeItem(this, database.name, this.connectionString));
            }
            catch (error) {
                let message = vscode_azureextensionui_1.parseError(error).message;
                if (this._root.isEmulator && message.includes("ECONNREFUSED")) {
                    error.message = "Unable to reach emulator. Please ensure it is started and writing to the appropriate port. Then try again.\n" + message;
                }
                throw error;
            }
            finally {
                if (db) {
                    db.close();
                }
            }
        });
    }
    createChildImpl(showCreatingTreeItem) {
        return __awaiter(this, void 0, void 0, function* () {
            const databaseName = yield extensionVariables_1.ext.ui.showInputBox({
                placeHolder: "Database Name",
                prompt: "Enter the name of the database",
                validateInput: validateDatabaseName
            });
            showCreatingTreeItem(databaseName);
            const databaseTreeItem = new MongoDatabaseTreeItem_1.MongoDatabaseTreeItem(this, databaseName, this.connectionString);
            return databaseTreeItem;
        });
    }
    isAncestorOfImpl(contextValue) {
        switch (contextValue) {
            case MongoDatabaseTreeItem_1.MongoDatabaseTreeItem.contextValue:
            case MongoCollectionTreeItem_1.MongoCollectionTreeItem.contextValue:
            case MongoDocumentTreeItem_1.MongoDocumentTreeItem.contextValue:
                return true;
            default:
                return false;
        }
    }
    deleteTreeItemImpl() {
        return __awaiter(this, void 0, void 0, function* () {
            yield deleteCosmosDBAccount_1.deleteCosmosDBAccount(this);
        });
    }
}
MongoAccountTreeItem.contextValue = "cosmosDBMongoServer";
exports.MongoAccountTreeItem = MongoAccountTreeItem;
function validateDatabaseName(database) {
    // https://docs.mongodb.com/manual/reference/limits/#naming-restrictions
    const min = 1;
    const max = 63;
    if (!database || database.length < min || database.length > max) {
        return `Database name must be between ${min} and ${max} characters.`;
    }
    if (/[/\\. "$]/.test(database)) {
        return "Database name cannot contain these characters - `/\\. \"$`";
    }
    return undefined;
}
//# sourceMappingURL=MongoAccountTreeItem.js.map