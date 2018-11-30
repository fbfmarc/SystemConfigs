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
const DocDBDocumentsTreeItem_1 = require("./DocDBDocumentsTreeItem");
const DocDBDocumentTreeItem_1 = require("./DocDBDocumentTreeItem");
const DocDBStoredProceduresTreeItem_1 = require("./DocDBStoredProceduresTreeItem");
const DocDBStoredProcedureTreeItem_1 = require("./DocDBStoredProcedureTreeItem");
/**
 * Represents a DocumentDB collection
 */
class DocDBCollectionTreeItem extends vscode_azureextensionui_1.AzureParentTreeItem {
    constructor(parent, _collection) {
        super(parent);
        this._collection = _collection;
        this.contextValue = DocDBCollectionTreeItem.contextValue;
        this.documentsTreeItem = new DocDBDocumentsTreeItem_1.DocDBDocumentsTreeItem(this);
        this._storedProceduresTreeItem = new DocDBStoredProceduresTreeItem_1.DocDBStoredProceduresTreeItem(this);
    }
    get id() {
        return this._collection.id;
    }
    get label() {
        return this._collection.id;
    }
    get iconPath() {
        return {
            light: path.join(__filename, '..', '..', '..', '..', '..', 'resources', 'icons', 'theme-agnostic', 'Collection.svg'),
            dark: path.join(__filename, '..', '..', '..', '..', '..', 'resources', 'icons', 'theme-agnostic', 'Collection.svg')
        };
    }
    get link() {
        return this._collection._self;
    }
    get partitionKey() {
        return this._collection.partitionKey;
    }
    deleteTreeItemImpl() {
        return __awaiter(this, void 0, void 0, function* () {
            const message = `Are you sure you want to delete collection '${this.label}' and its contents?`;
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
    loadMoreChildrenImpl(_clearCache) {
        return __awaiter(this, void 0, void 0, function* () {
            return [this.documentsTreeItem, this._storedProceduresTreeItem];
        });
    }
    hasMoreChildrenImpl() {
        return false;
    }
    pickTreeItemImpl(expectedContextValue) {
        switch (expectedContextValue) {
            case DocDBDocumentsTreeItem_1.DocDBDocumentsTreeItem.contextValue:
            case DocDBDocumentTreeItem_1.DocDBDocumentTreeItem.contextValue:
                return this.documentsTreeItem;
            case DocDBStoredProceduresTreeItem_1.DocDBStoredProceduresTreeItem.contextValue:
            case DocDBStoredProcedureTreeItem_1.DocDBStoredProcedureTreeItem.contextValue:
                return this._storedProceduresTreeItem;
            default:
                return undefined;
        }
    }
}
DocDBCollectionTreeItem.contextValue = "cosmosDBDocumentCollection";
exports.DocDBCollectionTreeItem = DocDBCollectionTreeItem;
//# sourceMappingURL=DocDBCollectionTreeItem.js.map