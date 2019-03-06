/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const childProcess = require("child_process");
const fs = require("fs-extra");
const nls = require("vscode-nls");
const path = require("path");
const which = require("which");
const localize = nls.loadMessageBundle(__filename);
function getDropdownValue(dropdownValue) {
    if (typeof (dropdownValue) === 'string') {
        return dropdownValue;
    }
    else {
        return dropdownValue ? dropdownValue.name : undefined;
    }
}
exports.getDropdownValue = getDropdownValue;
function getServerAddressFromName(connection) {
    // Strip TDS port number from the server URI
    if (connection.options && connection.options['host']) {
        return connection.options['host'].split(',')[0].split(':')[0];
    }
    else if (connection.options && connection.options['server']) {
        return connection.options['server'].split(',')[0].split(':')[0];
    }
    else {
        return connection.split(',')[0].split(':')[0];
    }
}
exports.getServerAddressFromName = getServerAddressFromName;
function getKnoxUrl(host, port) {
    return `https://${host}:${port}/gateway`;
}
exports.getKnoxUrl = getKnoxUrl;
function getLivyUrl(serverName, port) {
    return this.getKnoxUrl(serverName, port) + '/default/livy/v1/';
}
exports.getLivyUrl = getLivyUrl;
function getTemplatePath(extensionPath, templateName) {
    return path.join(extensionPath, 'resources', templateName);
}
exports.getTemplatePath = getTemplatePath;
function shellWhichResolving(cmd) {
    return new Promise(resolve => {
        which(cmd, (err, foundPath) => {
            if (err) {
                resolve(undefined);
            }
            else {
                // NOTE: Using realpath b/c some system installs are symlinked from */bin
                resolve(fs.realpathSync(foundPath));
            }
        });
    });
}
exports.shellWhichResolving = shellWhichResolving;
function mkDir(dirPath, outputChannel) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(yield fs.exists(dirPath))) {
            if (outputChannel) {
                outputChannel.appendLine(localize(0, null, dirPath));
            }
            yield fs.ensureDir(dirPath);
        }
    });
}
exports.mkDir = mkDir;
function getErrorMessage(error) {
    return (error instanceof Error) ? error.message : error;
}
exports.getErrorMessage = getErrorMessage;
// COMMAND EXECUTION HELPERS ///////////////////////////////////////////////
function executeBufferedCommand(cmd, options, outputChannel) {
    return new Promise((resolve, reject) => {
        if (outputChannel) {
            outputChannel.appendLine(`	> ${cmd}`);
        }
        let child = childProcess.exec(cmd, options, (err, stdout) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(stdout);
            }
        });
        // Add listeners to print stdout and stderr if an output channel was provided
        if (outputChannel) {
            child.stdout.on('data', data => { outputDataChunk(data, outputChannel, '	stdout: '); });
            child.stderr.on('data', data => { outputDataChunk(data, outputChannel, '	stderr: '); });
        }
    });
}
exports.executeBufferedCommand = executeBufferedCommand;
function executeExitCodeCommand(cmd, outputChannel) {
    return new Promise((resolve, reject) => {
        if (outputChannel) {
            outputChannel.appendLine(`	> ${cmd}`);
        }
        let child = childProcess.spawn(cmd, [], { shell: true, detached: false });
        // Add listeners for the process to exit
        child.on('error', reject);
        child.on('exit', (code) => { resolve(code); });
        // Add listeners to print stdout and stderr if an output channel was provided
        if (outputChannel) {
            child.stdout.on('data', data => { outputDataChunk(data, outputChannel, '	stdout: '); });
            child.stderr.on('data', data => { outputDataChunk(data, outputChannel, '	stderr: '); });
        }
    });
}
exports.executeExitCodeCommand = executeExitCodeCommand;
function executeStreamedCommand(cmd, outputChannel) {
    return new Promise((resolve, reject) => {
        // Start the command
        if (outputChannel) {
            outputChannel.appendLine(`	> ${cmd}`);
        }
        let child = childProcess.spawn(cmd, [], { shell: true, detached: false });
        // Add listeners to resolve/reject the promise on exit
        child.on('error', reject);
        child.on('exit', (code) => {
            if (code === 0) {
                resolve();
            }
            else {
                reject(localize(1, null, code));
            }
        });
        // Add listeners to print stdout and stderr if an output channel was provided
        if (outputChannel) {
            child.stdout.on('data', data => { outputDataChunk(data, outputChannel, '	stdout: '); });
            child.stderr.on('data', data => { outputDataChunk(data, outputChannel, '	stderr: '); });
        }
    });
}
exports.executeStreamedCommand = executeStreamedCommand;
function isObjectExplorerContext(object) {
    return 'connectionProfile' in object && 'isConnectionNode' in object;
}
exports.isObjectExplorerContext = isObjectExplorerContext;
function getUserHome() {
    return process.env.HOME || process.env.USERPROFILE;
}
exports.getUserHome = getUserHome;
var Platform;
(function (Platform) {
    Platform[Platform["Mac"] = 0] = "Mac";
    Platform[Platform["Linux"] = 1] = "Linux";
    Platform[Platform["Windows"] = 2] = "Windows";
    Platform[Platform["Others"] = 3] = "Others";
})(Platform = exports.Platform || (exports.Platform = {}));
function getOSPlatform() {
    switch (process.platform) {
        case 'win32':
            return Platform.Windows;
        case 'darwin':
            return Platform.Mac;
        case 'linux':
            return Platform.Linux;
        default:
            return Platform.Others;
    }
}
exports.getOSPlatform = getOSPlatform;
function getOSPlatformId() {
    var platformId = undefined;
    switch (process.platform) {
        case 'win32':
            platformId = 'win-x64';
            break;
        case 'darwin':
            platformId = 'osx';
            break;
        default:
            platformId = 'linux-x64';
            break;
    }
    return platformId;
}
exports.getOSPlatformId = getOSPlatformId;
// PRIVATE HELPERS /////////////////////////////////////////////////////////
function outputDataChunk(data, outputChannel, header) {
    data.toString().split(/\r?\n/)
        .forEach(line => {
        outputChannel.appendLine(header + line);
    });
}
function clone(obj) {
    if (!obj || typeof obj !== 'object') {
        return obj;
    }
    if (obj instanceof RegExp) {
        // See https://github.com/Microsoft/TypeScript/issues/10990
        return obj;
    }
    const result = (Array.isArray(obj)) ? [] : {};
    Object.keys(obj).forEach(key => {
        if (obj[key] && typeof obj[key] === 'object') {
            result[key] = clone(obj[key]);
        }
        else {
            result[key] = obj[key];
        }
    });
    return result;
}
exports.clone = clone;
function isValidNumber(maybeNumber) {
    return maybeNumber !== undefined
        && maybeNumber !== null
        && maybeNumber !== ''
        && !isNaN(Number(maybeNumber.toString()));
}
exports.isValidNumber = isValidNumber;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/887f4e8985023602e599cf86bdb44df48bb28569/extensions/mssql/out/sparkFeature/sparkUtils.js.map
