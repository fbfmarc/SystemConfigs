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
const constants_1 = require("../../constants");
const vscodeUtils_1 = require("../../utils/vscodeUtils");
/**
 * Represents a Cosmos DB DocumentDB (SQL) document
 */
class DocDBDocumentTreeItem extends vscode_azureextensionui_1.AzureTreeItem {
    constructor(parent, document) {
        super(parent);
        this.contextValue = DocDBDocumentTreeItem.contextValue;
        this.commandId = 'cosmosDB.openDocument';
        this._document = document;
        this._partitionKeyValue = this.getPartitionKeyValue();
        this._label = vscodeUtils_1.getDocumentTreeItemLabel(this._document);
    }
    get id() {
        return this.document._rid || `${this.document.id}:${this.getPartitionKeyValue()}`;
        // Every document has an _rid field, even though the type definitions call it optional. The second clause is fallback.
        // The toString implicit conversion handles undefined and {} as expected. toString satisfies the uniqueness criterion.
    }
    refreshLabelImpl() {
        return __awaiter(this, void 0, void 0, function* () {
            this._label = vscodeUtils_1.getDocumentTreeItemLabel(this._document);
        });
    }
    get link() {
        return this.document._self;
    }
    get document() {
        return this._document;
    }
    get label() {
        return this._label;
    }
    get iconPath() {
        return {
            light: path.join(__filename, '..', '..', '..', '..', '..', 'resources', 'icons', 'theme-agnostic', 'Document.svg'),
            dark: path.join(__filename, '..', '..', '..', '..', '..', 'resources', 'icons', 'theme-agnostic', 'Document.svg')
        };
    }
    deleteTreeItemImpl() {
        return __awaiter(this, void 0, void 0, function* () {
            const message = `Are you sure you want to delete document '${this.label}'?`;
            const result = yield vscode.window.showWarningMessage(message, { modal: true }, vscode_azureextensionui_1.DialogResponses.deleteResponse, vscode_azureextensionui_1.DialogResponses.cancel);
            if (result === vscode_azureextensionui_1.DialogResponses.deleteResponse) {
                const client = this.root.getDocumentClient();
                const options = { partitionKey: this._partitionKeyValue };
                yield new Promise((resolve, reject) => {
                    // Disabling type check in the next line. This helps ensure documents having no partition key value
                    // can still pass an empty object when required. It looks like a disparity between the type settings outlined here
                    // https://github.com/DefinitelyTyped/DefinitelyTyped/blob/01e0ffdbab16b15c702d5b8c87bb122cc6215a59/types/documentdb/index.d.ts#L72
                    // vs. the workaround outlined at https://github.com/Azure/azure-documentdb-node/issues/222#issuecomment-364286027
                    // tslint:disable-next-line:no-any no-function-expression
                    client.deleteDocument(this.link, options, function (err) {
                        err ? reject(err) : resolve();
                    });
                });
            }
            else {
                throw new vscode_azureextensionui_1.UserCancelledError();
            }
        });
    }
    update(newData) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = this.root.getDocumentClient();
            const _self = this.document._self;
            if (["_self", "_etag"].some((element) => !newData[element])) {
                throw new Error(`The "_self" and "_etag" fields are required to update a document`);
            }
            else {
                let options = { accessCondition: { type: 'IfMatch', condition: newData._etag }, partitionKey: this._partitionKeyValue };
                this._document = yield new Promise((resolve, reject) => {
                    client.replaceDocument(_self, newData, 
                    //tslint:disable-next-line:no-any
                    options, (err, updated) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(updated);
                        }
                    });
                });
                return this.document;
            }
        });
    }
    getPartitionKeyValue() {
        const partitionKey = this.parent.parent.partitionKey;
        if (!partitionKey) { //Fixed collections -> no partitionKeyValue
            return undefined;
        }
        const fields = partitionKey.paths[0].split('/');
        if (fields[0] === '') {
            fields.shift();
        }
        let value;
        for (let field of fields) {
            value = value ? value[field] : this.document[field];
            if (!value) { //Partition Key exists, but this document doesn't have a value
                return constants_1.emptyPartitionKeyValue;
            }
        }
        return value;
    }
}
DocDBDocumentTreeItem.contextValue = "cosmosDBDocument";
exports.DocDBDocumentTreeItem = DocDBDocumentTreeItem;
//# sourceMappingURL=DocDBDocumentTreeItem.js.map