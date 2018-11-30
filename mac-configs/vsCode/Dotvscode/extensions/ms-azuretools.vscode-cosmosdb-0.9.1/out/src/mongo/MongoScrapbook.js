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
const ANTLRInputStream_1 = require("antlr4ts/ANTLRInputStream");
const CommonTokenStream_1 = require("antlr4ts/CommonTokenStream");
const ErrorNode_1 = require("antlr4ts/tree/ErrorNode");
const TerminalNode_1 = require("antlr4ts/tree/TerminalNode");
const bson_1 = require("bson");
const vscode = require("vscode");
const vscode_azureextensionui_1 = require("vscode-azureextensionui");
const extensionVariables_1 = require("../extensionVariables");
const array_1 = require("../utils/array");
const vscodeUtil = require("./../utils/vscodeUtils");
const MongoFindOneResultEditor_1 = require("./editors/MongoFindOneResultEditor");
const MongoFindResultEditor_1 = require("./editors/MongoFindResultEditor");
const errorListeners_1 = require("./errorListeners");
const mongoLexer_1 = require("./grammar/mongoLexer");
const mongoParser = require("./grammar/mongoParser");
const visitors_1 = require("./grammar/visitors");
const MongoDatabaseTreeItem_1 = require("./tree/MongoDatabaseTreeItem");
// tslint:disable:no-var-requires
const EJSON = require("mongodb-extended-json");
const notInScrapbookMessage = "You must have a MongoDB scrapbook (*.mongo) open to run a MongoDB command.";
function getAllErrorsFromTextDocument(document) {
    let commands = getAllCommandsFromTextDocument(document);
    let errors = [];
    for (let command of commands) {
        for (let error of (command.errors || [])) {
            let diagnostic = new vscode.Diagnostic(error.range, error.message);
            errors.push(diagnostic);
        }
    }
    return errors;
}
exports.getAllErrorsFromTextDocument = getAllErrorsFromTextDocument;
function executeAllCommandsFromActiveEditor(database, extensionPath, editorManager, context) {
    return __awaiter(this, void 0, void 0, function* () {
        extensionVariables_1.ext.outputChannel.appendLine("Running all commands in scrapbook...");
        let commands = getAllCommandsFromActiveEditor();
        yield executeCommands(vscode.window.activeTextEditor, database, extensionPath, editorManager, context, commands);
    });
}
exports.executeAllCommandsFromActiveEditor = executeAllCommandsFromActiveEditor;
function executeCommandFromActiveEditor(database, extensionPath, editorManager, context) {
    return __awaiter(this, void 0, void 0, function* () {
        const commands = getAllCommandsFromActiveEditor();
        const activeEditor = vscode.window.activeTextEditor;
        const selection = activeEditor.selection;
        const command = findCommandAtPosition(commands, selection.start);
        return yield executeCommand(activeEditor, database, extensionPath, editorManager, context, command);
    });
}
exports.executeCommandFromActiveEditor = executeCommandFromActiveEditor;
function executeCommandFromText(database, extensionPath, editorManager, context, commandText) {
    return __awaiter(this, void 0, void 0, function* () {
        const activeEditor = vscode.window.activeTextEditor;
        const command = getCommandFromTextAtLocation(commandText, new vscode.Position(0, 0));
        return yield executeCommand(activeEditor, database, extensionPath, editorManager, context, command);
    });
}
exports.executeCommandFromText = executeCommandFromText;
function getAllCommandsFromActiveEditor() {
    const activeEditor = vscode.window.activeTextEditor;
    if (activeEditor) {
        const commands = getAllCommandsFromTextDocument(activeEditor.document);
        return commands;
    }
    else {
        // Shouldn't be able to reach this
        throw new Error(notInScrapbookMessage);
    }
}
function getAllCommandsFromTextDocument(document) {
    return getAllCommandsFromText(document.getText());
}
exports.getAllCommandsFromTextDocument = getAllCommandsFromTextDocument;
function executeCommands(activeEditor, database, extensionPath, editorManager, context, commands) {
    return __awaiter(this, void 0, void 0, function* () {
        for (let command of commands) {
            try {
                yield executeCommand(activeEditor, database, extensionPath, editorManager, context, command);
            }
            catch (e) {
                const err = vscode_azureextensionui_1.parseError(e);
                if (err.isUserCancelledError) {
                    throw e;
                }
                else {
                    let message = `${command.text.split('(')[0]} at ${command.range.start.line + 1}:${command.range.start.character + 1}: ${err.message}`;
                    throw new Error(message);
                }
            }
        }
    });
}
function executeCommand(activeEditor, database, extensionPath, editorManager, context, command) {
    return __awaiter(this, void 0, void 0, function* () {
        if (command) {
            extensionVariables_1.ext.outputChannel.appendLine(command.text);
            try {
                context.properties["command"] = command.name;
                context.properties["argsCount"] = String(command.arguments ? command.arguments.length : 0);
            }
            catch (error) {
                // Ignore
            }
            if (!database) {
                throw new Error('Please select a MongoDB database to run against by selecting it in the explorer and selecting the "Connect" context menu item');
            }
            if (command.errors && command.errors.length > 0) {
                //Currently, we take the first error pushed. Tests correlate that the parser visits errors in left-to-right, top-to-bottom.
                const err = command.errors[0];
                throw new Error(`Error near line ${err.range.start.line}, column ${err.range.start.character}: '${err.message}'. Please check syntax.`);
            }
            if (command.name === 'find') {
                yield editorManager.showDocument(new MongoFindResultEditor_1.MongoFindResultEditor(database, command), 'cosmos-result.json', { showInNextColumn: true });
            }
            else {
                const result = yield database.executeCommand(command, context);
                if (command.name === 'findOne') {
                    if (result === "null") {
                        throw new Error(`Could not find any documents`);
                    }
                    yield editorManager.showDocument(new MongoFindOneResultEditor_1.MongoFindOneResultEditor(database, command.collection, result), 'cosmos-result.json', { showInNextColumn: true });
                }
                else {
                    yield vscodeUtil.showNewFile(result, extensionPath, 'result', '.json', activeEditor.viewColumn + 1);
                    yield refreshTreeAfterCommand(database, command);
                }
            }
        }
        else {
            throw new Error('No MongoDB command found at the current cursor location.');
        }
    });
}
function refreshTreeAfterCommand(database, command) {
    return __awaiter(this, void 0, void 0, function* () {
        if (command.name === 'drop') {
            database.refresh();
        }
        else if (command.collection && /^(insert|update|delete|replace|remove|write|bulkWrite)/i.test(command.name)) {
            const collectionNode = yield extensionVariables_1.ext.tree.findTreeItem(database.fullId + "/" + command.collection);
            if (collectionNode) {
                collectionNode.refresh();
            }
        }
    });
}
function getCommandFromTextAtLocation(content, position) {
    let commands = getAllCommandsFromText(content);
    return findCommandAtPosition(commands, position);
}
exports.getCommandFromTextAtLocation = getCommandFromTextAtLocation;
function getAllCommandsFromText(content) {
    const lexer = new mongoLexer_1.mongoLexer(new ANTLRInputStream_1.ANTLRInputStream(content));
    let lexerListener = new errorListeners_1.LexerErrorListener();
    lexer.removeErrorListeners(); // Default listener outputs to the console
    lexer.addErrorListener(lexerListener);
    let tokens = new CommonTokenStream_1.CommonTokenStream(lexer);
    const parser = new mongoParser.mongoParser(tokens);
    let parserListener = new errorListeners_1.ParserErrorListener();
    parser.removeErrorListeners(); // Default listener outputs to the console
    parser.addErrorListener(parserListener);
    let commandsContext = parser.mongoCommands();
    const commands = new FindMongoCommandsVisitor().visit(commandsContext);
    // Match errors with commands based on location
    let errors = lexerListener.errors.concat(parserListener.errors);
    errors.sort((a, b) => {
        let linediff = a.range.start.line - b.range.start.line;
        let chardiff = a.range.start.character - b.range.start.character;
        return linediff || chardiff;
    });
    for (let err of errors) {
        let associatedCommand = findCommandAtPosition(commands, err.range.start);
        if (associatedCommand) {
            associatedCommand.errors = associatedCommand.errors || [];
            associatedCommand.errors.push(err);
        }
        else {
            // Create a new command to hook this up to
            let emptyCommand = {
                collection: undefined,
                name: undefined,
                range: err.range,
                text: ""
            };
            emptyCommand.errors = [err];
            commands.push(emptyCommand);
        }
    }
    return commands;
}
exports.getAllCommandsFromText = getAllCommandsFromText;
function findCommandAtPosition(commands, position) {
    let lastCommandOnSameLine = null;
    let lastCommandBeforePosition = null;
    if (position) {
        for (const command of commands) {
            if (command.range.contains(position)) {
                return command;
            }
            if (command.range.end.line === position.line) {
                lastCommandOnSameLine = command;
            }
            if (command.range.end.isBefore(position)) {
                lastCommandBeforePosition = command;
            }
        }
    }
    return lastCommandOnSameLine || lastCommandBeforePosition || commands[commands.length - 1];
}
class FindMongoCommandsVisitor extends visitors_1.MongoVisitor {
    constructor() {
        super(...arguments);
        this.commands = [];
    }
    visitCommand(ctx) {
        let funcCallCount = array_1.filterType(ctx.children, mongoParser.FunctionCallContext).length;
        this.commands.push({
            range: new vscode.Range(ctx.start.line - 1, ctx.start.charPositionInLine, ctx.stop.line - 1, ctx.stop.charPositionInLine),
            text: ctx.text,
            name: '',
            arguments: [],
            argumentObjects: [],
            chained: funcCallCount > 1 ? true : false
        });
        return super.visitCommand(ctx);
    }
    visitCollection(ctx) {
        this.commands[this.commands.length - 1].collection = ctx.text;
        return super.visitCollection(ctx);
    }
    visitFunctionCall(ctx) {
        if (ctx.parent instanceof mongoParser.CommandContext) {
            this.commands[this.commands.length - 1].name = (ctx._FUNCTION_NAME && ctx._FUNCTION_NAME.text) || "";
        }
        return super.visitFunctionCall(ctx);
    }
    visitArgument(ctx) {
        try {
            let argumentsContext = ctx.parent;
            if (argumentsContext) {
                let functionCallContext = argumentsContext.parent;
                if (functionCallContext && functionCallContext.parent instanceof mongoParser.CommandContext) {
                    const lastCommand = this.commands[this.commands.length - 1];
                    const argAsObject = this.contextToObject(ctx);
                    const argText = EJSON.stringify(argAsObject);
                    lastCommand.arguments.push(argText);
                    let escapeHandled = this.deduplicateEscapesForRegex(argText);
                    let ejsonParsed = {};
                    try {
                        ejsonParsed = EJSON.parse(escapeHandled);
                    }
                    catch (err) { //EJSON parse failed due to a wrong flag, etc.
                        this.addErrorToCommand(vscode_azureextensionui_1.parseError(err), ctx);
                    }
                    lastCommand.argumentObjects.push(ejsonParsed);
                }
            }
        }
        catch (error) {
            this.addErrorToCommand(vscode_azureextensionui_1.parseError(error), ctx);
        }
        return super.visitArgument(ctx);
    }
    defaultResult(_node) {
        return this.commands;
    }
    contextToObject(ctx) {
        if (!ctx || ctx.childCount === 0) { //Base case and malformed statements
            return {};
        }
        // In a well formed expression, Argument and propertyValue tokens should have exactly one child, from their definitions in mongo.g4
        let child = ctx.children[0];
        if (child instanceof mongoParser.LiteralContext) {
            return this.literalContextToObject(child, ctx);
        }
        else if (child instanceof mongoParser.ObjectLiteralContext) {
            return this.objectLiteralContextToObject(child);
        }
        else if (child instanceof mongoParser.ArrayLiteralContext) {
            return this.arrayLiteralContextToObject(child);
        }
        else if (child instanceof mongoParser.FunctionCallContext) {
            return this.functionCallContextToObject(child, ctx);
        }
        else if (child instanceof ErrorNode_1.ErrorNode) {
            return {};
        }
        else {
            let err = vscode_azureextensionui_1.parseError(`Unrecognized node type encountered. We could not parse ${child.text}`);
            this.addErrorToCommand(err, ctx);
            return {};
        }
    }
    literalContextToObject(child, ctx) {
        let text = child.text;
        let tokenType = child.start.type;
        const nonStringLiterals = [mongoParser.mongoParser.NullLiteral, mongoParser.mongoParser.BooleanLiteral, mongoParser.mongoParser.NumericLiteral];
        if (tokenType === mongoParser.mongoParser.StringLiteral) {
            return MongoDatabaseTreeItem_1.stripQuotes(text);
        }
        else if (tokenType === mongoParser.mongoParser.RegexLiteral) {
            return this.regexLiteralContextToObject(ctx, text);
        }
        else if (nonStringLiterals.indexOf(tokenType) > -1) {
            return JSON.parse(text);
        }
        else {
            let err = vscode_azureextensionui_1.parseError(`Unrecognized token. Token text: ${text}`);
            this.addErrorToCommand(err, ctx);
            return {};
        }
    }
    objectLiteralContextToObject(child) {
        let propertyNameAndValue = array_1.findType(child.children, mongoParser.PropertyNameAndValueListContext);
        if (!propertyNameAndValue) { // Argument is {}
            return {};
        }
        else {
            let parsedObject = {};
            //tslint:disable:no-non-null-assertion
            let propertyAssignments = array_1.filterType(propertyNameAndValue.children, mongoParser.PropertyAssignmentContext);
            for (let propertyAssignment of propertyAssignments) {
                const propertyName = propertyAssignment.children[0];
                const propertyValue = propertyAssignment.children[2];
                parsedObject[MongoDatabaseTreeItem_1.stripQuotes(propertyName.text)] = this.contextToObject(propertyValue);
            }
            return parsedObject;
        }
    }
    arrayLiteralContextToObject(child) {
        let elementList = array_1.findType(child.children, mongoParser.ElementListContext);
        if (elementList) {
            let elementItems = array_1.filterType(elementList.children, mongoParser.PropertyValueContext);
            return elementItems.map(this.contextToObject.bind(this));
        }
        else {
            return [];
        }
    }
    functionCallContextToObject(child, ctx) {
        let functionTokens = child.children;
        let constructorCall = array_1.findType(functionTokens, TerminalNode_1.TerminalNode);
        let argumentsToken = array_1.findType(functionTokens, mongoParser.ArgumentsContext);
        if (!(argumentsToken._CLOSED_PARENTHESIS && argumentsToken._OPEN_PARENTHESIS)) { //argumentsToken does not have '(' or ')'
            let err = vscode_azureextensionui_1.parseError(`Expecting parentheses or quotes at '${constructorCall.text}'`);
            this.addErrorToCommand(err, ctx);
            return {};
        }
        let argumentContextArray = array_1.filterType(argumentsToken.children, mongoParser.ArgumentContext);
        let functionMap = { "ObjectId": this.objectIdToObject, "ISODate": this.dateToObject, "Date": this.dateToObject };
        if (argumentContextArray.length > 1) {
            let err = vscode_azureextensionui_1.parseError(`Too many arguments. Expecting 0 or 1 argument(s) to ${constructorCall}`);
            this.addErrorToCommand(err, ctx);
            return {};
        }
        if (constructorCall.text in functionMap) {
            let args = [ctx, argumentContextArray.length ? argumentContextArray[0].text : undefined];
            return functionMap[constructorCall.text].apply(this, args);
        }
        let unrecognizedNodeErr = vscode_azureextensionui_1.parseError(`Unrecognized node type encountered. Could not parse ${constructorCall.text} as part of ${child.text}`);
        this.addErrorToCommand(unrecognizedNodeErr, ctx);
        return {};
    }
    dateToObject(ctx, tokenText) {
        let constructedObject;
        if (!tokenText) { // usage : ObjectID()
            constructedObject = new Date();
        }
        else {
            try {
                constructedObject = new Date(MongoDatabaseTreeItem_1.stripQuotes(tokenText));
            }
            catch (error) {
                let err = vscode_azureextensionui_1.parseError(error);
                this.addErrorToCommand(err, ctx);
                return {};
            }
        }
        return { $date: constructedObject.toString() };
    }
    objectIdToObject(ctx, tokenText) {
        let hexID;
        let constructedObject;
        if (!tokenText) { // usage : ObjectID()
            constructedObject = new bson_1.ObjectID();
        }
        else {
            hexID = MongoDatabaseTreeItem_1.stripQuotes(tokenText);
            try {
                constructedObject = new bson_1.ObjectID(hexID);
            }
            catch (error) {
                let err = vscode_azureextensionui_1.parseError(error);
                this.addErrorToCommand(err, ctx);
                return {};
            }
        }
        return { $oid: constructedObject.toString() };
    }
    regexLiteralContextToObject(ctx, text) {
        let separator = text.lastIndexOf('/');
        let flags = separator !== text.length - 1 ? text.substring(separator + 1) : "";
        let pattern = text.substring(1, separator);
        try {
            // validate the pattern and flags.
            // It is intended for the errors thrown here to be handled by the catch block.
            let tokenObject = new RegExp(pattern, flags);
            tokenObject = tokenObject;
            // we are passing back a $regex annotation, hence we ensure parity wit the $regex syntax
            return { $regex: this.regexToStringNotation(pattern), $options: flags };
        }
        catch (error) { //User may not have finished typing
            let err = vscode_azureextensionui_1.parseError(error);
            this.addErrorToCommand(err, ctx);
            return {};
        }
    }
    addErrorToCommand(error, ctx) {
        let command = this.commands[this.commands.length - 1];
        command.errors = command.errors || [];
        let currentErrorDesc = { message: error.message, range: new vscode.Range(ctx.start.line - 1, ctx.start.charPositionInLine, ctx.stop.line - 1, ctx.stop.charPositionInLine) };
        command.errors.push(currentErrorDesc);
    }
    regexToStringNotation(pattern) {
        // The equivalence:
        // /ker\b/ <=> $regex: "ker\\b", /ker\\b/ <=> "ker\\\\b"
        return pattern.replace(/\\([0-9a-z.*])/i, '\\\\$1');
    }
    deduplicateEscapesForRegex(argAsString) {
        let removeDuplicatedBackslash = /\\{4}([0-9a-z.*])/gi;
        /*
        We remove duplicate backslashes due the behavior of '\b' - \b in a regex denotes word boundary, while \b in a string denotes backspace.
        $regex syntax uses a string. Strings require slashes to be escaped, while /regex/ does not. Eg. /abc+\b/ is equivalent to {$regex: "abc+\\b"}.
        {$regex: "abc+\b"} with an unescaped slash gets parsed as  {$regex: <EOF>}. The user can only type '\\b' (which is encoded as '\\\\b').
        We need to convert this appropriately. Other special characters (\n, \t, \r) don't carry significance in regexes - we don't handle those
        What the regex does: '\\{4}' looks for the escaped slash 4 times. Lookahead checks if the character being escaped has a special meaning.
        */
        let escapeHandled = argAsString.replace(removeDuplicatedBackslash, `\\\\$1`);
        return escapeHandled;
    }
}
//# sourceMappingURL=MongoScrapbook.js.map