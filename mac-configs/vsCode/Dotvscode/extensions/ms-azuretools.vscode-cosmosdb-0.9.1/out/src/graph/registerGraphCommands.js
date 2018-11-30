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
const constants_1 = require("../constants");
const extensionVariables_1 = require("../extensionVariables");
const GraphViewsManager_1 = require("./GraphViewsManager");
const GraphAccountTreeItem_1 = require("./tree/GraphAccountTreeItem");
const GraphCollectionTreeItem_1 = require("./tree/GraphCollectionTreeItem");
const GraphDatabaseTreeItem_1 = require("./tree/GraphDatabaseTreeItem");
const GraphTreeItem_1 = require("./tree/GraphTreeItem");
function registerGraphCommands(context) {
    let graphViewsManager = new GraphViewsManager_1.GraphViewsManager(context);
    vscode_azureextensionui_1.registerCommand('cosmosDB.createGraphDatabase', (node) => __awaiter(this, void 0, void 0, function* () {
        if (!node) {
            node = (yield extensionVariables_1.ext.tree.showTreeItemPicker(GraphAccountTreeItem_1.GraphAccountTreeItem.contextValue));
        }
        yield node.createChild();
    }));
    vscode_azureextensionui_1.registerCommand('cosmosDB.createGraph', (node) => __awaiter(this, void 0, void 0, function* () {
        if (!node) {
            node = (yield extensionVariables_1.ext.tree.showTreeItemPicker(GraphDatabaseTreeItem_1.GraphDatabaseTreeItem.contextValue));
        }
        yield node.createChild();
    }));
    vscode_azureextensionui_1.registerCommand('cosmosDB.deleteGraphDatabase', (node) => __awaiter(this, void 0, void 0, function* () {
        if (!node) {
            node = (yield extensionVariables_1.ext.tree.showTreeItemPicker(GraphDatabaseTreeItem_1.GraphDatabaseTreeItem.contextValue));
        }
        yield node.deleteTreeItem();
    }));
    vscode_azureextensionui_1.registerCommand('cosmosDB.deleteGraph', (node) => __awaiter(this, void 0, void 0, function* () {
        if (!node) {
            node = (yield extensionVariables_1.ext.tree.showTreeItemPicker(GraphCollectionTreeItem_1.GraphCollectionTreeItem.contextValue));
        }
        yield node.deleteTreeItem();
    }));
    vscode_azureextensionui_1.registerCommand('cosmosDB.openGraphExplorer', (node) => __awaiter(this, void 0, void 0, function* () {
        if (!node) {
            node = (yield extensionVariables_1.ext.tree.showTreeItemPicker(GraphTreeItem_1.GraphTreeItem.contextValue));
        }
        yield node.showExplorer(graphViewsManager);
        // tslint:disable-next-line:align
    }), constants_1.doubleClickDebounceDelay);
}
exports.registerGraphCommands = registerGraphCommands;
//# sourceMappingURL=registerGraphCommands.js.map