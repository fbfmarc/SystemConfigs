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
const assert = require("assert");
const path = require("path");
const _ = require("underscore");
const vscode = require("vscode");
const vscode_azureextensionui_1 = require("vscode-azureextensionui");
const constants_1 = require("../../constants");
const extensionVariables_1 = require("../../extensionVariables");
const MongoDocumentTreeItem_1 = require("./MongoDocumentTreeItem");
// tslint:disable:no-var-requires
const EJSON = require("mongodb-extended-json");
class FunctionDescriptor {
    constructor(mongoFunction, text, minShellArgs, maxShellArgs, maxHandledArgs) {
        this.mongoFunction = mongoFunction;
        this.text = text;
        this.minShellArgs = minShellArgs;
        this.maxShellArgs = maxShellArgs;
        this.maxHandledArgs = maxHandledArgs;
    }
}
class MongoCollectionTreeItem extends vscode_azureextensionui_1.AzureParentTreeItem {
    constructor(parent, collection, query) {
        super(parent);
        this.contextValue = MongoCollectionTreeItem.contextValue;
        this.childTypeLabel = "Document";
        this._hasMoreChildren = true;
        this._batchSize = constants_1.defaultBatchSize;
        this.collection = collection;
        if (query && query.length) {
            this._query = query[0];
            this._projection = query.length > 1 && query[1];
        }
    }
    update(documents) {
        return __awaiter(this, void 0, void 0, function* () {
            const operations = documents.map((document) => {
                return {
                    updateOne: {
                        filter: { _id: document._id },
                        update: _.omit(document, '_id'),
                        upsert: false
                    }
                };
            });
            const result = yield this.collection.bulkWrite(operations);
            extensionVariables_1.ext.outputChannel.appendLine(`Successfully updated ${result.modifiedCount} document(s), inserted ${result.insertedCount} document(s)`);
            return documents;
        });
    }
    get id() {
        return this.collection.collectionName;
    }
    get label() {
        return this.collection.collectionName;
    }
    get iconPath() {
        return {
            light: path.join(__filename, '..', '..', '..', '..', '..', 'resources', 'icons', 'theme-agnostic', 'Collection.svg'),
            dark: path.join(__filename, '..', '..', '..', '..', '..', 'resources', 'icons', 'theme-agnostic', 'Collection.svg')
        };
    }
    hasMoreChildrenImpl() {
        return this._hasMoreChildren;
    }
    loadMoreChildrenImpl(clearCache) {
        return __awaiter(this, void 0, void 0, function* () {
            if (clearCache || this._cursor === undefined) {
                this._cursor = this.collection.find(this._query).batchSize(constants_1.defaultBatchSize);
                if (this._projection) {
                    this._cursor = this._cursor.project(this._projection);
                }
                this._batchSize = constants_1.defaultBatchSize;
            }
            const documents = [];
            let count = 0;
            while (count < this._batchSize) {
                this._hasMoreChildren = yield this._cursor.hasNext();
                if (this._hasMoreChildren) {
                    documents.push(yield this._cursor.next());
                    count += 1;
                }
                else {
                    break;
                }
            }
            this._batchSize *= 2;
            const docTreeItems = documents.map((document) => new MongoDocumentTreeItem_1.MongoDocumentTreeItem(this, document));
            return docTreeItems;
        });
    }
    createChildImpl(showCreatingTreeItem) {
        return __awaiter(this, void 0, void 0, function* () {
            showCreatingTreeItem("");
            const result = yield this.collection.insertOne({});
            const newDocument = yield this.collection.findOne({ _id: result.insertedId });
            return new MongoDocumentTreeItem_1.MongoDocumentTreeItem(this, newDocument);
        });
    }
    executeCommand(name, args) {
        const parameters = args ? args.map(parseJSContent) : undefined;
        const deferToShell = null; //The value executeCommand returns to instruct the caller function to run the same command in the Mongo shell.
        try {
            const functions = {
                drop: new FunctionDescriptor(this.drop, 'Dropping collection', 0, 0, 0),
                count: new FunctionDescriptor(this.count, 'Counting documents', 0, 2, 2),
                findOne: new FunctionDescriptor(this.findOne, 'Finding document', 0, 2, 2),
                insert: new FunctionDescriptor(this.insert, 'Inserting document', 1, 1, 1),
                insertMany: new FunctionDescriptor(this.insertMany, 'Inserting documents', 1, 2, 2),
                insertOne: new FunctionDescriptor(this.insertOne, 'Inserting document', 1, 2, 2),
                deleteMany: new FunctionDescriptor(this.deleteMany, 'Deleting documents', 1, 2, 1),
                deleteOne: new FunctionDescriptor(this.deleteOne, 'Deleting document', 1, 2, 1),
                remove: new FunctionDescriptor(this.remove, 'Deleting document(s)', 1, 2, 1)
            };
            if (functions.hasOwnProperty(name)) {
                let descriptor = functions[name];
                if (parameters.length < descriptor.minShellArgs) {
                    return Promise.reject(new Error(`Too few arguments passed to command ${name}.`));
                }
                if (parameters.length > descriptor.maxShellArgs) {
                    return Promise.reject(new Error(`Too many arguments passed to command ${name}`));
                }
                if (parameters.length > descriptor.maxHandledArgs) { //this function won't handle these arguments, but the shell will
                    return deferToShell;
                }
                return reportProgress(descriptor.mongoFunction.apply(this, parameters), descriptor.text);
            }
            return deferToShell;
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
    deleteTreeItemImpl() {
        return __awaiter(this, void 0, void 0, function* () {
            const message = `Are you sure you want to delete collection '${this.label}'?`;
            const result = yield vscode.window.showWarningMessage(message, { modal: true }, vscode_azureextensionui_1.DialogResponses.deleteResponse, vscode_azureextensionui_1.DialogResponses.cancel);
            if (result === vscode_azureextensionui_1.DialogResponses.deleteResponse) {
                yield this.drop();
            }
            else {
                throw new vscode_azureextensionui_1.UserCancelledError();
            }
        });
    }
    drop() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.collection.drop();
                return `Dropped collection '${this.collection.collectionName}'.`;
            }
            catch (e) {
                let error = e;
                const NamespaceNotFoundCode = 26;
                if (error.name === 'MongoError' && error.code === NamespaceNotFoundCode) {
                    return `Collection '${this.collection.collectionName}' could not be dropped because it does not exist.`;
                }
                else {
                    throw error;
                }
            }
        });
    }
    findOne(query, fieldsOption) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.collection.findOne(query || {}, { fields: fieldsOption });
            // findOne is the only command in this file whose output requires EJSON support.
            // Hence that's the only function which uses EJSON.stringify rather than this.stringify.
            return EJSON.stringify(result, null, '\t');
        });
    }
    insert(document) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!document) {
                throw new Error("The insert command requires at least one argument");
            }
            const insertResult = yield this.collection.insert(document);
            return this.stringify(insertResult);
        });
    }
    // tslint:disable-next-line:no-any
    insertOne(document, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const insertOneResult = yield this.collection.insertOne(document, { w: options && options.writeConcern });
            return this.stringify(insertOneResult);
        });
    }
    //tslint:disable:no-any
    insertMany(documents, options) {
        return __awaiter(this, void 0, void 0, function* () {
            assert.notEqual(documents.length, 0, "Array of documents cannot be empty");
            let insertManyOptions = {};
            if (options) {
                if (options.ordered) {
                    insertManyOptions["ordered"] = options.ordered;
                }
                if (options.writeConcern) {
                    insertManyOptions["w"] = options.writeConcern;
                }
            }
            const insertManyResult = yield this.collection.insertMany(documents, insertManyOptions);
            return this.stringify(insertManyResult);
        });
    }
    remove(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const removeResult = yield this.collection.remove(filter);
            return this.stringify(removeResult);
        });
    }
    deleteOne(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleteOneResult = yield this.collection.deleteOne(filter);
            return this.stringify(deleteOneResult);
        });
    }
    deleteMany(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleteOpResult = yield this.collection.deleteMany(filter);
            return this.stringify(deleteOpResult);
        });
    }
    count(query, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const count = yield this.collection.count(query, options);
            return this.stringify(count);
        });
    }
    // tslint:disable-next-line:no-any
    stringify(result) {
        return JSON.stringify(result, null, '\t');
    }
}
MongoCollectionTreeItem.contextValue = "MongoCollection";
exports.MongoCollectionTreeItem = MongoCollectionTreeItem;
function reportProgress(promise, title) {
    return vscode.window.withProgress({
        location: vscode.ProgressLocation.Window,
        title: title
    }, (_progress) => {
        return promise;
    });
}
// tslint:disable-next-line:no-any
function parseJSContent(content) {
    try {
        return EJSON.parse(content);
    }
    catch (error) {
        throw error.message;
    }
}
//# sourceMappingURL=MongoCollectionTreeItem.js.map