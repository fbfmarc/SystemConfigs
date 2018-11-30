"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const url = require("url");
const ParsedConnectionString_1 = require("../ParsedConnectionString");
function parseDocDBConnectionString(connectionString) {
    const endpoint = getPropertyFromConnectionString(connectionString, 'AccountEndpoint');
    const masterKey = getPropertyFromConnectionString(connectionString, 'AccountKey');
    const databaseName = getPropertyFromConnectionString(connectionString, 'Database');
    if (!endpoint || !masterKey) {
        throw new Error('Invalid Document DB connection string.');
    }
    return new ParsedDocDBConnectionString(connectionString, endpoint, masterKey, databaseName);
}
exports.parseDocDBConnectionString = parseDocDBConnectionString;
function getPropertyFromConnectionString(connectionString, property) {
    const regexp = new RegExp(`(?:^|;)\\s*${property}=([^;]+)(?:;|$)`, 'i');
    const match = connectionString.match(regexp);
    return match && match[1];
}
class ParsedDocDBConnectionString extends ParsedConnectionString_1.ParsedConnectionString {
    constructor(connectionString, endpoint, masterKey, databaseName) {
        super(connectionString, databaseName);
        this.documentEndpoint = endpoint;
        this.masterKey = masterKey;
        const parsedEndpoint = url.parse(endpoint);
        this.hostName = parsedEndpoint.hostname;
        this.port = parsedEndpoint.port;
    }
}
exports.ParsedDocDBConnectionString = ParsedDocDBConnectionString;
//# sourceMappingURL=docDBConnectionStrings.js.map