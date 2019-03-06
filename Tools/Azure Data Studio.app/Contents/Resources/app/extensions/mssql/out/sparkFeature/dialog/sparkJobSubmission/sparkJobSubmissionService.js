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
const os = require("os");
const nls = require("vscode-nls");
const localize = nls.loadMessageBundle(__filename);
const constants = require("../../../constants");
const utils = require("../../../utils");
class SparkJobSubmissionService {
    constructor(requestService) {
        if (requestService) {
            // this is to fake the request service for test.
            this._requestPromise = requestService;
        }
        else {
            this._requestPromise = require('request-promise');
        }
    }
    submitBatchJob(submissionArgs) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let livyUrl = `https://${submissionArgs.host}:${submissionArgs.port}${submissionArgs.livyPath}/`;
                let options = {
                    uri: livyUrl,
                    method: 'POST',
                    json: true,
                    // TODO, change it back after service's authentication changed.
                    rejectUnauthorized: false,
                    body: {
                        file: submissionArgs.sparkFile,
                        proxyUser: submissionArgs.user,
                        className: submissionArgs.mainClass,
                        name: submissionArgs.jobName
                    },
                    // authentication headers
                    headers: {
                        'Authorization': 'Basic ' + new Buffer(submissionArgs.user + ':' + submissionArgs.password).toString('base64')
                    }
                };
                // Set arguments
                if (submissionArgs.jobArguments && submissionArgs.jobArguments.trim()) {
                    let argsList = submissionArgs.jobArguments.split(' ');
                    if (argsList.length > 0) {
                        options.body['args'] = argsList;
                    }
                }
                // Set jars files
                if (submissionArgs.jarFileList && submissionArgs.jarFileList.trim()) {
                    let jarList = submissionArgs.jarFileList.split(';');
                    if (jarList.length > 0) {
                        options.body['jars'] = jarList;
                    }
                }
                // Set py files
                if (submissionArgs.pyFileList && submissionArgs.pyFileList.trim()) {
                    let pyList = submissionArgs.pyFileList.split(';');
                    if (pyList.length > 0) {
                        options.body['pyFiles'] = pyList;
                    }
                }
                // Set other files
                if (submissionArgs.otherFileList && submissionArgs.otherFileList.trim()) {
                    let otherList = submissionArgs.otherFileList.split(';');
                    if (otherList.length > 0) {
                        options.body['files'] = otherList;
                    }
                }
                const response = yield this._requestPromise(options);
                if (response && utils.isValidNumber(response.id)) {
                    return response.id;
                }
                return Promise.reject(new Error(localize(0, null, os.EOL, JSON.stringify(response))));
            }
            catch (error) {
                return Promise.reject(error);
            }
        });
    }
    getYarnAppId(submissionArgs, livyBatchId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let livyUrl = `https://${submissionArgs.host}:${submissionArgs.port}${submissionArgs.livyPath}/${livyBatchId}/log`;
                let options = {
                    uri: livyUrl,
                    method: 'GET',
                    json: true,
                    rejectUnauthorized: false,
                    // authentication headers
                    headers: {
                        'Authorization': 'Basic ' + new Buffer(submissionArgs.user + ':' + submissionArgs.password).toString('base64')
                    }
                };
                const response = yield this._requestPromise(options);
                if (response && response.log) {
                    return this.extractYarnAppIdFromLog(response.log);
                }
                return Promise.reject(localize(1, null, os.EOL, JSON.stringify(response)));
            }
            catch (error) {
                return Promise.reject(error);
            }
        });
    }
    extractYarnAppIdFromLog(log) {
        let logForPrint = log;
        if (Array.isArray(log)) {
            logForPrint = log.join(os.EOL);
        }
        // eg: '18/08/23 11:02:50 INFO yarn.Client: Application report for application_1532646201938_0182 (state: ACCEPTED)'
        for (let entry of log) {
            if (entry.indexOf('Application report for') >= 0 && entry.indexOf('(state: ACCEPTED)') >= 0) {
                let tokens = entry.split(' ');
                for (let token of tokens) {
                    if (token.startsWith('application_')) {
                        return new LivyLogResponse(logForPrint, token);
                    }
                }
            }
        }
        return new LivyLogResponse(logForPrint, '');
    }
}
exports.SparkJobSubmissionService = SparkJobSubmissionService;
class SparkJobSubmissionInput {
    constructor(_jobName, _sparkFile, _mainClass, _arguments, _jarFileList, _pyFileList, _otherFileList, _host, _port, _livyPath, _user, _passWord) {
        this._jobName = _jobName;
        this._sparkFile = _sparkFile;
        this._mainClass = _mainClass;
        this._arguments = _arguments;
        this._jarFileList = _jarFileList;
        this._pyFileList = _pyFileList;
        this._otherFileList = _otherFileList;
        this._host = _host;
        this._port = _port;
        this._livyPath = _livyPath;
        this._user = _user;
        this._passWord = _passWord;
    }
    setSparkClusterInfo(sqlClusterConnection) {
        this._host = sqlClusterConnection.host;
        this._port = sqlClusterConnection.port;
        this._livyPath = constants.mssqlClusterLivySubmitPath;
        this._user = sqlClusterConnection.user;
        this._passWord = sqlClusterConnection.password;
    }
    get jobName() { return this._jobName; }
    get sparkFile() { return this._sparkFile; }
    get mainClass() { return this._mainClass; }
    get jobArguments() { return this._arguments; }
    get jarFileList() { return this._jarFileList; }
    get otherFileList() { return this._otherFileList; }
    get pyFileList() { return this._pyFileList; }
    get host() { return this._host; }
    get port() { return this._port; }
    get livyPath() { return this._livyPath; }
    get user() { return this._user; }
    get password() { return this._passWord; }
}
exports.SparkJobSubmissionInput = SparkJobSubmissionInput;
var SparkFileSource;
(function (SparkFileSource) {
    SparkFileSource[SparkFileSource["HDFS"] = 'HDFS'] = "HDFS";
    SparkFileSource[SparkFileSource["Local"] = 'Local'] = "Local";
})(SparkFileSource = exports.SparkFileSource || (exports.SparkFileSource = {}));
class LivyLogResponse {
    constructor(log, appId) {
        this.log = log;
        this.appId = appId;
    }
}
exports.LivyLogResponse = LivyLogResponse;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/887f4e8985023602e599cf86bdb44df48bb28569/extensions/mssql/out/sparkFeature/dialog/sparkJobSubmission/sparkJobSubmissionService.js.map
