"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bootstrapper_factory_1 = require("./lib/bootstrapper-factory");
const bootstrapperFactory = new bootstrapper_factory_1.default();
const telemetryReporter = bootstrapperFactory.getTelemetryReporter();
exports.activate = (context) => {
    const bootstrapper = bootstrapperFactory.create();
    bootstrapper.initiate(context);
    context.subscriptions.push(telemetryReporter);
};
exports.deactivate = () => {
    telemetryReporter.dispose();
};
//# sourceMappingURL=extension.js.map