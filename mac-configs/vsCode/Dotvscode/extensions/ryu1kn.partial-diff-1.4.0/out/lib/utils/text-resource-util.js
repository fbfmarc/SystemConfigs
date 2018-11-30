"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const const_1 = require("../const");
exports.makeUriString = (textKey, timestamp) => `${const_1.EXTENSION_SCHEME}:text/${textKey}?_ts=${timestamp.getTime()}`; // `_ts` to avoid cache
exports.extractTextKey = (uri) => uri.path.match(/^text\/([a-z\d]+)/)[1];
//# sourceMappingURL=text-resource-util.js.map