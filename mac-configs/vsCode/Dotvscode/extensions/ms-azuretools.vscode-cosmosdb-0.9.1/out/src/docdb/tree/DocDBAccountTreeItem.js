"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const DocDBAccountTreeItemBase_1 = require("./DocDBAccountTreeItemBase");
const DocDBCollectionTreeItem_1 = require("./DocDBCollectionTreeItem");
const DocDBDatabaseTreeItem_1 = require("./DocDBDatabaseTreeItem");
const DocDBDocumentsTreeItem_1 = require("./DocDBDocumentsTreeItem");
const DocDBDocumentTreeItem_1 = require("./DocDBDocumentTreeItem");
const DocDBStoredProceduresTreeItem_1 = require("./DocDBStoredProceduresTreeItem");
const DocDBStoredProcedureTreeItem_1 = require("./DocDBStoredProcedureTreeItem");
class DocDBAccountTreeItem extends DocDBAccountTreeItemBase_1.DocDBAccountTreeItemBase {
    constructor() {
        super(...arguments);
        this.contextValue = DocDBAccountTreeItem.contextValue;
    }
    initChild(database) {
        return new DocDBDatabaseTreeItem_1.DocDBDatabaseTreeItem(this, database);
    }
    isAncestorOfImpl(contextValue) {
        switch (contextValue) {
            case DocDBDatabaseTreeItem_1.DocDBDatabaseTreeItem.contextValue:
            case DocDBCollectionTreeItem_1.DocDBCollectionTreeItem.contextValue:
            case DocDBDocumentTreeItem_1.DocDBDocumentTreeItem.contextValue:
            case DocDBStoredProcedureTreeItem_1.DocDBStoredProcedureTreeItem.contextValue:
            case DocDBDocumentsTreeItem_1.DocDBDocumentsTreeItem.contextValue:
            case DocDBStoredProceduresTreeItem_1.DocDBStoredProceduresTreeItem.contextValue:
                return true;
            default:
                return false;
        }
    }
}
DocDBAccountTreeItem.contextValue = "cosmosDBDocumentServer";
exports.DocDBAccountTreeItem = DocDBAccountTreeItem;
//# sourceMappingURL=DocDBAccountTreeItem.js.map