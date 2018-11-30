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
const fse = require("fs-extra");
const vscode = require("vscode");
const vscode_azureextensionui_1 = require("vscode-azureextensionui");
const DocDBCollectionTreeItem_1 = require("../docdb/tree/DocDBCollectionTreeItem");
const extensionVariables_1 = require("../extensionVariables");
const MongoCollectionTreeItem_1 = require("../mongo/tree/MongoCollectionTreeItem");
function importDocuments(uris, collectionNode) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!uris) {
            uris = yield askForDocuments();
        }
        let ignoredUris = []; //account for https://github.com/Microsoft/vscode/issues/59782
        uris = uris.filter((uri) => {
            if (uri.fsPath.endsWith('.json')) {
                return true;
            }
            else {
                ignoredUris.push(uri);
                return false;
            }
        });
        if (ignoredUris.length) {
            extensionVariables_1.ext.outputChannel.appendLine(`Ignoring the following files which are not json:`);
            ignoredUris.forEach(uri => extensionVariables_1.ext.outputChannel.appendLine(`${uri.fsPath}`));
            extensionVariables_1.ext.outputChannel.show();
        }
        if (!collectionNode) {
            collectionNode = (yield extensionVariables_1.ext.tree.showTreeItemPicker([MongoCollectionTreeItem_1.MongoCollectionTreeItem.contextValue, DocDBCollectionTreeItem_1.DocDBCollectionTreeItem.contextValue]));
        }
        let result;
        result = yield vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "Importing documents..."
        }, (progress) => __awaiter(this, void 0, void 0, function* () {
            progress.report({ increment: 20, message: "Parsing documents for errors" });
            const documents = yield parseDocuments(uris);
            progress.report({ increment: 30, message: "Parsed documents. Importing" });
            if (collectionNode instanceof MongoCollectionTreeItem_1.MongoCollectionTreeItem) {
                result = processMongoResults(yield collectionNode.executeCommand('insertMany', [JSON.stringify(documents)]));
            }
            else {
                result = yield insertDocumentsIntoDocdb(collectionNode, documents, uris);
            }
            progress.report({ increment: 50, message: "Finished importing" });
            return result;
        }));
        yield collectionNode.refresh();
        yield vscode.window.showInformationMessage(result);
    });
}
exports.importDocuments = importDocuments;
function askForDocuments() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield extensionVariables_1.ext.ui.showOpenDialog({
            canSelectMany: true,
            openLabel: "Import",
            filters: {
                "JSON": ["json"]
            },
            defaultUri: vscode.Uri.file(vscode.workspace.rootPath)
        });
    });
}
// tslint:disable-next-line:no-any
function parseDocuments(uris) {
    return __awaiter(this, void 0, void 0, function* () {
        let documents = [];
        let errorFoundFlag = false;
        for (let uri of uris) {
            let parsed;
            try {
                parsed = yield fse.readJSON(uri.fsPath);
            }
            catch (e) {
                if (!errorFoundFlag) {
                    errorFoundFlag = true;
                    extensionVariables_1.ext.outputChannel.appendLine("Errors found in documents listed below. Please fix these.");
                    extensionVariables_1.ext.outputChannel.show();
                }
                const err = vscode_azureextensionui_1.parseError(e);
                extensionVariables_1.ext.outputChannel.appendLine(`${uri.path}:\n${err.message}`);
            }
            if (parsed) {
                if (Array.isArray(parsed)) {
                    documents = documents.concat(parsed);
                }
                else {
                    documents.push(parsed);
                }
            }
        }
        if (errorFoundFlag) {
            throw new Error(`Errors found in some documents. Please see the output, fix these and try again.`);
        }
        return documents;
    });
}
// tslint:disable-next-line:no-any
function insertDocumentsIntoDocdb(collectionNode, documents, uris) {
    return __awaiter(this, void 0, void 0, function* () {
        let result;
        let ids = [];
        let i = 0;
        let erroneousFiles = [];
        for (i = 0; i < documents.length; i++) {
            let document = documents[i];
            if (!collectionNode.documentsTreeItem.documentHasPartitionKey(document)) {
                erroneousFiles.push(uris[i]);
            }
        }
        if (erroneousFiles.length) {
            extensionVariables_1.ext.outputChannel.appendLine(`The following documents do not contain the required partition key:`);
            erroneousFiles.forEach(file => extensionVariables_1.ext.outputChannel.appendLine(file.path));
            extensionVariables_1.ext.outputChannel.show();
            throw new Error(`See output for list of documents that do not contain the partition key '${collectionNode.partitionKey.paths[0]}' required by collection '${collectionNode.label}'`);
        }
        for (let document of documents) {
            const retrieved = yield collectionNode.documentsTreeItem.createDocument(document);
            ids.push(retrieved.id);
        }
        result = `Imported ${ids.length} documents`;
        return result;
    });
}
// tslint:disable-next-line:no-any
function processMongoResults(result) {
    let output = "";
    let parsed = JSON.parse(result);
    if (parsed.result && parsed.result.ok) {
        output = `Import into mongo successful. Inserted ${parsed.insertedCount} document(s). See output for more details.`;
        for (let inserted of parsed.insertedIds) {
            extensionVariables_1.ext.outputChannel.appendLine(`Inserted document: ${inserted}`);
        }
    }
    return output;
}
//# sourceMappingURL=importDocuments.js.map