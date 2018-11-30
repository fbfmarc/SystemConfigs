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
const DocDBStoredProceduresTreeItem_1 = require("../../docdb/tree/DocDBStoredProceduresTreeItem");
const DocDBStoredProcedureTreeItem_1 = require("../../docdb/tree/DocDBStoredProcedureTreeItem");
const GraphTreeItem_1 = require("./GraphTreeItem");
class GraphCollectionTreeItem extends vscode_azureextensionui_1.AzureParentTreeItem {
    constructor(parent, collection) {
        super(parent);
        this.contextValue = GraphCollectionTreeItem.contextValue;
        this._collection = collection;
        this._graphTreeItem = new GraphTreeItem_1.GraphTreeItem(this, this._collection);
        this._storedProceduresTreeItem = new DocDBStoredProceduresTreeItem_1.DocDBStoredProceduresTreeItem(this);
    }
    get id() {
        return this._collection.id;
    }
    get label() {
        return this._collection.id;
    }
    get link() {
        return this._collection._self;
    }
    get iconPath() {
        return {
            light: path.join(__filename, '..', '..', '..', '..', '..', 'resources', 'icons', 'theme-agnostic', 'Collection.svg'),
            dark: path.join(__filename, '..', '..', '..', '..', '..', 'resources', 'icons', 'theme-agnostic', 'Collection.svg')
        };
    }
    loadMoreChildrenImpl(_clearCache) {
        return __awaiter(this, void 0, void 0, function* () {
            return [this._graphTreeItem, this._storedProceduresTreeItem];
        });
    }
    hasMoreChildrenImpl() {
        return false;
    }
    deleteTreeItemImpl() {
        return __awaiter(this, void 0, void 0, function* () {
            const message = `Are you sure you want to delete graph '${this.label}' and its contents?`;
            const result = yield vscode.window.showWarningMessage(message, { modal: true }, vscode_azureextensionui_1.DialogResponses.deleteResponse, vscode_azureextensionui_1.DialogResponses.cancel);
            if (result === vscode_azureextensionui_1.DialogResponses.deleteResponse) {
                const client = this.root.getDocumentClient();
                yield new Promise((resolve, reject) => {
                    client.deleteCollection(this.link, err => err ? reject(err) : resolve());
                });
            }
            else {
                throw new vscode_azureextensionui_1.UserCancelledError();
            }
        });
    }
    pickTreeItemImpl(expectedContextValue) {
        switch (expectedContextValue) {
            case GraphTreeItem_1.GraphTreeItem.contextValue:
                return this._graphTreeItem;
            case DocDBStoredProceduresTreeItem_1.DocDBStoredProceduresTreeItem.contextValue:
            case DocDBStoredProcedureTreeItem_1.DocDBStoredProcedureTreeItem.contextValue:
                return this._storedProceduresTreeItem;
            default:
                return undefined;
        }
    }
}
GraphCollectionTreeItem.contextValue = "cosmosDBGraph";
exports.GraphCollectionTreeItem = GraphCollectionTreeItem;
//# sourceMappingURL=GraphCollectionTreeItem.js.map