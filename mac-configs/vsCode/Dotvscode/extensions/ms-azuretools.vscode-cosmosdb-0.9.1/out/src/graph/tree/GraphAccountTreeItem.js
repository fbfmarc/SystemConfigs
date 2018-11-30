"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const DocDBAccountTreeItemBase_1 = require("../../docdb/tree/DocDBAccountTreeItemBase");
const DocDBStoredProceduresTreeItem_1 = require("../../docdb/tree/DocDBStoredProceduresTreeItem");
const DocDBStoredProcedureTreeItem_1 = require("../../docdb/tree/DocDBStoredProcedureTreeItem");
const GraphCollectionTreeItem_1 = require("./GraphCollectionTreeItem");
const GraphDatabaseTreeItem_1 = require("./GraphDatabaseTreeItem");
const GraphTreeItem_1 = require("./GraphTreeItem");
class GraphAccountTreeItem extends DocDBAccountTreeItemBase_1.DocDBAccountTreeItemBase {
    constructor(parent, id, label, documentEndpoint, _gremlinEndpoint, masterKey, isEmulator, databaseAccount) {
        super(parent, id, label, documentEndpoint, masterKey, isEmulator, databaseAccount);
        this._gremlinEndpoint = _gremlinEndpoint;
        this.databaseAccount = databaseAccount;
        this.contextValue = GraphAccountTreeItem.contextValue;
    }
    initChild(database) {
        return new GraphDatabaseTreeItem_1.GraphDatabaseTreeItem(this, this._gremlinEndpoint, database);
    }
    isAncestorOfImpl(contextValue) {
        switch (contextValue) {
            case GraphDatabaseTreeItem_1.GraphDatabaseTreeItem.contextValue:
            case GraphCollectionTreeItem_1.GraphCollectionTreeItem.contextValue:
            case DocDBStoredProceduresTreeItem_1.DocDBStoredProceduresTreeItem.contextValue:
            case DocDBStoredProcedureTreeItem_1.DocDBStoredProcedureTreeItem.contextValue:
            case GraphTreeItem_1.GraphTreeItem.contextValue:
                return true;
            default:
                return false;
        }
    }
}
GraphAccountTreeItem.contextValue = "cosmosDBGraphAccount";
exports.GraphAccountTreeItem = GraphAccountTreeItem;
//# sourceMappingURL=GraphAccountTreeItem.js.map