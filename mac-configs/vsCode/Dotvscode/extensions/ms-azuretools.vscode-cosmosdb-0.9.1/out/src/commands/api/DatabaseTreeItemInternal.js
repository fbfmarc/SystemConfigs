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
const extensionVariables_1 = require("../../extensionVariables");
const DatabaseAccountTreeItemInternal_1 = require("./DatabaseAccountTreeItemInternal");
class DatabaseTreeItemInternal extends DatabaseAccountTreeItemInternal_1.DatabaseAccountTreeItemInternal {
    constructor(parsedCS, accountNode, dbNode) {
        super(parsedCS, accountNode);
        this._dbNode = dbNode;
    }
    get databaseName() {
        return this._parsedCS.databaseName;
    }
    reveal() {
        return __awaiter(this, void 0, void 0, function* () {
            const accountNode = yield this.getAccountNode();
            if (!this._dbNode) {
                const databaseId = `${accountNode.fullId}/${this.databaseName}`;
                this._dbNode = yield extensionVariables_1.ext.tree.findTreeItem(databaseId);
            }
            extensionVariables_1.ext.treeView.reveal(this._dbNode || accountNode);
        });
    }
}
exports.DatabaseTreeItemInternal = DatabaseTreeItemInternal;
//# sourceMappingURL=DatabaseTreeItemInternal.js.map