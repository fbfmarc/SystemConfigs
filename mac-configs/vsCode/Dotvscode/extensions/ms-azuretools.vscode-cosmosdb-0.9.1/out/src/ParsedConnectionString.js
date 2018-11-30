"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
class ParsedConnectionString {
    constructor(connectionString, databaseName) {
        this.connectionString = connectionString;
        this.databaseName = databaseName;
    }
    get accountId() {
        return `${this.hostName}:${this.port}`;
    }
    get fullId() {
        return `${this.accountId}${this.databaseName ? '/' + this.databaseName : ''}`;
    }
}
exports.ParsedConnectionString = ParsedConnectionString;
//# sourceMappingURL=ParsedConnectionString.js.map