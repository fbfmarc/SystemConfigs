"use strict";
// Generated from ./grammar/mongo.g4 by ANTLR 4.6-SNAPSHOT
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
/*tslint:disable */
const ATN_1 = require("antlr4ts/atn/ATN");
const ATNDeserializer_1 = require("antlr4ts/atn/ATNDeserializer");
const ParserATNSimulator_1 = require("antlr4ts/atn/ParserATNSimulator");
const Decorators_1 = require("antlr4ts/Decorators");
const Utils = require("antlr4ts/misc/Utils");
const NoViableAltException_1 = require("antlr4ts/NoViableAltException");
const Parser_1 = require("antlr4ts/Parser");
const ParserRuleContext_1 = require("antlr4ts/ParserRuleContext");
const RecognitionException_1 = require("antlr4ts/RecognitionException");
const RuleVersion_1 = require("antlr4ts/RuleVersion");
const Token_1 = require("antlr4ts/Token");
const VocabularyImpl_1 = require("antlr4ts/VocabularyImpl");
class mongoParser extends Parser_1.Parser {
    constructor(input) {
        super(input);
        this._interp = new ParserATNSimulator_1.ParserATNSimulator(mongoParser._ATN, this);
    }
    get vocabulary() {
        return mongoParser.VOCABULARY;
    }
    get grammarFileName() { return "mongo.g4"; }
    get ruleNames() { return mongoParser.ruleNames; }
    get serializedATN() { return mongoParser._serializedATN; }
    mongoCommands() {
        let _localctx = new MongoCommandsContext(this._ctx, this.state);
        this.enterRule(_localctx, 0, mongoParser.RULE_mongoCommands);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 34;
                this.commands();
                this.state = 35;
                this.match(mongoParser.EOF);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    commands() {
        let _localctx = new CommandsContext(this._ctx, this.state);
        this.enterRule(_localctx, 2, mongoParser.RULE_commands);
        let _la;
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 42;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                while ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << mongoParser.SingleLineComment) | (1 << mongoParser.MultiLineComment) | (1 << mongoParser.SEMICOLON) | (1 << mongoParser.DB))) !== 0)) {
                    {
                        this.state = 40;
                        this._errHandler.sync(this);
                        switch (this._input.LA(1)) {
                            case mongoParser.DB:
                                {
                                    this.state = 37;
                                    this.command();
                                }
                                break;
                            case mongoParser.SEMICOLON:
                                {
                                    this.state = 38;
                                    this.emptyCommand();
                                }
                                break;
                            case mongoParser.SingleLineComment:
                            case mongoParser.MultiLineComment:
                                {
                                    this.state = 39;
                                    this.comment();
                                }
                                break;
                            default:
                                throw new NoViableAltException_1.NoViableAltException(this);
                        }
                    }
                    this.state = 44;
                    this._errHandler.sync(this);
                    _la = this._input.LA(1);
                }
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    command() {
        let _localctx = new CommandContext(this._ctx, this.state);
        this.enterRule(_localctx, 4, mongoParser.RULE_command);
        let _la;
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 45;
                this.match(mongoParser.DB);
                this.state = 48;
                this._errHandler.sync(this);
                switch (this.interpreter.adaptivePredict(this._input, 2, this._ctx)) {
                    case 1:
                        {
                            this.state = 46;
                            this.match(mongoParser.DOT);
                            this.state = 47;
                            this.collection();
                        }
                        break;
                }
                this.state = 52;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                do {
                    {
                        {
                            this.state = 50;
                            this.match(mongoParser.DOT);
                            this.state = 51;
                            this.functionCall();
                        }
                    }
                    this.state = 54;
                    this._errHandler.sync(this);
                    _la = this._input.LA(1);
                } while (_la === mongoParser.DOT);
                this.state = 57;
                this._errHandler.sync(this);
                switch (this.interpreter.adaptivePredict(this._input, 4, this._ctx)) {
                    case 1:
                        {
                            this.state = 56;
                            this.match(mongoParser.SEMICOLON);
                        }
                        break;
                }
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    emptyCommand() {
        let _localctx = new EmptyCommandContext(this._ctx, this.state);
        this.enterRule(_localctx, 6, mongoParser.RULE_emptyCommand);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 59;
                this.match(mongoParser.SEMICOLON);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    collection() {
        let _localctx = new CollectionContext(this._ctx, this.state);
        this.enterRule(_localctx, 8, mongoParser.RULE_collection);
        try {
            let _alt;
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 61;
                this.match(mongoParser.IDENTIFIER);
                this.state = 66;
                this._errHandler.sync(this);
                _alt = this.interpreter.adaptivePredict(this._input, 5, this._ctx);
                while (_alt !== 2 && _alt !== ATN_1.ATN.INVALID_ALT_NUMBER) {
                    if (_alt === 1) {
                        {
                            {
                                this.state = 62;
                                this.match(mongoParser.DOT);
                                this.state = 63;
                                this.match(mongoParser.IDENTIFIER);
                            }
                        }
                    }
                    this.state = 68;
                    this._errHandler.sync(this);
                    _alt = this.interpreter.adaptivePredict(this._input, 5, this._ctx);
                }
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    functionCall() {
        let _localctx = new FunctionCallContext(this._ctx, this.state);
        this.enterRule(_localctx, 10, mongoParser.RULE_functionCall);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 69;
                _localctx._FUNCTION_NAME = this.match(mongoParser.IDENTIFIER);
                this.state = 70;
                this.arguments();
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    arguments() {
        let _localctx = new ArgumentsContext(this._ctx, this.state);
        this.enterRule(_localctx, 12, mongoParser.RULE_arguments);
        let _la;
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 72;
                _localctx._OPEN_PARENTHESIS = this.match(mongoParser.T__0);
                this.state = 81;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << mongoParser.T__3) | (1 << mongoParser.T__5) | (1 << mongoParser.RegexLiteral) | (1 << mongoParser.StringLiteral) | (1 << mongoParser.NullLiteral) | (1 << mongoParser.BooleanLiteral) | (1 << mongoParser.NumericLiteral))) !== 0)) {
                    {
                        this.state = 73;
                        this.argument();
                        this.state = 78;
                        this._errHandler.sync(this);
                        _la = this._input.LA(1);
                        while (_la === mongoParser.T__1) {
                            {
                                {
                                    this.state = 74;
                                    this.match(mongoParser.T__1);
                                    this.state = 75;
                                    this.argument();
                                }
                            }
                            this.state = 80;
                            this._errHandler.sync(this);
                            _la = this._input.LA(1);
                        }
                    }
                }
                this.state = 83;
                _localctx._CLOSED_PARENTHESIS = this.match(mongoParser.T__2);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    argument() {
        let _localctx = new ArgumentContext(this._ctx, this.state);
        this.enterRule(_localctx, 14, mongoParser.RULE_argument);
        try {
            this.state = 88;
            this._errHandler.sync(this);
            switch (this._input.LA(1)) {
                case mongoParser.RegexLiteral:
                case mongoParser.StringLiteral:
                case mongoParser.NullLiteral:
                case mongoParser.BooleanLiteral:
                case mongoParser.NumericLiteral:
                    this.enterOuterAlt(_localctx, 1);
                    {
                        this.state = 85;
                        this.literal();
                    }
                    break;
                case mongoParser.T__3:
                    this.enterOuterAlt(_localctx, 2);
                    {
                        this.state = 86;
                        this.objectLiteral();
                    }
                    break;
                case mongoParser.T__5:
                    this.enterOuterAlt(_localctx, 3);
                    {
                        this.state = 87;
                        this.arrayLiteral();
                    }
                    break;
                default:
                    throw new NoViableAltException_1.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    objectLiteral() {
        let _localctx = new ObjectLiteralContext(this._ctx, this.state);
        this.enterRule(_localctx, 16, mongoParser.RULE_objectLiteral);
        let _la;
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 90;
                this.match(mongoParser.T__3);
                this.state = 92;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                if (_la === mongoParser.StringLiteral || _la === mongoParser.IDENTIFIER) {
                    {
                        this.state = 91;
                        this.propertyNameAndValueList();
                    }
                }
                this.state = 95;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                if (_la === mongoParser.T__1) {
                    {
                        this.state = 94;
                        this.match(mongoParser.T__1);
                    }
                }
                this.state = 97;
                this.match(mongoParser.T__4);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    arrayLiteral() {
        let _localctx = new ArrayLiteralContext(this._ctx, this.state);
        this.enterRule(_localctx, 18, mongoParser.RULE_arrayLiteral);
        let _la;
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 99;
                this.match(mongoParser.T__5);
                this.state = 101;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << mongoParser.T__3) | (1 << mongoParser.T__5) | (1 << mongoParser.RegexLiteral) | (1 << mongoParser.StringLiteral) | (1 << mongoParser.NullLiteral) | (1 << mongoParser.BooleanLiteral) | (1 << mongoParser.NumericLiteral) | (1 << mongoParser.IDENTIFIER))) !== 0)) {
                    {
                        this.state = 100;
                        this.elementList();
                    }
                }
                this.state = 103;
                this.match(mongoParser.T__6);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    elementList() {
        let _localctx = new ElementListContext(this._ctx, this.state);
        this.enterRule(_localctx, 20, mongoParser.RULE_elementList);
        let _la;
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 105;
                this.propertyValue();
                this.state = 110;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                while (_la === mongoParser.T__1) {
                    {
                        {
                            this.state = 106;
                            this.match(mongoParser.T__1);
                            this.state = 107;
                            this.propertyValue();
                        }
                    }
                    this.state = 112;
                    this._errHandler.sync(this);
                    _la = this._input.LA(1);
                }
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    propertyNameAndValueList() {
        let _localctx = new PropertyNameAndValueListContext(this._ctx, this.state);
        this.enterRule(_localctx, 22, mongoParser.RULE_propertyNameAndValueList);
        try {
            let _alt;
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 113;
                this.propertyAssignment();
                this.state = 118;
                this._errHandler.sync(this);
                _alt = this.interpreter.adaptivePredict(this._input, 13, this._ctx);
                while (_alt !== 2 && _alt !== ATN_1.ATN.INVALID_ALT_NUMBER) {
                    if (_alt === 1) {
                        {
                            {
                                this.state = 114;
                                this.match(mongoParser.T__1);
                                this.state = 115;
                                this.propertyAssignment();
                            }
                        }
                    }
                    this.state = 120;
                    this._errHandler.sync(this);
                    _alt = this.interpreter.adaptivePredict(this._input, 13, this._ctx);
                }
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    propertyAssignment() {
        let _localctx = new PropertyAssignmentContext(this._ctx, this.state);
        this.enterRule(_localctx, 24, mongoParser.RULE_propertyAssignment);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 121;
                this.propertyName();
                this.state = 122;
                this.match(mongoParser.T__7);
                this.state = 123;
                this.propertyValue();
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    propertyValue() {
        let _localctx = new PropertyValueContext(this._ctx, this.state);
        this.enterRule(_localctx, 26, mongoParser.RULE_propertyValue);
        try {
            this.state = 129;
            this._errHandler.sync(this);
            switch (this._input.LA(1)) {
                case mongoParser.RegexLiteral:
                case mongoParser.StringLiteral:
                case mongoParser.NullLiteral:
                case mongoParser.BooleanLiteral:
                case mongoParser.NumericLiteral:
                    this.enterOuterAlt(_localctx, 1);
                    {
                        this.state = 125;
                        this.literal();
                    }
                    break;
                case mongoParser.T__3:
                    this.enterOuterAlt(_localctx, 2);
                    {
                        this.state = 126;
                        this.objectLiteral();
                    }
                    break;
                case mongoParser.T__5:
                    this.enterOuterAlt(_localctx, 3);
                    {
                        this.state = 127;
                        this.arrayLiteral();
                    }
                    break;
                case mongoParser.IDENTIFIER:
                    this.enterOuterAlt(_localctx, 4);
                    {
                        this.state = 128;
                        this.functionCall();
                    }
                    break;
                default:
                    throw new NoViableAltException_1.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    literal() {
        let _localctx = new LiteralContext(this._ctx, this.state);
        this.enterRule(_localctx, 28, mongoParser.RULE_literal);
        let _la;
        try {
            this.state = 134;
            this._errHandler.sync(this);
            switch (this._input.LA(1)) {
                case mongoParser.StringLiteral:
                case mongoParser.NullLiteral:
                case mongoParser.BooleanLiteral:
                    this.enterOuterAlt(_localctx, 1);
                    {
                        this.state = 131;
                        _la = this._input.LA(1);
                        if (!((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << mongoParser.StringLiteral) | (1 << mongoParser.NullLiteral) | (1 << mongoParser.BooleanLiteral))) !== 0))) {
                            this._errHandler.recoverInline(this);
                        }
                        else {
                            if (this._input.LA(1) === Token_1.Token.EOF) {
                                this.matchedEOF = true;
                            }
                            this._errHandler.reportMatch(this);
                            this.consume();
                        }
                    }
                    break;
                case mongoParser.RegexLiteral:
                    this.enterOuterAlt(_localctx, 2);
                    {
                        this.state = 132;
                        this.match(mongoParser.RegexLiteral);
                    }
                    break;
                case mongoParser.NumericLiteral:
                    this.enterOuterAlt(_localctx, 3);
                    {
                        this.state = 133;
                        this.match(mongoParser.NumericLiteral);
                    }
                    break;
                default:
                    throw new NoViableAltException_1.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    propertyName() {
        let _localctx = new PropertyNameContext(this._ctx, this.state);
        this.enterRule(_localctx, 30, mongoParser.RULE_propertyName);
        let _la;
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 136;
                _la = this._input.LA(1);
                if (!(_la === mongoParser.StringLiteral || _la === mongoParser.IDENTIFIER)) {
                    this._errHandler.recoverInline(this);
                }
                else {
                    if (this._input.LA(1) === Token_1.Token.EOF) {
                        this.matchedEOF = true;
                    }
                    this._errHandler.reportMatch(this);
                    this.consume();
                }
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    comment() {
        let _localctx = new CommentContext(this._ctx, this.state);
        this.enterRule(_localctx, 32, mongoParser.RULE_comment);
        let _la;
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 138;
                _la = this._input.LA(1);
                if (!(_la === mongoParser.SingleLineComment || _la === mongoParser.MultiLineComment)) {
                    this._errHandler.recoverInline(this);
                }
                else {
                    if (this._input.LA(1) === Token_1.Token.EOF) {
                        this.matchedEOF = true;
                    }
                    this._errHandler.reportMatch(this);
                    this.consume();
                }
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    static get _ATN() {
        if (!mongoParser.__ATN) {
            mongoParser.__ATN = new ATNDeserializer_1.ATNDeserializer().deserialize(Utils.toCharArray(mongoParser._serializedATN));
        }
        return mongoParser.__ATN;
    }
}
mongoParser.T__0 = 1;
mongoParser.T__1 = 2;
mongoParser.T__2 = 3;
mongoParser.T__3 = 4;
mongoParser.T__4 = 5;
mongoParser.T__5 = 6;
mongoParser.T__6 = 7;
mongoParser.T__7 = 8;
mongoParser.RegexLiteral = 9;
mongoParser.SingleLineComment = 10;
mongoParser.MultiLineComment = 11;
mongoParser.StringLiteral = 12;
mongoParser.NullLiteral = 13;
mongoParser.BooleanLiteral = 14;
mongoParser.NumericLiteral = 15;
mongoParser.DecimalLiteral = 16;
mongoParser.LineTerminator = 17;
mongoParser.SEMICOLON = 18;
mongoParser.DOT = 19;
mongoParser.DB = 20;
mongoParser.IDENTIFIER = 21;
mongoParser.DOUBLE_QUOTED_STRING_LITERAL = 22;
mongoParser.SINGLE_QUOTED_STRING_LITERAL = 23;
mongoParser.WHITESPACE = 24;
mongoParser.RULE_mongoCommands = 0;
mongoParser.RULE_commands = 1;
mongoParser.RULE_command = 2;
mongoParser.RULE_emptyCommand = 3;
mongoParser.RULE_collection = 4;
mongoParser.RULE_functionCall = 5;
mongoParser.RULE_arguments = 6;
mongoParser.RULE_argument = 7;
mongoParser.RULE_objectLiteral = 8;
mongoParser.RULE_arrayLiteral = 9;
mongoParser.RULE_elementList = 10;
mongoParser.RULE_propertyNameAndValueList = 11;
mongoParser.RULE_propertyAssignment = 12;
mongoParser.RULE_propertyValue = 13;
mongoParser.RULE_literal = 14;
mongoParser.RULE_propertyName = 15;
mongoParser.RULE_comment = 16;
mongoParser.ruleNames = [
    "mongoCommands", "commands", "command", "emptyCommand", "collection",
    "functionCall", "arguments", "argument", "objectLiteral", "arrayLiteral",
    "elementList", "propertyNameAndValueList", "propertyAssignment", "propertyValue",
    "literal", "propertyName", "comment"
];
mongoParser._LITERAL_NAMES = [
    undefined, "'('", "','", "')'", "'{'", "'}'", "'['", "']'", "':'", undefined,
    undefined, undefined, undefined, "'null'", undefined, undefined, undefined,
    undefined, "';'", "'.'", "'db'"
];
mongoParser._SYMBOLIC_NAMES = [
    undefined, undefined, undefined, undefined, undefined, undefined, undefined,
    undefined, undefined, "RegexLiteral", "SingleLineComment", "MultiLineComment",
    "StringLiteral", "NullLiteral", "BooleanLiteral", "NumericLiteral", "DecimalLiteral",
    "LineTerminator", "SEMICOLON", "DOT", "DB", "IDENTIFIER", "DOUBLE_QUOTED_STRING_LITERAL",
    "SINGLE_QUOTED_STRING_LITERAL", "WHITESPACE"
];
mongoParser.VOCABULARY = new VocabularyImpl_1.VocabularyImpl(mongoParser._LITERAL_NAMES, mongoParser._SYMBOLIC_NAMES, []);
mongoParser._serializedATN = "\x03\uAF6F\u8320\u479D\uB75C\u4880\u1605\u191C\uAB37\x03\x1A\x8F\x04\x02" +
    "\t\x02\x04\x03\t\x03\x04\x04\t\x04\x04\x05\t\x05\x04\x06\t\x06\x04\x07" +
    "\t\x07\x04\b\t\b\x04\t\t\t\x04\n\t\n\x04\v\t\v\x04\f\t\f\x04\r\t\r\x04" +
    "\x0E\t\x0E\x04\x0F\t\x0F\x04\x10\t\x10\x04\x11\t\x11\x04\x12\t\x12\x03" +
    "\x02\x03\x02\x03\x02\x03\x03\x03\x03\x03\x03\x07\x03+\n\x03\f\x03\x0E" +
    "\x03.\v\x03\x03\x04\x03\x04\x03\x04\x05\x043\n\x04\x03\x04\x03\x04\x06" +
    "\x047\n\x04\r\x04\x0E\x048\x03\x04\x05\x04<\n\x04\x03\x05\x03\x05\x03" +
    "\x06\x03\x06\x03\x06\x07\x06C\n\x06\f\x06\x0E\x06F\v\x06\x03\x07\x03\x07" +
    "\x03\x07\x03\b\x03\b\x03\b\x03\b\x07\bO\n\b\f\b\x0E\bR\v\b\x05\bT\n\b" +
    "\x03\b\x03\b\x03\t\x03\t\x03\t\x05\t[\n\t\x03\n\x03\n\x05\n_\n\n\x03\n" +
    "\x05\nb\n\n\x03\n\x03\n\x03\v\x03\v\x05\vh\n\v\x03\v\x03\v\x03\f\x03\f" +
    "\x03\f\x07\fo\n\f\f\f\x0E\fr\v\f\x03\r\x03\r\x03\r\x07\rw\n\r\f\r\x0E" +
    "\rz\v\r\x03\x0E\x03\x0E\x03\x0E\x03\x0E\x03\x0F\x03\x0F\x03\x0F\x03\x0F" +
    "\x05\x0F\x84\n\x0F\x03\x10\x03\x10\x03\x10\x05\x10\x89\n\x10\x03\x11\x03" +
    "\x11\x03\x12\x03\x12\x03\x12\x02\x02\x02\x13\x02\x02\x04\x02\x06\x02\b" +
    "\x02\n\x02\f\x02\x0E\x02\x10\x02\x12\x02\x14\x02\x16\x02\x18\x02\x1A\x02" +
    "\x1C\x02\x1E\x02 \x02\"\x02\x02\x05\x03\x02\x0E\x10\x04\x02\x0E\x0E\x17" +
    "\x17\x03\x02\f\r\x92\x02$\x03\x02\x02\x02\x04,\x03\x02\x02\x02\x06/\x03" +
    "\x02\x02\x02\b=\x03\x02\x02\x02\n?\x03\x02\x02\x02\fG\x03\x02\x02\x02" +
    "\x0EJ\x03\x02\x02\x02\x10Z\x03\x02\x02\x02\x12\\\x03\x02\x02\x02\x14e" +
    "\x03\x02\x02\x02\x16k\x03\x02\x02\x02\x18s\x03\x02\x02\x02\x1A{\x03\x02" +
    "\x02\x02\x1C\x83\x03\x02\x02\x02\x1E\x88\x03\x02\x02\x02 \x8A\x03\x02" +
    "\x02\x02\"\x8C\x03\x02\x02\x02$%\x05\x04\x03\x02%&\x07\x02\x02\x03&\x03" +
    "\x03\x02\x02\x02\'+\x05\x06\x04\x02(+\x05\b\x05\x02)+\x05\"\x12\x02*\'" +
    "\x03\x02\x02\x02*(\x03\x02\x02\x02*)\x03\x02\x02\x02+.\x03\x02\x02\x02" +
    ",*\x03\x02\x02\x02,-\x03\x02\x02\x02-\x05\x03\x02\x02\x02.,\x03\x02\x02" +
    "\x02/2\x07\x16\x02\x0201\x07\x15\x02\x0213\x05\n\x06\x0220\x03\x02\x02" +
    "\x0223\x03\x02\x02\x0236\x03\x02\x02\x0245\x07\x15\x02\x0257\x05\f\x07" +
    "\x0264\x03\x02\x02\x0278\x03\x02\x02\x0286\x03\x02\x02\x0289\x03\x02\x02" +
    "\x029;\x03\x02\x02\x02:<\x07\x14\x02\x02;:\x03\x02\x02\x02;<\x03\x02\x02" +
    "\x02<\x07\x03\x02\x02\x02=>\x07\x14\x02\x02>\t\x03\x02\x02\x02?D\x07\x17" +
    "\x02\x02@A\x07\x15\x02\x02AC\x07\x17\x02\x02B@\x03\x02\x02\x02CF\x03\x02" +
    "\x02\x02DB\x03\x02\x02\x02DE\x03\x02\x02\x02E\v\x03\x02\x02\x02FD\x03" +
    "\x02\x02\x02GH\x07\x17\x02\x02HI\x05\x0E\b\x02I\r\x03\x02\x02\x02JS\x07" +
    "\x03\x02\x02KP\x05\x10\t\x02LM\x07\x04\x02\x02MO\x05\x10\t\x02NL\x03\x02" +
    "\x02\x02OR\x03\x02\x02\x02PN\x03\x02\x02\x02PQ\x03\x02\x02\x02QT\x03\x02" +
    "\x02\x02RP\x03\x02\x02\x02SK\x03\x02\x02\x02ST\x03\x02\x02\x02TU\x03\x02" +
    "\x02\x02UV\x07\x05\x02\x02V\x0F\x03\x02\x02\x02W[\x05\x1E\x10\x02X[\x05" +
    "\x12\n\x02Y[\x05\x14\v\x02ZW\x03\x02\x02\x02ZX\x03\x02\x02\x02ZY\x03\x02" +
    "\x02\x02[\x11\x03\x02\x02\x02\\^\x07\x06\x02\x02]_\x05\x18\r\x02^]\x03" +
    "\x02\x02\x02^_\x03\x02\x02\x02_a\x03\x02\x02\x02`b\x07\x04\x02\x02a`\x03" +
    "\x02\x02\x02ab\x03\x02\x02\x02bc\x03\x02\x02\x02cd\x07\x07\x02\x02d\x13" +
    "\x03\x02\x02\x02eg\x07\b\x02\x02fh\x05\x16\f\x02gf\x03\x02\x02\x02gh\x03" +
    "\x02\x02\x02hi\x03\x02\x02\x02ij\x07\t\x02\x02j\x15\x03\x02\x02\x02kp" +
    "\x05\x1C\x0F\x02lm\x07\x04\x02\x02mo\x05\x1C\x0F\x02nl\x03\x02\x02\x02" +
    "or\x03\x02\x02\x02pn\x03\x02\x02\x02pq\x03\x02\x02\x02q\x17\x03\x02\x02" +
    "\x02rp\x03\x02\x02\x02sx\x05\x1A\x0E\x02tu\x07\x04\x02\x02uw\x05\x1A\x0E" +
    "\x02vt\x03\x02\x02\x02wz\x03\x02\x02\x02xv\x03\x02\x02\x02xy\x03\x02\x02" +
    "\x02y\x19\x03\x02\x02\x02zx\x03\x02\x02\x02{|\x05 \x11\x02|}\x07\n\x02" +
    "\x02}~\x05\x1C\x0F\x02~\x1B\x03\x02\x02\x02\x7F\x84\x05\x1E\x10\x02\x80" +
    "\x84\x05\x12\n\x02\x81\x84\x05\x14\v\x02\x82\x84\x05\f\x07\x02\x83\x7F" +
    "\x03\x02\x02\x02\x83\x80\x03\x02\x02\x02\x83\x81\x03\x02\x02\x02\x83\x82" +
    "\x03\x02\x02\x02\x84\x1D\x03\x02\x02\x02\x85\x89\t\x02\x02\x02\x86\x89" +
    "\x07\v\x02\x02\x87\x89\x07\x11\x02\x02\x88\x85\x03\x02\x02\x02\x88\x86" +
    "\x03\x02\x02\x02\x88\x87\x03\x02\x02\x02\x89\x1F\x03\x02\x02\x02\x8A\x8B" +
    "\t\x03\x02\x02\x8B!\x03\x02\x02\x02\x8C\x8D\t\x04\x02\x02\x8D#\x03\x02" +
    "\x02\x02\x12*,28;DPSZ^agpx\x83\x88";
__decorate([
    Decorators_1.Override,
    Decorators_1.NotNull
], mongoParser.prototype, "vocabulary", null);
__decorate([
    Decorators_1.Override
], mongoParser.prototype, "grammarFileName", null);
__decorate([
    Decorators_1.Override
], mongoParser.prototype, "ruleNames", null);
__decorate([
    Decorators_1.Override
], mongoParser.prototype, "serializedATN", null);
__decorate([
    RuleVersion_1.RuleVersion(0)
], mongoParser.prototype, "mongoCommands", null);
__decorate([
    RuleVersion_1.RuleVersion(0)
], mongoParser.prototype, "commands", null);
__decorate([
    RuleVersion_1.RuleVersion(0)
], mongoParser.prototype, "command", null);
__decorate([
    RuleVersion_1.RuleVersion(0)
], mongoParser.prototype, "emptyCommand", null);
__decorate([
    RuleVersion_1.RuleVersion(0)
], mongoParser.prototype, "collection", null);
__decorate([
    RuleVersion_1.RuleVersion(0)
], mongoParser.prototype, "functionCall", null);
__decorate([
    RuleVersion_1.RuleVersion(0)
], mongoParser.prototype, "arguments", null);
__decorate([
    RuleVersion_1.RuleVersion(0)
], mongoParser.prototype, "argument", null);
__decorate([
    RuleVersion_1.RuleVersion(0)
], mongoParser.prototype, "objectLiteral", null);
__decorate([
    RuleVersion_1.RuleVersion(0)
], mongoParser.prototype, "arrayLiteral", null);
__decorate([
    RuleVersion_1.RuleVersion(0)
], mongoParser.prototype, "elementList", null);
__decorate([
    RuleVersion_1.RuleVersion(0)
], mongoParser.prototype, "propertyNameAndValueList", null);
__decorate([
    RuleVersion_1.RuleVersion(0)
], mongoParser.prototype, "propertyAssignment", null);
__decorate([
    RuleVersion_1.RuleVersion(0)
], mongoParser.prototype, "propertyValue", null);
__decorate([
    RuleVersion_1.RuleVersion(0)
], mongoParser.prototype, "literal", null);
__decorate([
    RuleVersion_1.RuleVersion(0)
], mongoParser.prototype, "propertyName", null);
__decorate([
    RuleVersion_1.RuleVersion(0)
], mongoParser.prototype, "comment", null);
exports.mongoParser = mongoParser;
class MongoCommandsContext extends ParserRuleContext_1.ParserRuleContext {
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    commands() {
        return this.getRuleContext(0, CommandsContext);
    }
    EOF() { return this.getToken(mongoParser.EOF, 0); }
    get ruleIndex() { return mongoParser.RULE_mongoCommands; }
    enterRule(listener) {
        if (listener.enterMongoCommands)
            listener.enterMongoCommands(this);
    }
    exitRule(listener) {
        if (listener.exitMongoCommands)
            listener.exitMongoCommands(this);
    }
    accept(visitor) {
        if (visitor.visitMongoCommands)
            return visitor.visitMongoCommands(this);
        else
            return visitor.visitChildren(this);
    }
}
__decorate([
    Decorators_1.Override
], MongoCommandsContext.prototype, "ruleIndex", null);
__decorate([
    Decorators_1.Override
], MongoCommandsContext.prototype, "enterRule", null);
__decorate([
    Decorators_1.Override
], MongoCommandsContext.prototype, "exitRule", null);
__decorate([
    Decorators_1.Override
], MongoCommandsContext.prototype, "accept", null);
exports.MongoCommandsContext = MongoCommandsContext;
class CommandsContext extends ParserRuleContext_1.ParserRuleContext {
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    command(i) {
        if (i === undefined) {
            return this.getRuleContexts(CommandContext);
        }
        else {
            return this.getRuleContext(i, CommandContext);
        }
    }
    emptyCommand(i) {
        if (i === undefined) {
            return this.getRuleContexts(EmptyCommandContext);
        }
        else {
            return this.getRuleContext(i, EmptyCommandContext);
        }
    }
    comment(i) {
        if (i === undefined) {
            return this.getRuleContexts(CommentContext);
        }
        else {
            return this.getRuleContext(i, CommentContext);
        }
    }
    get ruleIndex() { return mongoParser.RULE_commands; }
    enterRule(listener) {
        if (listener.enterCommands)
            listener.enterCommands(this);
    }
    exitRule(listener) {
        if (listener.exitCommands)
            listener.exitCommands(this);
    }
    accept(visitor) {
        if (visitor.visitCommands)
            return visitor.visitCommands(this);
        else
            return visitor.visitChildren(this);
    }
}
__decorate([
    Decorators_1.Override
], CommandsContext.prototype, "ruleIndex", null);
__decorate([
    Decorators_1.Override
], CommandsContext.prototype, "enterRule", null);
__decorate([
    Decorators_1.Override
], CommandsContext.prototype, "exitRule", null);
__decorate([
    Decorators_1.Override
], CommandsContext.prototype, "accept", null);
exports.CommandsContext = CommandsContext;
class CommandContext extends ParserRuleContext_1.ParserRuleContext {
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    DB() { return this.getToken(mongoParser.DB, 0); }
    DOT(i) {
        if (i === undefined) {
            return this.getTokens(mongoParser.DOT);
        }
        else {
            return this.getToken(mongoParser.DOT, i);
        }
    }
    collection() {
        return this.tryGetRuleContext(0, CollectionContext);
    }
    functionCall(i) {
        if (i === undefined) {
            return this.getRuleContexts(FunctionCallContext);
        }
        else {
            return this.getRuleContext(i, FunctionCallContext);
        }
    }
    SEMICOLON() { return this.tryGetToken(mongoParser.SEMICOLON, 0); }
    get ruleIndex() { return mongoParser.RULE_command; }
    enterRule(listener) {
        if (listener.enterCommand)
            listener.enterCommand(this);
    }
    exitRule(listener) {
        if (listener.exitCommand)
            listener.exitCommand(this);
    }
    accept(visitor) {
        if (visitor.visitCommand)
            return visitor.visitCommand(this);
        else
            return visitor.visitChildren(this);
    }
}
__decorate([
    Decorators_1.Override
], CommandContext.prototype, "ruleIndex", null);
__decorate([
    Decorators_1.Override
], CommandContext.prototype, "enterRule", null);
__decorate([
    Decorators_1.Override
], CommandContext.prototype, "exitRule", null);
__decorate([
    Decorators_1.Override
], CommandContext.prototype, "accept", null);
exports.CommandContext = CommandContext;
class EmptyCommandContext extends ParserRuleContext_1.ParserRuleContext {
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    SEMICOLON() { return this.getToken(mongoParser.SEMICOLON, 0); }
    get ruleIndex() { return mongoParser.RULE_emptyCommand; }
    enterRule(listener) {
        if (listener.enterEmptyCommand)
            listener.enterEmptyCommand(this);
    }
    exitRule(listener) {
        if (listener.exitEmptyCommand)
            listener.exitEmptyCommand(this);
    }
    accept(visitor) {
        if (visitor.visitEmptyCommand)
            return visitor.visitEmptyCommand(this);
        else
            return visitor.visitChildren(this);
    }
}
__decorate([
    Decorators_1.Override
], EmptyCommandContext.prototype, "ruleIndex", null);
__decorate([
    Decorators_1.Override
], EmptyCommandContext.prototype, "enterRule", null);
__decorate([
    Decorators_1.Override
], EmptyCommandContext.prototype, "exitRule", null);
__decorate([
    Decorators_1.Override
], EmptyCommandContext.prototype, "accept", null);
exports.EmptyCommandContext = EmptyCommandContext;
class CollectionContext extends ParserRuleContext_1.ParserRuleContext {
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    IDENTIFIER(i) {
        if (i === undefined) {
            return this.getTokens(mongoParser.IDENTIFIER);
        }
        else {
            return this.getToken(mongoParser.IDENTIFIER, i);
        }
    }
    DOT(i) {
        if (i === undefined) {
            return this.getTokens(mongoParser.DOT);
        }
        else {
            return this.getToken(mongoParser.DOT, i);
        }
    }
    get ruleIndex() { return mongoParser.RULE_collection; }
    enterRule(listener) {
        if (listener.enterCollection)
            listener.enterCollection(this);
    }
    exitRule(listener) {
        if (listener.exitCollection)
            listener.exitCollection(this);
    }
    accept(visitor) {
        if (visitor.visitCollection)
            return visitor.visitCollection(this);
        else
            return visitor.visitChildren(this);
    }
}
__decorate([
    Decorators_1.Override
], CollectionContext.prototype, "ruleIndex", null);
__decorate([
    Decorators_1.Override
], CollectionContext.prototype, "enterRule", null);
__decorate([
    Decorators_1.Override
], CollectionContext.prototype, "exitRule", null);
__decorate([
    Decorators_1.Override
], CollectionContext.prototype, "accept", null);
exports.CollectionContext = CollectionContext;
class FunctionCallContext extends ParserRuleContext_1.ParserRuleContext {
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    arguments() {
        return this.getRuleContext(0, ArgumentsContext);
    }
    IDENTIFIER() { return this.getToken(mongoParser.IDENTIFIER, 0); }
    get ruleIndex() { return mongoParser.RULE_functionCall; }
    enterRule(listener) {
        if (listener.enterFunctionCall)
            listener.enterFunctionCall(this);
    }
    exitRule(listener) {
        if (listener.exitFunctionCall)
            listener.exitFunctionCall(this);
    }
    accept(visitor) {
        if (visitor.visitFunctionCall)
            return visitor.visitFunctionCall(this);
        else
            return visitor.visitChildren(this);
    }
}
__decorate([
    Decorators_1.Override
], FunctionCallContext.prototype, "ruleIndex", null);
__decorate([
    Decorators_1.Override
], FunctionCallContext.prototype, "enterRule", null);
__decorate([
    Decorators_1.Override
], FunctionCallContext.prototype, "exitRule", null);
__decorate([
    Decorators_1.Override
], FunctionCallContext.prototype, "accept", null);
exports.FunctionCallContext = FunctionCallContext;
class ArgumentsContext extends ParserRuleContext_1.ParserRuleContext {
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    argument(i) {
        if (i === undefined) {
            return this.getRuleContexts(ArgumentContext);
        }
        else {
            return this.getRuleContext(i, ArgumentContext);
        }
    }
    get ruleIndex() { return mongoParser.RULE_arguments; }
    enterRule(listener) {
        if (listener.enterArguments)
            listener.enterArguments(this);
    }
    exitRule(listener) {
        if (listener.exitArguments)
            listener.exitArguments(this);
    }
    accept(visitor) {
        if (visitor.visitArguments)
            return visitor.visitArguments(this);
        else
            return visitor.visitChildren(this);
    }
}
__decorate([
    Decorators_1.Override
], ArgumentsContext.prototype, "ruleIndex", null);
__decorate([
    Decorators_1.Override
], ArgumentsContext.prototype, "enterRule", null);
__decorate([
    Decorators_1.Override
], ArgumentsContext.prototype, "exitRule", null);
__decorate([
    Decorators_1.Override
], ArgumentsContext.prototype, "accept", null);
exports.ArgumentsContext = ArgumentsContext;
class ArgumentContext extends ParserRuleContext_1.ParserRuleContext {
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    literal() {
        return this.tryGetRuleContext(0, LiteralContext);
    }
    objectLiteral() {
        return this.tryGetRuleContext(0, ObjectLiteralContext);
    }
    arrayLiteral() {
        return this.tryGetRuleContext(0, ArrayLiteralContext);
    }
    get ruleIndex() { return mongoParser.RULE_argument; }
    enterRule(listener) {
        if (listener.enterArgument)
            listener.enterArgument(this);
    }
    exitRule(listener) {
        if (listener.exitArgument)
            listener.exitArgument(this);
    }
    accept(visitor) {
        if (visitor.visitArgument)
            return visitor.visitArgument(this);
        else
            return visitor.visitChildren(this);
    }
}
__decorate([
    Decorators_1.Override
], ArgumentContext.prototype, "ruleIndex", null);
__decorate([
    Decorators_1.Override
], ArgumentContext.prototype, "enterRule", null);
__decorate([
    Decorators_1.Override
], ArgumentContext.prototype, "exitRule", null);
__decorate([
    Decorators_1.Override
], ArgumentContext.prototype, "accept", null);
exports.ArgumentContext = ArgumentContext;
class ObjectLiteralContext extends ParserRuleContext_1.ParserRuleContext {
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    propertyNameAndValueList() {
        return this.tryGetRuleContext(0, PropertyNameAndValueListContext);
    }
    get ruleIndex() { return mongoParser.RULE_objectLiteral; }
    enterRule(listener) {
        if (listener.enterObjectLiteral)
            listener.enterObjectLiteral(this);
    }
    exitRule(listener) {
        if (listener.exitObjectLiteral)
            listener.exitObjectLiteral(this);
    }
    accept(visitor) {
        if (visitor.visitObjectLiteral)
            return visitor.visitObjectLiteral(this);
        else
            return visitor.visitChildren(this);
    }
}
__decorate([
    Decorators_1.Override
], ObjectLiteralContext.prototype, "ruleIndex", null);
__decorate([
    Decorators_1.Override
], ObjectLiteralContext.prototype, "enterRule", null);
__decorate([
    Decorators_1.Override
], ObjectLiteralContext.prototype, "exitRule", null);
__decorate([
    Decorators_1.Override
], ObjectLiteralContext.prototype, "accept", null);
exports.ObjectLiteralContext = ObjectLiteralContext;
class ArrayLiteralContext extends ParserRuleContext_1.ParserRuleContext {
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    elementList() {
        return this.tryGetRuleContext(0, ElementListContext);
    }
    get ruleIndex() { return mongoParser.RULE_arrayLiteral; }
    enterRule(listener) {
        if (listener.enterArrayLiteral)
            listener.enterArrayLiteral(this);
    }
    exitRule(listener) {
        if (listener.exitArrayLiteral)
            listener.exitArrayLiteral(this);
    }
    accept(visitor) {
        if (visitor.visitArrayLiteral)
            return visitor.visitArrayLiteral(this);
        else
            return visitor.visitChildren(this);
    }
}
__decorate([
    Decorators_1.Override
], ArrayLiteralContext.prototype, "ruleIndex", null);
__decorate([
    Decorators_1.Override
], ArrayLiteralContext.prototype, "enterRule", null);
__decorate([
    Decorators_1.Override
], ArrayLiteralContext.prototype, "exitRule", null);
__decorate([
    Decorators_1.Override
], ArrayLiteralContext.prototype, "accept", null);
exports.ArrayLiteralContext = ArrayLiteralContext;
class ElementListContext extends ParserRuleContext_1.ParserRuleContext {
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    propertyValue(i) {
        if (i === undefined) {
            return this.getRuleContexts(PropertyValueContext);
        }
        else {
            return this.getRuleContext(i, PropertyValueContext);
        }
    }
    get ruleIndex() { return mongoParser.RULE_elementList; }
    enterRule(listener) {
        if (listener.enterElementList)
            listener.enterElementList(this);
    }
    exitRule(listener) {
        if (listener.exitElementList)
            listener.exitElementList(this);
    }
    accept(visitor) {
        if (visitor.visitElementList)
            return visitor.visitElementList(this);
        else
            return visitor.visitChildren(this);
    }
}
__decorate([
    Decorators_1.Override
], ElementListContext.prototype, "ruleIndex", null);
__decorate([
    Decorators_1.Override
], ElementListContext.prototype, "enterRule", null);
__decorate([
    Decorators_1.Override
], ElementListContext.prototype, "exitRule", null);
__decorate([
    Decorators_1.Override
], ElementListContext.prototype, "accept", null);
exports.ElementListContext = ElementListContext;
class PropertyNameAndValueListContext extends ParserRuleContext_1.ParserRuleContext {
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    propertyAssignment(i) {
        if (i === undefined) {
            return this.getRuleContexts(PropertyAssignmentContext);
        }
        else {
            return this.getRuleContext(i, PropertyAssignmentContext);
        }
    }
    get ruleIndex() { return mongoParser.RULE_propertyNameAndValueList; }
    enterRule(listener) {
        if (listener.enterPropertyNameAndValueList)
            listener.enterPropertyNameAndValueList(this);
    }
    exitRule(listener) {
        if (listener.exitPropertyNameAndValueList)
            listener.exitPropertyNameAndValueList(this);
    }
    accept(visitor) {
        if (visitor.visitPropertyNameAndValueList)
            return visitor.visitPropertyNameAndValueList(this);
        else
            return visitor.visitChildren(this);
    }
}
__decorate([
    Decorators_1.Override
], PropertyNameAndValueListContext.prototype, "ruleIndex", null);
__decorate([
    Decorators_1.Override
], PropertyNameAndValueListContext.prototype, "enterRule", null);
__decorate([
    Decorators_1.Override
], PropertyNameAndValueListContext.prototype, "exitRule", null);
__decorate([
    Decorators_1.Override
], PropertyNameAndValueListContext.prototype, "accept", null);
exports.PropertyNameAndValueListContext = PropertyNameAndValueListContext;
class PropertyAssignmentContext extends ParserRuleContext_1.ParserRuleContext {
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    propertyName() {
        return this.getRuleContext(0, PropertyNameContext);
    }
    propertyValue() {
        return this.getRuleContext(0, PropertyValueContext);
    }
    get ruleIndex() { return mongoParser.RULE_propertyAssignment; }
    enterRule(listener) {
        if (listener.enterPropertyAssignment)
            listener.enterPropertyAssignment(this);
    }
    exitRule(listener) {
        if (listener.exitPropertyAssignment)
            listener.exitPropertyAssignment(this);
    }
    accept(visitor) {
        if (visitor.visitPropertyAssignment)
            return visitor.visitPropertyAssignment(this);
        else
            return visitor.visitChildren(this);
    }
}
__decorate([
    Decorators_1.Override
], PropertyAssignmentContext.prototype, "ruleIndex", null);
__decorate([
    Decorators_1.Override
], PropertyAssignmentContext.prototype, "enterRule", null);
__decorate([
    Decorators_1.Override
], PropertyAssignmentContext.prototype, "exitRule", null);
__decorate([
    Decorators_1.Override
], PropertyAssignmentContext.prototype, "accept", null);
exports.PropertyAssignmentContext = PropertyAssignmentContext;
class PropertyValueContext extends ParserRuleContext_1.ParserRuleContext {
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    literal() {
        return this.tryGetRuleContext(0, LiteralContext);
    }
    objectLiteral() {
        return this.tryGetRuleContext(0, ObjectLiteralContext);
    }
    arrayLiteral() {
        return this.tryGetRuleContext(0, ArrayLiteralContext);
    }
    functionCall() {
        return this.tryGetRuleContext(0, FunctionCallContext);
    }
    get ruleIndex() { return mongoParser.RULE_propertyValue; }
    enterRule(listener) {
        if (listener.enterPropertyValue)
            listener.enterPropertyValue(this);
    }
    exitRule(listener) {
        if (listener.exitPropertyValue)
            listener.exitPropertyValue(this);
    }
    accept(visitor) {
        if (visitor.visitPropertyValue)
            return visitor.visitPropertyValue(this);
        else
            return visitor.visitChildren(this);
    }
}
__decorate([
    Decorators_1.Override
], PropertyValueContext.prototype, "ruleIndex", null);
__decorate([
    Decorators_1.Override
], PropertyValueContext.prototype, "enterRule", null);
__decorate([
    Decorators_1.Override
], PropertyValueContext.prototype, "exitRule", null);
__decorate([
    Decorators_1.Override
], PropertyValueContext.prototype, "accept", null);
exports.PropertyValueContext = PropertyValueContext;
class LiteralContext extends ParserRuleContext_1.ParserRuleContext {
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    NullLiteral() { return this.tryGetToken(mongoParser.NullLiteral, 0); }
    BooleanLiteral() { return this.tryGetToken(mongoParser.BooleanLiteral, 0); }
    StringLiteral() { return this.tryGetToken(mongoParser.StringLiteral, 0); }
    RegexLiteral() { return this.tryGetToken(mongoParser.RegexLiteral, 0); }
    NumericLiteral() { return this.tryGetToken(mongoParser.NumericLiteral, 0); }
    get ruleIndex() { return mongoParser.RULE_literal; }
    enterRule(listener) {
        if (listener.enterLiteral)
            listener.enterLiteral(this);
    }
    exitRule(listener) {
        if (listener.exitLiteral)
            listener.exitLiteral(this);
    }
    accept(visitor) {
        if (visitor.visitLiteral)
            return visitor.visitLiteral(this);
        else
            return visitor.visitChildren(this);
    }
}
__decorate([
    Decorators_1.Override
], LiteralContext.prototype, "ruleIndex", null);
__decorate([
    Decorators_1.Override
], LiteralContext.prototype, "enterRule", null);
__decorate([
    Decorators_1.Override
], LiteralContext.prototype, "exitRule", null);
__decorate([
    Decorators_1.Override
], LiteralContext.prototype, "accept", null);
exports.LiteralContext = LiteralContext;
class PropertyNameContext extends ParserRuleContext_1.ParserRuleContext {
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    StringLiteral() { return this.tryGetToken(mongoParser.StringLiteral, 0); }
    IDENTIFIER() { return this.tryGetToken(mongoParser.IDENTIFIER, 0); }
    get ruleIndex() { return mongoParser.RULE_propertyName; }
    enterRule(listener) {
        if (listener.enterPropertyName)
            listener.enterPropertyName(this);
    }
    exitRule(listener) {
        if (listener.exitPropertyName)
            listener.exitPropertyName(this);
    }
    accept(visitor) {
        if (visitor.visitPropertyName)
            return visitor.visitPropertyName(this);
        else
            return visitor.visitChildren(this);
    }
}
__decorate([
    Decorators_1.Override
], PropertyNameContext.prototype, "ruleIndex", null);
__decorate([
    Decorators_1.Override
], PropertyNameContext.prototype, "enterRule", null);
__decorate([
    Decorators_1.Override
], PropertyNameContext.prototype, "exitRule", null);
__decorate([
    Decorators_1.Override
], PropertyNameContext.prototype, "accept", null);
exports.PropertyNameContext = PropertyNameContext;
class CommentContext extends ParserRuleContext_1.ParserRuleContext {
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    SingleLineComment() { return this.tryGetToken(mongoParser.SingleLineComment, 0); }
    MultiLineComment() { return this.tryGetToken(mongoParser.MultiLineComment, 0); }
    get ruleIndex() { return mongoParser.RULE_comment; }
    enterRule(listener) {
        if (listener.enterComment)
            listener.enterComment(this);
    }
    exitRule(listener) {
        if (listener.exitComment)
            listener.exitComment(this);
    }
    accept(visitor) {
        if (visitor.visitComment)
            return visitor.visitComment(this);
        else
            return visitor.visitChildren(this);
    }
}
__decorate([
    Decorators_1.Override
], CommentContext.prototype, "ruleIndex", null);
__decorate([
    Decorators_1.Override
], CommentContext.prototype, "enterRule", null);
__decorate([
    Decorators_1.Override
], CommentContext.prototype, "exitRule", null);
__decorate([
    Decorators_1.Override
], CommentContext.prototype, "accept", null);
exports.CommentContext = CommentContext;
//# sourceMappingURL=mongoParser.js.map