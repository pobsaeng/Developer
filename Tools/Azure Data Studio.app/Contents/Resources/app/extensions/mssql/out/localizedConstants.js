/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const nls = require("vscode-nls");
const localize = nls.loadMessageBundle(__filename);
// HDFS Constants //////////////////////////////////////////////////////////
exports.msgMissingNodeContext = localize(0, null);
// Spark Job Submission Constants //////////////////////////////////////////
exports.sparkLocalFileDestinationHint = localize(1, null);
exports.sparkJobSubmissionEndMessage = localize(2, null);
function sparkJobSubmissionPrepareUploadingFile(localPath, clusterFolder) { return localize(3, null, localPath, clusterFolder); }
exports.sparkJobSubmissionPrepareUploadingFile = sparkJobSubmissionPrepareUploadingFile;
exports.sparkJobSubmissionUploadingFileSucceeded = localize(4, null);
function sparkJobSubmissionUploadingFileFailed(err) { return localize(5, null, err); }
exports.sparkJobSubmissionUploadingFileFailed = sparkJobSubmissionUploadingFileFailed;
function sparkJobSubmissionPrepareSubmitJob(jobName) { return localize(6, null, jobName); }
exports.sparkJobSubmissionPrepareSubmitJob = sparkJobSubmissionPrepareSubmitJob;
exports.sparkJobSubmissionSparkJobHasBeenSubmitted = localize(7, null);
function sparkJobSubmissionSubmitJobFailed(err) { return localize(8, null, err); }
exports.sparkJobSubmissionSubmitJobFailed = sparkJobSubmissionSubmitJobFailed;
function sparkJobSubmissionYarnUIMessage(yarnUIURL) { return localize(9, null, yarnUIURL); }
exports.sparkJobSubmissionYarnUIMessage = sparkJobSubmissionYarnUIMessage;
function sparkJobSubmissionSparkHistoryLinkMessage(sparkHistoryLink) { return localize(10, null, sparkHistoryLink); }
exports.sparkJobSubmissionSparkHistoryLinkMessage = sparkJobSubmissionSparkHistoryLinkMessage;
function sparkJobSubmissionGetApplicationIdFailed(err) { return localize(11, null, err); }
exports.sparkJobSubmissionGetApplicationIdFailed = sparkJobSubmissionGetApplicationIdFailed;
function sparkJobSubmissionLocalFileNotExisted(path) { return localize(12, null, path); }
exports.sparkJobSubmissionLocalFileNotExisted = sparkJobSubmissionLocalFileNotExisted;
exports.sparkJobSubmissionNoSqlBigDataClusterFound = localize(13, null);
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/887f4e8985023602e599cf86bdb44df48bb28569/extensions/mssql/out/localizedConstants.js.map
