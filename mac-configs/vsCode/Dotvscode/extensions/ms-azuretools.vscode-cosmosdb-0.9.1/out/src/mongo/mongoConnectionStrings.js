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
const mongodb_1 = require("mongodb");
const vscode_azureextensionui_1 = require("vscode-azureextensionui");
const ParsedConnectionString_1 = require("../ParsedConnectionString");
const connectToMongoClient_1 = require("./connectToMongoClient");
// Connection strings follow the following format (https://docs.mongodb.com/manual/reference/connection-string/):
//   mongodb[+srv]://[username:password@]host1[:port1][,host2[:port2],...[,hostN[:portN]]][/[database][?options]]
// Some example connection strings:
//   mongodb://dbuser:dbpassword@dbname.mlab.com:14118
//   mongodb+srv://db1.example.net:27017,db2.example.net:2500/?replicaSet=test
//   mongodb://router1.example.com:27017,router2.example2.com:27017,router3.example3.com:27017/database?ssh=true
// Regex splits into three parts:
//   Full match
//   mongodb[username:password@]host1[:port1][,host2[:port2],...[,hostN[:portN]]]
//   [database]
const parsePrefix = '([a-zA-Z]+:\/\/[^\/]*)';
const parseDatabaseName = '\/?([^/?]+)?';
const mongoConnectionStringRegExp = new RegExp(parsePrefix + parseDatabaseName);
function getDatabaseNameFromConnectionString(connectionString) {
    try {
        let [, , databaseName] = connectionString.match(mongoConnectionStringRegExp);
        return databaseName;
    }
    catch (error) {
        // Shouldn't happen, but ignore if does
    }
    return undefined;
}
exports.getDatabaseNameFromConnectionString = getDatabaseNameFromConnectionString;
function addDatabaseToAccountConnectionString(connectionString, databaseName) {
    try {
        return connectionString.replace(mongoConnectionStringRegExp, `$1\/${databaseName}`);
    }
    catch (error) {
        // Shouldn't happen, but ignore if does
    }
    return undefined;
}
exports.addDatabaseToAccountConnectionString = addDatabaseToAccountConnectionString;
function parseMongoConnectionString(connectionString) {
    return __awaiter(this, void 0, void 0, function* () {
        let host;
        let port;
        const db = yield connectToMongoClient_1.connectToMongoClient(connectionString, vscode_azureextensionui_1.appendExtensionUserAgent());
        const serverConfig = db.serverConfig;
        // Azure CosmosDB comes back as a ReplSet
        if (serverConfig instanceof mongodb_1.ReplSet) {
            // get the first connection string from the seedlist for the ReplSet
            // this may not be best solution, but the connection (below) gives
            // the replicaset host name, which is different than what is in the connection string
            // "s" is not part of ReplSet static definition but can't find any official documentation on it. Yet it is definitely there at runtime. Grandfathering in.
            // tslint:disable-next-line:no-any
            let rs = serverConfig;
            host = rs.s.replset.s.seedlist[0].host;
            port = rs.s.replset.s.seedlist[0].port;
        }
        else {
            host = serverConfig['host'];
            port = serverConfig['port'];
        }
        return new ParsedMongoConnectionString(connectionString, host, port, getDatabaseNameFromConnectionString(connectionString));
    });
}
exports.parseMongoConnectionString = parseMongoConnectionString;
class ParsedMongoConnectionString extends ParsedConnectionString_1.ParsedConnectionString {
    constructor(connectionString, hostName, port, databaseName) {
        super(connectionString, databaseName);
        this.hostName = hostName;
        this.port = port;
    }
}
exports.ParsedMongoConnectionString = ParsedMongoConnectionString;
//# sourceMappingURL=mongoConnectionStrings.js.map