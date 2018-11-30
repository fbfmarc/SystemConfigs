"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_extension_telemetry_1 = require("vscode-extension-telemetry");
const fs = require("fs");
function createTelemetryReporter(packageJsonPath) {
    const packageInfo = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const extensionId = `${packageInfo.publisher}.${packageInfo.name}`;
    const extensionVersion = packageInfo.version;
    const key = packageInfo.telemetryKey;
    return new vscode_extension_telemetry_1.default(extensionId, extensionVersion, key);
}
exports.createTelemetryReporter = createTelemetryReporter;
//# sourceMappingURL=telemetry-reporter-factory.js.map