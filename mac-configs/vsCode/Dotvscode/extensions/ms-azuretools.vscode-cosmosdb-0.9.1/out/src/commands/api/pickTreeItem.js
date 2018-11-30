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
const DocDBAccountTreeItem_1 = require("../../docdb/tree/DocDBAccountTreeItem");
const DocDBAccountTreeItemBase_1 = require("../../docdb/tree/DocDBAccountTreeItemBase");
const DocDBDatabaseTreeItem_1 = require("../../docdb/tree/DocDBDatabaseTreeItem");
const DocDBDatabaseTreeItemBase_1 = require("../../docdb/tree/DocDBDatabaseTreeItemBase");
const extensionVariables_1 = require("../../extensionVariables");
const GraphAccountTreeItem_1 = require("../../graph/tree/GraphAccountTreeItem");
const GraphDatabaseTreeItem_1 = require("../../graph/tree/GraphDatabaseTreeItem");
const mongoConnectionStrings_1 = require("../../mongo/mongoConnectionStrings");
const MongoAccountTreeItem_1 = require("../../mongo/tree/MongoAccountTreeItem");
const MongoDatabaseTreeItem_1 = require("../../mongo/tree/MongoDatabaseTreeItem");
const TableAccountTreeItem_1 = require("../../table/tree/TableAccountTreeItem");
const AttachedAccountsTreeItem_1 = require("../../tree/AttachedAccountsTreeItem");
const apiCache_1 = require("./apiCache");
const DatabaseAccountTreeItemInternal_1 = require("./DatabaseAccountTreeItemInternal");
const DatabaseTreeItemInternal_1 = require("./DatabaseTreeItemInternal");
const databaseContextValues = [MongoDatabaseTreeItem_1.MongoDatabaseTreeItem.contextValue, DocDBDatabaseTreeItem_1.DocDBDatabaseTreeItem.contextValue, GraphDatabaseTreeItem_1.GraphDatabaseTreeItem.contextValue];
const accountContextValues = [GraphAccountTreeItem_1.GraphAccountTreeItem.contextValue, DocDBAccountTreeItem_1.DocDBAccountTreeItem.contextValue, TableAccountTreeItem_1.TableAccountTreeItem.contextValue, MongoAccountTreeItem_1.MongoAccountTreeItem.contextValue];
function getDatabaseContextValue(apiType) {
    switch (apiType) {
        case 'Mongo':
            return MongoDatabaseTreeItem_1.MongoDatabaseTreeItem.contextValue;
        case 'SQL':
            return DocDBDatabaseTreeItem_1.DocDBDatabaseTreeItem.contextValue;
        case 'Graph':
            return GraphDatabaseTreeItem_1.GraphDatabaseTreeItem.contextValue;
        default:
            throw new RangeError(`Unsupported api type "${apiType}".`);
    }
}
function getAccountContextValue(apiType) {
    switch (apiType) {
        case 'Mongo':
            return MongoAccountTreeItem_1.MongoAccountTreeItem.contextValue;
        case 'SQL':
            return DocDBAccountTreeItem_1.DocDBAccountTreeItem.contextValue;
        case 'Graph':
            return GraphAccountTreeItem_1.GraphAccountTreeItem.contextValue;
        case 'Table':
            return TableAccountTreeItem_1.TableAccountTreeItem.contextValue;
        default:
            throw new RangeError(`Unsupported api type "${apiType}".`);
    }
}
function pickTreeItem(options) {
    return __awaiter(this, void 0, void 0, function* () {
        let contextValuesToFind;
        switch (options.resourceType) {
            case 'Database':
                contextValuesToFind = options.apiType ? options.apiType.map(getDatabaseContextValue) : databaseContextValues;
                break;
            case 'DatabaseAccount':
                contextValuesToFind = options.apiType ? options.apiType.map(getAccountContextValue) : accountContextValues;
                contextValuesToFind = contextValuesToFind.concat(contextValuesToFind.map((val) => val + AttachedAccountsTreeItem_1.AttachedAccountSuffix));
                break;
            default:
                throw new RangeError(`Unsupported resource type "${options.resourceType}".`);
        }
        const pickedItem = yield extensionVariables_1.ext.tree.showTreeItemPicker(contextValuesToFind);
        let parsedCS;
        let accountNode;
        let databaseNode;
        if (pickedItem instanceof MongoAccountTreeItem_1.MongoAccountTreeItem) {
            parsedCS = yield mongoConnectionStrings_1.parseMongoConnectionString(pickedItem.connectionString);
            accountNode = pickedItem;
        }
        else if (pickedItem instanceof DocDBAccountTreeItemBase_1.DocDBAccountTreeItemBase) {
            parsedCS = docDBConnectionStrings_1.parseDocDBConnectionString(pickedItem.connectionString);
            accountNode = pickedItem;
        }
        else if (pickedItem instanceof MongoDatabaseTreeItem_1.MongoDatabaseTreeItem) {
            parsedCS = yield mongoConnectionStrings_1.parseMongoConnectionString(pickedItem.connectionString);
            accountNode = pickedItem.parent;
            databaseNode = pickedItem;
        }
        else if (pickedItem instanceof DocDBDatabaseTreeItemBase_1.DocDBDatabaseTreeItemBase) {
            parsedCS = docDBConnectionStrings_1.parseDocDBConnectionString(pickedItem.connectionString);
            accountNode = pickedItem.parent;
            databaseNode = pickedItem;
        }
        const result = databaseNode ?
            new DatabaseTreeItemInternal_1.DatabaseTreeItemInternal(parsedCS, accountNode, databaseNode) :
            new DatabaseAccountTreeItemInternal_1.DatabaseAccountTreeItemInternal(parsedCS, accountNode);
        apiCache_1.cacheTreeItem(parsedCS, result);
        return result;
    });
}
exports.pickTreeItem = pickTreeItem;
//# sourceMappingURL=pickTreeItem.js.map