"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTelemetryReporter = (reporter) => reporter ? new TelemetryReporterImpl(reporter) : new NullTelemetryReporter();
class TelemetryReporterImpl {
    constructor(reporter) {
        this.reporter = reporter;
    }
    logCommandTrigger(commandName) {
        this.reporter.sendTelemetryEvent('commandTriggered', { commandName });
    }
    logCommandErrored(commandName) {
        this.reporter.sendTelemetryEvent('commandErrored', { commandName });
    }
    dispose() {
        this.reporter.dispose();
    }
}
class NullTelemetryReporter {
    logCommandTrigger(_commandName) {
    }
    logCommandErrored(_commandName) {
    }
    dispose() {
    }
}
//# sourceMappingURL=telemetry-reporter.js.map