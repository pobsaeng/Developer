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
const sqlops = require("sqlops");
const vscode = require("vscode");
const path = require("path");
const crypto = require("crypto");
const os = require("os");
const findRemoveSync = require("find-remove");
const constants = require("./constants");
const configTracingLevel = 'tracingLevel';
const configLogRetentionMinutes = 'logRetentionMinutes';
const configLogFilesRemovalLimit = 'logFilesRemovalLimit';
const extensionConfigSectionName = 'mssql';
const configLogDebugInfo = 'logDebugInfo';
// The function is a duplicate of \src\paths.js. IT would be better to import path.js but it doesn't
// work for now because the extension is running in different process.
function getAppDataPath() {
    let platform = process.platform;
    switch (platform) {
        case 'win32': return process.env['APPDATA'] || path.join(process.env['USERPROFILE'], 'AppData', 'Roaming');
        case 'darwin': return path.join(os.homedir(), 'Library', 'Application Support');
        case 'linux': return process.env['XDG_CONFIG_HOME'] || path.join(os.homedir(), '.config');
        default: throw new Error('Platform not supported');
    }
}
exports.getAppDataPath = getAppDataPath;
function removeOldLogFiles(prefix) {
    return findRemoveSync(getDefaultLogDir(), { prefix: `${prefix}_`, age: { seconds: getConfigLogRetentionSeconds() }, limit: getConfigLogFilesRemovalLimit() });
}
exports.removeOldLogFiles = removeOldLogFiles;
function getConfiguration(config = extensionConfigSectionName) {
    return vscode.workspace.getConfiguration(extensionConfigSectionName);
}
exports.getConfiguration = getConfiguration;
function getConfigLogFilesRemovalLimit() {
    let config = getConfiguration();
    if (config) {
        return Number((config[configLogFilesRemovalLimit]).toFixed(0));
    }
    else {
        return undefined;
    }
}
exports.getConfigLogFilesRemovalLimit = getConfigLogFilesRemovalLimit;
function getConfigLogRetentionSeconds() {
    let config = getConfiguration();
    if (config) {
        return Number((config[configLogRetentionMinutes] * 60).toFixed(0));
    }
    else {
        return undefined;
    }
}
exports.getConfigLogRetentionSeconds = getConfigLogRetentionSeconds;
function getConfigTracingLevel() {
    let config = getConfiguration();
    if (config) {
        return config[configTracingLevel];
    }
    else {
        return undefined;
    }
}
exports.getConfigTracingLevel = getConfigTracingLevel;
function getDefaultLogDir() {
    return path.join(process.env['VSCODE_LOGS'], '..', '..', 'mssql');
}
exports.getDefaultLogDir = getDefaultLogDir;
function getDefaultLogFile(prefix, pid) {
    return path.join(getDefaultLogDir(), `${prefix}_${pid}.log`);
}
exports.getDefaultLogFile = getDefaultLogFile;
function getCommonLaunchArgsAndCleanupOldLogFiles(prefix, executablePath) {
    let launchArgs = [];
    launchArgs.push('--log-file');
    let logFile = getDefaultLogFile(prefix, process.pid);
    launchArgs.push(logFile);
    console.log(`logFile for ${path.basename(executablePath)} is ${logFile}`);
    console.log(`This process (ui Extenstion Host) is pid: ${process.pid}`);
    // Delete old log files
    let deletedLogFiles = removeOldLogFiles(prefix);
    console.log(`Old log files deletion report: ${JSON.stringify(deletedLogFiles)}`);
    launchArgs.push('--tracing-level');
    launchArgs.push(getConfigTracingLevel());
    return launchArgs;
}
exports.getCommonLaunchArgsAndCleanupOldLogFiles = getCommonLaunchArgsAndCleanupOldLogFiles;
function ensure(target, key) {
    if (target[key] === void 0) {
        target[key] = {};
    }
    return target[key];
}
exports.ensure = ensure;
function getPackageInfo(packageJson) {
    if (packageJson) {
        return {
            name: packageJson.name,
            version: packageJson.version,
            aiKey: packageJson.aiKey
        };
    }
}
exports.getPackageInfo = getPackageInfo;
function generateUserId() {
    return new Promise(resolve => {
        try {
            let interfaces = os.networkInterfaces();
            let mac;
            for (let key of Object.keys(interfaces)) {
                let item = interfaces[key][0];
                if (!item.internal) {
                    mac = item.mac;
                    break;
                }
            }
            if (mac) {
                resolve(crypto.createHash('sha256').update(mac + os.homedir(), 'utf8').digest('hex'));
            }
            else {
                resolve(generateGuid());
            }
        }
        catch (err) {
            resolve(generateGuid()); // fallback
        }
    });
}
exports.generateUserId = generateUserId;
function generateGuid() {
    let hexValues = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
    // c.f. rfc4122 (UUID version 4 = xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx)
    let oct = '';
    let tmp;
    /* tslint:disable:no-bitwise */
    for (let a = 0; a < 4; a++) {
        tmp = (4294967296 * Math.random()) | 0;
        oct += hexValues[tmp & 0xF] +
            hexValues[tmp >> 4 & 0xF] +
            hexValues[tmp >> 8 & 0xF] +
            hexValues[tmp >> 12 & 0xF] +
            hexValues[tmp >> 16 & 0xF] +
            hexValues[tmp >> 20 & 0xF] +
            hexValues[tmp >> 24 & 0xF] +
            hexValues[tmp >> 28 & 0xF];
    }
    // 'Set the two most significant bits (bits 6 and 7) of the clock_seq_hi_and_reserved to zero and one, respectively'
    let clockSequenceHi = hexValues[8 + (Math.random() * 4) | 0];
    return oct.substr(0, 8) + '-' + oct.substr(9, 4) + '-4' + oct.substr(13, 3) + '-' + clockSequenceHi + oct.substr(16, 3) + '-' + oct.substr(19, 12);
    /* tslint:enable:no-bitwise */
}
exports.generateGuid = generateGuid;
function verifyPlatform() {
    if (os.platform() === 'darwin' && parseFloat(os.release()) < 16.0) {
        return Promise.resolve(false);
    }
    else {
        return Promise.resolve(true);
    }
}
exports.verifyPlatform = verifyPlatform;
function getErrorMessage(error) {
    return (error instanceof Error) ? error.message : error;
}
exports.getErrorMessage = getErrorMessage;
function isObjectExplorerContext(object) {
    return 'connectionProfile' in object && 'isConnectionNode' in object;
}
exports.isObjectExplorerContext = isObjectExplorerContext;
function getUserHome() {
    return process.env.HOME || process.env.USERPROFILE;
}
exports.getUserHome = getUserHome;
function getClusterEndpoint(profileId, serviceName) {
    return __awaiter(this, void 0, void 0, function* () {
        let serverInfo = yield sqlops.connection.getServerInfo(profileId);
        if (!serverInfo || !serverInfo.options) {
            return undefined;
        }
        let endpoints = serverInfo.options[constants.clusterEndpointsProperty];
        if (!endpoints || endpoints.length === 0) {
            return undefined;
        }
        let index = endpoints.findIndex(ep => ep.serviceName === serviceName);
        if (index === -1) {
            return undefined;
        }
        let clusterEndpoint = {
            serviceName: endpoints[index].serviceName,
            ipAddress: endpoints[index].ipAddress,
            port: endpoints[index].port
        };
        return clusterEndpoint;
    });
}
exports.getClusterEndpoint = getClusterEndpoint;
function isValidNumber(maybeNumber) {
    return maybeNumber !== undefined
        && maybeNumber !== null
        && maybeNumber !== ''
        && !isNaN(Number(maybeNumber.toString()));
}
exports.isValidNumber = isValidNumber;
/**
 * Helper to log messages to the developer console if enabled
 * @param msg Message to log to the console
 */
function logDebug(msg) {
    let config = vscode.workspace.getConfiguration(extensionConfigSectionName);
    let logDebugInfo = config[configLogDebugInfo];
    if (logDebugInfo === true) {
        let currentTime = new Date().toLocaleTimeString();
        let outputMsg = '[' + currentTime + ']: ' + msg ? msg.toString() : '';
        console.log(outputMsg);
    }
}
exports.logDebug = logDebug;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/887f4e8985023602e599cf86bdb44df48bb28569/extensions/mssql/out/utils.js.map
