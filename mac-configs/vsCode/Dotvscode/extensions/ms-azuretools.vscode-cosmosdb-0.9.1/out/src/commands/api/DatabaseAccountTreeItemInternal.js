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
const DocDBAccountTreeItemBase_1 = require("../../docdb/tree/DocDBAccountTreeItemBase");
const experiences_1 = require("../../experiences");
const extensionVariables_1 = require("../../extensionVariables");
const mongoConnectionStrings_1 = require("../../mongo/mongoConnectionStrings");
class DatabaseAccountTreeItemInternal {
    constructor(parsedCS, accountNode) {
        this._parsedCS = parsedCS;
        this._accountNode = accountNode;
    }
    get connectionString() {
        return this._parsedCS.connectionString;
    }
    get hostName() {
        return this._parsedCS.hostName;
    }
    get port() {
        return this._parsedCS.port;
    }
    get azureData() {
        if (this._accountNode && this._accountNode.databaseAccount) {
            return {
                accountName: this._accountNode.databaseAccount.name
            };
        }
        else {
            return undefined;
        }
    }
    get docDBData() {
        if (this._accountNode instanceof DocDBAccountTreeItemBase_1.DocDBAccountTreeItemBase) {
            return {
                documentEndpoint: this._accountNode.root.documentEndpoint,
                masterKey: this._accountNode.root.masterKey
            };
        }
        else {
            return undefined;
        }
    }
    reveal() {
        return __awaiter(this, void 0, void 0, function* () {
            extensionVariables_1.ext.treeView.reveal(yield this.getAccountNode());
        });
    }
    getAccountNode() {
        return __awaiter(this, void 0, void 0, function* () {
            // If this._accountNode is undefined, attach a new node based on connection string
            if (!this._accountNode) {
                const apiType = this._parsedCS instanceof mongoConnectionStrings_1.ParsedMongoConnectionString ? experiences_1.API.MongoDB : experiences_1.API.DocumentDB;
                this._accountNode = yield extensionVariables_1.ext.attachedAccountsNode.attachConnectionString(this.connectionString, apiType);
            }
            return this._accountNode;
        });
    }
}
exports.DatabaseAccountTreeItemInternal = DatabaseAccountTreeItemInternal;
//# sourceMappingURL=DatabaseAccountTreeItemInternal.js.map