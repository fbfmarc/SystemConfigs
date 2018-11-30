"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const DocDBDatabaseTreeItemBase_1 = require("../../docdb/tree/DocDBDatabaseTreeItemBase");
const gremlinEndpoints_1 = require("../gremlinEndpoints");
const GraphCollectionTreeItem_1 = require("./GraphCollectionTreeItem");
class GraphDatabaseTreeItem extends DocDBDatabaseTreeItemBase_1.DocDBDatabaseTreeItemBase {
    constructor(parent, _gremlinEndpoint, database) {
        super(parent, database);
        this._gremlinEndpoint = _gremlinEndpoint;
        this.contextValue = GraphDatabaseTreeItem.contextValue;
        this.childTypeLabel = 'Graph';
    }
    initChild(collection) {
        return new GraphCollectionTreeItem_1.GraphCollectionTreeItem(this, collection);
    }
    // Gremlin endpoint, if definitely known
    get gremlinEndpoint() {
        return this._gremlinEndpoint;
    }
    get possibleGremlinEndpoints() {
        return gremlinEndpoints_1.getPossibleGremlinEndpoints(this.root.documentEndpoint);
    }
}
GraphDatabaseTreeItem.contextValue = "cosmosDBGraphDatabase";
exports.GraphDatabaseTreeItem = GraphDatabaseTreeItem;
//# sourceMappingURL=GraphDatabaseTreeItem.js.map