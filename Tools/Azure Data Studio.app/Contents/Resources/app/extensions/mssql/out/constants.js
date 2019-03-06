/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceName = 'SqlToolsService';
exports.providerId = 'MSSQL';
exports.serviceCrashMessage = 'SQL Tools Service component exited unexpectedly. Please restart Azure Data Studio.';
exports.serviceCrashButton = 'View Known Issues';
exports.serviceCrashLink = 'https://github.com/Microsoft/vscode-mssql/wiki/SqlToolsService-Known-Issues';
exports.extensionConfigSectionName = 'mssql';
// DATA PROTOCOL VALUES ///////////////////////////////////////////////////////////
exports.mssqlClusterProviderName = 'mssqlCluster';
exports.hadoopKnoxEndpointName = 'Knox';
exports.protocolVersion = '1.0';
exports.hostPropName = 'host';
exports.userPropName = 'user';
exports.knoxPortPropName = 'knoxport';
exports.passwordPropName = 'password';
exports.groupIdPropName = 'groupId';
exports.defaultKnoxPort = '30443';
exports.groupIdName = 'groupId';
exports.sqlProviderName = 'MSSQL';
exports.dataService = 'Data Services';
exports.hdfsHost = 'host';
exports.hdfsUser = 'user';
exports.UNTITLED_SCHEMA = 'untitled';
exports.hadoopConnectionTimeoutSeconds = 15;
exports.hdfsRootPath = '/';
exports.clusterEndpointsProperty = 'clusterEndpoints';
exports.isBigDataClusterProperty = 'isBigDataCluster';
// SERVICE NAMES //////////////////////////////////////////////////////////
exports.ObjectExplorerService = 'objectexplorer';
exports.objectExplorerPrefix = 'objectexplorer://';
exports.ViewType = 'view';
var BuiltInCommands;
(function (BuiltInCommands) {
    BuiltInCommands["SetContext"] = "setContext";
})(BuiltInCommands = exports.BuiltInCommands || (exports.BuiltInCommands = {}));
var CommandContext;
(function (CommandContext) {
    CommandContext["WizardServiceEnabled"] = "wizardservice:enabled";
})(CommandContext = exports.CommandContext || (exports.CommandContext = {}));
var MssqlClusterItems;
(function (MssqlClusterItems) {
    MssqlClusterItems["Connection"] = "mssqlCluster:connection";
    MssqlClusterItems["Folder"] = "mssqlCluster:folder";
    MssqlClusterItems["File"] = "mssqlCluster:file";
    MssqlClusterItems["Error"] = "mssqlCluster:error";
})(MssqlClusterItems = exports.MssqlClusterItems || (exports.MssqlClusterItems = {}));
var MssqlClusterItemsSubType;
(function (MssqlClusterItemsSubType) {
    MssqlClusterItemsSubType["Spark"] = "mssqlCluster:spark";
})(MssqlClusterItemsSubType = exports.MssqlClusterItemsSubType || (exports.MssqlClusterItemsSubType = {}));
// SPARK JOB SUBMISSION //////////////////////////////////////////////////////////
exports.mssqlClusterNewNotebookTask = 'mssqlCluster.task.newNotebook';
exports.mssqlClusterOpenNotebookTask = 'mssqlCluster.task.openNotebook';
exports.mssqlClusterLivySubmitSparkJobCommand = 'mssqlCluster.livy.cmd.submitSparkJob';
exports.mssqlClusterLivySubmitSparkJobFromFileCommand = 'mssqlCluster.livy.cmd.submitFileToSparkJob';
exports.mssqlClusterLivySubmitSparkJobTask = 'mssqlCluster.livy.task.submitSparkJob';
exports.mssqlClusterLivyOpenSparkHistory = 'mssqlCluster.livy.task.openSparkHistory';
exports.mssqlClusterLivyOpenYarnHistory = 'mssqlCluster.livy.task.openYarnHistory';
exports.mssqlClusterLivySubmitPath = '/gateway/default/livy/v1/batches';
exports.mssqlClusterLivyTimeInMSForCheckYarnApp = 1000;
exports.mssqlClusterLivyRetryTimesForCheckYarnApp = 20;
exports.mssqlClusterSparkJobFileSelectorButtonWidth = '30px';
exports.mssqlClusterSparkJobFileSelectorButtonHeight = '30px';
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/887f4e8985023602e599cf86bdb44df48bb28569/extensions/mssql/out/constants.js.map
