"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const mongoConnectionStrings_1 = require("../../mongo/mongoConnectionStrings");
/**
 * This cache is used to speed up api calls from other extensions to the Cosmos DB extension
 * For now, it only helps on a per-session basis
 */
const sessionCache = new Map();
function cacheTreeItem(parsedCS, treeItem) {
    sessionCache.set(parsedCS.fullId, treeItem);
}
exports.cacheTreeItem = cacheTreeItem;
function tryGetTreeItemFromCache(parsedCS) {
    return sessionCache.get(parsedCS.fullId);
}
exports.tryGetTreeItemFromCache = tryGetTreeItemFromCache;
function removeTreeItemFromCache(expected) {
    if (!expected.databaseName) {
        // If parsedCS represents an account, remove the account and any databases that match that account
        for (const [key, value] of sessionCache.entries()) {
            const actual = new mongoConnectionStrings_1.ParsedMongoConnectionString(value.connectionString, value.hostName, value.port, undefined);
            if (actual.accountId === expected.accountId) {
                sessionCache.delete(key);
            }
        }
    }
    else {
        sessionCache.delete(expected.fullId);
    }
}
exports.removeTreeItemFromCache = removeTreeItemFromCache;
//# sourceMappingURL=apiCache.js.map