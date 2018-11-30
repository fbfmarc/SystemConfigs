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
const vscode_azureextensionui_1 = require("vscode-azureextensionui");
const constants_1 = require("../../constants");
/**
 * This class provides common iteration logic for DocumentDB accounts, databases, and collections
 */
class DocDBTreeItemBase extends vscode_azureextensionui_1.AzureParentTreeItem {
    constructor() {
        super(...arguments);
        this._hasMoreChildren = true;
        this._batchSize = constants_1.defaultBatchSize;
    }
    hasMoreChildrenImpl() {
        return this._hasMoreChildren;
    }
    loadMoreChildrenImpl(clearCache) {
        return __awaiter(this, void 0, void 0, function* () {
            if (clearCache || this._iterator === undefined) {
                this._hasMoreChildren = true;
                const client = this.root.getDocumentClient();
                this._iterator = yield this.getIterator(client, { maxItemCount: constants_1.defaultBatchSize });
                this._batchSize = constants_1.defaultBatchSize;
            }
            const resources = [];
            let count = 0;
            while (count < this._batchSize) {
                const resource = yield new Promise((resolve, reject) => {
                    this._iterator.nextItem((error, rsrc) => {
                        error ? reject(error) : resolve(rsrc);
                    });
                });
                if (resource === undefined) {
                    this._hasMoreChildren = false;
                    break;
                }
                else {
                    resources.push(resource);
                    count += 1;
                }
            }
            this._batchSize *= 2;
            return resources.map((resource) => this.initChild(resource));
        });
    }
}
exports.DocDBTreeItemBase = DocDBTreeItemBase;
//# sourceMappingURL=DocDBTreeItemBase.js.map