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
const tryGetLocalRuntimeVersion_1 = require("../../funcCoreTools/tryGetLocalRuntimeVersion");
const ProjectSettings_1 = require("../../ProjectSettings");
class ProjectCreatorBase {
    constructor(functionAppPath, telemetryProperties) {
        this.deploySubpath = '';
        this.preDeployTask = '';
        this.excludedFiles = '';
        this.otherSettings = {};
        this.functionAppPath = functionAppPath;
        this.telemetryProperties = telemetryProperties;
    }
    getRuntime() {
        return __awaiter(this, void 0, void 0, function* () {
            // tslint:disable-next-line:strict-boolean-expressions
            return (yield tryGetLocalRuntimeVersion_1.tryGetLocalRuntimeVersion()) || (yield ProjectSettings_1.promptForProjectRuntime());
        });
    }
    getLaunchJson() {
        // By default languages do not support attaching on F5. Each language that supports F5'ing will have to overwrite this method in the subclass
        return undefined;
    }
    getRecommendedExtensions() {
        return ['ms-azuretools.vscode-azurefunctions'];
    }
}
exports.ProjectCreatorBase = ProjectCreatorBase;
exports.funcWatchProblemMatcher = '$func-watch';
//# sourceMappingURL=IProjectCreator.js.map