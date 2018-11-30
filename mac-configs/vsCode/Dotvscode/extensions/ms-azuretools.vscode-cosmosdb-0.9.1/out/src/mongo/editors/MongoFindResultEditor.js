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
const MongoCollectionTreeItem_1 = require("../tree/MongoCollectionTreeItem");
const MongoCollectionNodeEditor_1 = require("./MongoCollectionNodeEditor");
// tslint:disable:no-var-requires
const EJSON = require("mongodb-extended-json");
class MongoFindResultEditor {
    constructor(databaseNode, command) {
        this._databaseNode = databaseNode;
        this._command = command;
    }
    get label() {
        const accountNode = this._databaseNode.parent;
        return `${accountNode.label}/${this._databaseNode.label}/${this._command.collection}`;
    }
    getData() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield this._databaseNode.getDb();
            const collection = db.collection(this._command.collection);
            // NOTE: Intentionally creating a _new_ tree item rather than searching for a cached node in the tree because
            // the executed 'find' command could have a filter or projection that is not handled by a cached tree node
            this._collectionTreeItem = new MongoCollectionTreeItem_1.MongoCollectionTreeItem(this._databaseNode, collection, this._command.argumentObjects);
            const documents = yield this._collectionTreeItem.getCachedChildren();
            return documents.map((docTreeItem) => docTreeItem.document);
        });
    }
    update(documents) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedDocs = yield this._collectionTreeItem.update(documents);
            const cachedCollectionNode = yield extensionVariables_1.ext.tree.findTreeItem(this.id);
            if (cachedCollectionNode) {
                yield MongoCollectionNodeEditor_1.MongoCollectionNodeEditor.updateCachedDocNodes(updatedDocs, cachedCollectionNode);
            }
            return updatedDocs;
        });
    }
    get id() {
        return `${this._databaseNode.fullId}/${this._command.collection}`;
    }
    convertFromString(data) {
        return EJSON.parse(data);
    }
    convertToString(data) {
        return EJSON.stringify(data, null, 2);
    }
}
exports.MongoFindResultEditor = MongoFindResultEditor;
//# sourceMappingURL=MongoFindResultEditor.js.map