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
const DocDBStoredProcedureTreeItem_1 = require("./DocDBStoredProcedureTreeItem");
const DocDBTreeItemBase_1 = require("./DocDBTreeItemBase");
/**
 * This class represents the DocumentDB "Stored Procedures" node in the tree
 */
class DocDBStoredProceduresTreeItem extends DocDBTreeItemBase_1.DocDBTreeItemBase {
    constructor(parent) {
        super(parent);
        this.contextValue = DocDBStoredProceduresTreeItem.contextValue;
        this.childTypeLabel = "Stored Procedure";
    }
    initChild(resource) {
        return new DocDBStoredProcedureTreeItem_1.DocDBStoredProcedureTreeItem(this, resource);
    }
    get iconPath() {
        return {
            light: path.join(__filename, '..', '..', '..', '..', '..', 'resources', 'icons', 'theme-agnostic', 'stored procedures.svg'),
            dark: path.join(__filename, '..', '..', '..', '..', '..', 'resources', 'icons', 'theme-agnostic', 'stored procedures.svg')
        };
    }
    createChildImpl(showCreatingTreeItem) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = this.root.getDocumentClient();
            let spID = yield vscode.window.showInputBox({
                prompt: "Enter a unique stored procedure ID",
                validateInput: this.validateName,
                ignoreFocusOut: true
            });
            if (spID || spID === "") {
                spID = spID.trim();
                showCreatingTreeItem(spID);
                const sproc = yield new Promise((resolve, reject) => {
                    client.createStoredProcedure(this.link, { id: spID, body: constants_1.defaultStoredProcedure }, (err, result) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(result);
                        }
                    });
                });
                return this.initChild(sproc);
            }
            throw new vscode_azureextensionui_1.UserCancelledError();
        });
    }
    get id() {
        return "$StoredProcedures";
    }
    get label() {
        return "Stored Procedures";
    }
    get link() {
        return this.parent.link;
    }
    getIterator(client, feedOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield client.readStoredProcedures(this.link, feedOptions);
        });
    }
    validateName(name) {
        if (name) {
            if (name.indexOf("/") !== -1 || name.indexOf("\\") !== -1 || name.indexOf("?") !== -1 || name.indexOf("#") !== -1) {
                return "Id contains illegal chars: /,\\,?,#";
            }
            if (name[name.length - 1] === " ") {
                return "Id ends with a space.";
            }
        }
        return null;
    }
}
DocDBStoredProceduresTreeItem.contextValue = "cosmosDBStoredProceduresGroup";
exports.DocDBStoredProceduresTreeItem = DocDBStoredProceduresTreeItem;
//# sourceMappingURL=DocDBStoredProceduresTreeItem.js.map