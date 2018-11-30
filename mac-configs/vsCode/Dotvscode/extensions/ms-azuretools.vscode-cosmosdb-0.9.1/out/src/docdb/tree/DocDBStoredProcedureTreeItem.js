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
/**
 * Represents a Cosmos DB DocumentDB (SQL) stored procedure
 */
class DocDBStoredProcedureTreeItem extends vscode_azureextensionui_1.AzureTreeItem {
    constructor(parent, procedure) {
        super(parent);
        this.procedure = procedure;
        this.contextValue = DocDBStoredProcedureTreeItem.contextValue;
        this.commandId = 'cosmosDB.openStoredProcedure';
    }
    get id() {
        return this.procedure.id;
    }
    get label() {
        return this.procedure.id;
    }
    get link() {
        return this.procedure._self;
    }
    update(newProcBody) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = this.root.getDocumentClient();
            this.procedure = yield new Promise((resolve, reject) => client.replaceStoredProcedure(this.link, { body: newProcBody, id: this.procedure.id }, (err, updated) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(updated);
                }
            }));
            return newProcBody;
        });
    }
    get iconPath() {
        return {
            light: path.join(__filename, '..', '..', '..', '..', '..', 'resources', 'icons', 'light', 'Process_16x.svg'),
            dark: path.join(__filename, '..', '..', '..', '..', '..', 'resources', 'icons', 'dark', 'Process_16x.svg')
        };
    }
    deleteTreeItemImpl() {
        return __awaiter(this, void 0, void 0, function* () {
            const message = `Are you sure you want to delete stored procedure '${this.label}'?`;
            const result = yield vscode.window.showWarningMessage(message, { modal: true }, vscode_azureextensionui_1.DialogResponses.deleteResponse, vscode_azureextensionui_1.DialogResponses.cancel);
            if (result === vscode_azureextensionui_1.DialogResponses.deleteResponse) {
                const client = this.root.getDocumentClient();
                yield new Promise((resolve, reject) => {
                    client.deleteStoredProcedure(this.link, err => err ? reject(err) : resolve());
                });
            }
            else {
                throw new vscode_azureextensionui_1.UserCancelledError();
            }
        });
    }
}
DocDBStoredProcedureTreeItem.contextValue = "cosmosDBStoredProcedure";
exports.DocDBStoredProcedureTreeItem = DocDBStoredProcedureTreeItem;
//# sourceMappingURL=DocDBStoredProcedureTreeItem.js.map