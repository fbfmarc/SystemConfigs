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
const docDBConnectionStrings_1 = require("../../docdb/docDBConnectionStrings");
const DocDBAccountTreeItemBase_1 = require("../../docdb/tree/DocDBAccountTreeItemBase");
const DocDBDatabaseTreeItemBase_1 = require("../../docdb/tree/DocDBDatabaseTreeItemBase");
const extensionVariables_1 = require("../../extensionVariables");
const mongoConnectionStrings_1 = require("../../mongo/mongoConnectionStrings");
const MongoAccountTreeItem_1 = require("../../mongo/tree/MongoAccountTreeItem");
const MongoDatabaseTreeItem_1 = require("../../mongo/tree/MongoDatabaseTreeItem");
const CosmosDBAccountProvider_1 = require("../../tree/CosmosDBAccountProvider");
const apiCache_1 = require("./apiCache");
const DatabaseAccountTreeItemInternal_1 = require("./DatabaseAccountTreeItemInternal");
const DatabaseTreeItemInternal_1 = require("./DatabaseTreeItemInternal");
function findTreeItem(query) {
    return __awaiter(this, void 0, void 0, function* () {
        const connectionString = query.connectionString;
        let parsedCS;
        if (/^mongodb[^:]*:\/\//i.test(connectionString)) {
            parsedCS = yield mongoConnectionStrings_1.parseMongoConnectionString(connectionString);
        }
        else {
            parsedCS = docDBConnectionStrings_1.parseDocDBConnectionString(connectionString);
        }
        const maxTime = Date.now() + 10 * 1000; // Give up searching subscriptions after 10 seconds and just attach the account
        // 1. Get result from cache if possible
        let result = apiCache_1.tryGetTreeItemFromCache(parsedCS);
        // 2. Search attached accounts (do this before subscriptions because it's faster)
        if (!result) {
            const attachedDbAccounts = yield extensionVariables_1.ext.attachedAccountsNode.getCachedChildren();
            result = yield searchDbAccounts(attachedDbAccounts, parsedCS, maxTime);
        }
        // 3. Search subscriptions
        if (!result) {
            const rootNodes = yield extensionVariables_1.ext.tree.getChildren();
            for (const rootNode of rootNodes) {
                if (Date.now() > maxTime) {
                    break;
                }
                if (rootNode instanceof CosmosDBAccountProvider_1.CosmosDBAccountProvider) {
                    const dbAccounts = yield rootNode.getCachedChildren();
                    result = yield searchDbAccounts(dbAccounts, parsedCS, maxTime);
                    if (result) {
                        break;
                    }
                }
            }
        }
        // 4. If all else fails, just attach a new node
        if (!result) {
            result = new DatabaseTreeItemInternal_1.DatabaseTreeItemInternal(parsedCS);
        }
        apiCache_1.cacheTreeItem(parsedCS, result);
        return result;
    });
}
exports.findTreeItem = findTreeItem;
function searchDbAccounts(dbAccounts, expected, maxTime) {
    return __awaiter(this, void 0, void 0, function* () {
        for (const dbAccount of dbAccounts) {
            if (Date.now() > maxTime) {
                return undefined;
            }
            let actual;
            if (dbAccount instanceof MongoAccountTreeItem_1.MongoAccountTreeItem) {
                actual = yield mongoConnectionStrings_1.parseMongoConnectionString(dbAccount.connectionString);
            }
            else if (dbAccount instanceof DocDBAccountTreeItemBase_1.DocDBAccountTreeItemBase) {
                actual = docDBConnectionStrings_1.parseDocDBConnectionString(dbAccount.connectionString);
            }
            else {
                return undefined;
            }
            if (expected.accountId === actual.accountId) {
                if (expected.databaseName) {
                    const dbs = yield dbAccount.getCachedChildren();
                    for (const db of dbs) {
                        if ((db instanceof MongoDatabaseTreeItem_1.MongoDatabaseTreeItem || db instanceof DocDBDatabaseTreeItemBase_1.DocDBDatabaseTreeItemBase) && expected.databaseName === db.databaseName) {
                            return new DatabaseTreeItemInternal_1.DatabaseTreeItemInternal(expected, dbAccount, db);
                        }
                    }
                    // We found the right account - just not the db. In this case we can still 'reveal' the account
                    return new DatabaseTreeItemInternal_1.DatabaseTreeItemInternal(expected, dbAccount);
                }
                return new DatabaseAccountTreeItemInternal_1.DatabaseAccountTreeItemInternal(expected, dbAccount);
            }
        }
        return undefined;
    });
}
//# sourceMappingURL=findTreeItem.js.map