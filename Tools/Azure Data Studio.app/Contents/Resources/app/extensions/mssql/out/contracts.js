/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_languageclient_1 = require("vscode-languageclient");
// ------------------------------- < Telemetry Sent Event > ------------------------------------
/**
 * Event sent when the language service send a telemetry event
 */
var TelemetryNotification;
(function (TelemetryNotification) {
    TelemetryNotification.type = new vscode_languageclient_1.NotificationType('telemetry/sqlevent');
})(TelemetryNotification = exports.TelemetryNotification || (exports.TelemetryNotification = {}));
/**
 * Update event parameters
 */
class TelemetryParams {
}
exports.TelemetryParams = TelemetryParams;
// Agent Job management requests
var AgentJobsRequest;
(function (AgentJobsRequest) {
    AgentJobsRequest.type = new vscode_languageclient_1.RequestType('agent/jobs');
})(AgentJobsRequest = exports.AgentJobsRequest || (exports.AgentJobsRequest = {}));
var AgentJobHistoryRequest;
(function (AgentJobHistoryRequest) {
    AgentJobHistoryRequest.type = new vscode_languageclient_1.RequestType('agent/jobhistory');
})(AgentJobHistoryRequest = exports.AgentJobHistoryRequest || (exports.AgentJobHistoryRequest = {}));
var AgentJobActionRequest;
(function (AgentJobActionRequest) {
    AgentJobActionRequest.type = new vscode_languageclient_1.RequestType('agent/jobaction');
})(AgentJobActionRequest = exports.AgentJobActionRequest || (exports.AgentJobActionRequest = {}));
var CreateAgentJobRequest;
(function (CreateAgentJobRequest) {
    CreateAgentJobRequest.type = new vscode_languageclient_1.RequestType('agent/createjob');
})(CreateAgentJobRequest = exports.CreateAgentJobRequest || (exports.CreateAgentJobRequest = {}));
var UpdateAgentJobRequest;
(function (UpdateAgentJobRequest) {
    UpdateAgentJobRequest.type = new vscode_languageclient_1.RequestType('agent/updatejob');
})(UpdateAgentJobRequest = exports.UpdateAgentJobRequest || (exports.UpdateAgentJobRequest = {}));
var DeleteAgentJobRequest;
(function (DeleteAgentJobRequest) {
    DeleteAgentJobRequest.type = new vscode_languageclient_1.RequestType('agent/deletejob');
})(DeleteAgentJobRequest = exports.DeleteAgentJobRequest || (exports.DeleteAgentJobRequest = {}));
var AgentJobDefaultsRequest;
(function (AgentJobDefaultsRequest) {
    AgentJobDefaultsRequest.type = new vscode_languageclient_1.RequestType('agent/jobdefaults');
})(AgentJobDefaultsRequest = exports.AgentJobDefaultsRequest || (exports.AgentJobDefaultsRequest = {}));
// Job Step requests
var CreateAgentJobStepRequest;
(function (CreateAgentJobStepRequest) {
    CreateAgentJobStepRequest.type = new vscode_languageclient_1.RequestType('agent/createjobstep');
})(CreateAgentJobStepRequest = exports.CreateAgentJobStepRequest || (exports.CreateAgentJobStepRequest = {}));
var UpdateAgentJobStepRequest;
(function (UpdateAgentJobStepRequest) {
    UpdateAgentJobStepRequest.type = new vscode_languageclient_1.RequestType('agent/updatejobstep');
})(UpdateAgentJobStepRequest = exports.UpdateAgentJobStepRequest || (exports.UpdateAgentJobStepRequest = {}));
var DeleteAgentJobStepRequest;
(function (DeleteAgentJobStepRequest) {
    DeleteAgentJobStepRequest.type = new vscode_languageclient_1.RequestType('agent/deletejobstep');
})(DeleteAgentJobStepRequest = exports.DeleteAgentJobStepRequest || (exports.DeleteAgentJobStepRequest = {}));
// Alerts requests
var AgentAlertsRequest;
(function (AgentAlertsRequest) {
    AgentAlertsRequest.type = new vscode_languageclient_1.RequestType('agent/alerts');
})(AgentAlertsRequest = exports.AgentAlertsRequest || (exports.AgentAlertsRequest = {}));
var CreateAgentAlertRequest;
(function (CreateAgentAlertRequest) {
    CreateAgentAlertRequest.type = new vscode_languageclient_1.RequestType('agent/createalert');
})(CreateAgentAlertRequest = exports.CreateAgentAlertRequest || (exports.CreateAgentAlertRequest = {}));
var UpdateAgentAlertRequest;
(function (UpdateAgentAlertRequest) {
    UpdateAgentAlertRequest.type = new vscode_languageclient_1.RequestType('agent/updatealert');
})(UpdateAgentAlertRequest = exports.UpdateAgentAlertRequest || (exports.UpdateAgentAlertRequest = {}));
var DeleteAgentAlertRequest;
(function (DeleteAgentAlertRequest) {
    DeleteAgentAlertRequest.type = new vscode_languageclient_1.RequestType('agent/deletealert');
})(DeleteAgentAlertRequest = exports.DeleteAgentAlertRequest || (exports.DeleteAgentAlertRequest = {}));
// Operators requests
var AgentOperatorsRequest;
(function (AgentOperatorsRequest) {
    AgentOperatorsRequest.type = new vscode_languageclient_1.RequestType('agent/operators');
})(AgentOperatorsRequest = exports.AgentOperatorsRequest || (exports.AgentOperatorsRequest = {}));
var CreateAgentOperatorRequest;
(function (CreateAgentOperatorRequest) {
    CreateAgentOperatorRequest.type = new vscode_languageclient_1.RequestType('agent/createoperator');
})(CreateAgentOperatorRequest = exports.CreateAgentOperatorRequest || (exports.CreateAgentOperatorRequest = {}));
var UpdateAgentOperatorRequest;
(function (UpdateAgentOperatorRequest) {
    UpdateAgentOperatorRequest.type = new vscode_languageclient_1.RequestType('agent/updateoperator');
})(UpdateAgentOperatorRequest = exports.UpdateAgentOperatorRequest || (exports.UpdateAgentOperatorRequest = {}));
var DeleteAgentOperatorRequest;
(function (DeleteAgentOperatorRequest) {
    DeleteAgentOperatorRequest.type = new vscode_languageclient_1.RequestType('agent/deleteoperator');
})(DeleteAgentOperatorRequest = exports.DeleteAgentOperatorRequest || (exports.DeleteAgentOperatorRequest = {}));
// Proxies requests
var AgentProxiesRequest;
(function (AgentProxiesRequest) {
    AgentProxiesRequest.type = new vscode_languageclient_1.RequestType('agent/proxies');
})(AgentProxiesRequest = exports.AgentProxiesRequest || (exports.AgentProxiesRequest = {}));
var CreateAgentProxyRequest;
(function (CreateAgentProxyRequest) {
    CreateAgentProxyRequest.type = new vscode_languageclient_1.RequestType('agent/createproxy');
})(CreateAgentProxyRequest = exports.CreateAgentProxyRequest || (exports.CreateAgentProxyRequest = {}));
var UpdateAgentProxyRequest;
(function (UpdateAgentProxyRequest) {
    UpdateAgentProxyRequest.type = new vscode_languageclient_1.RequestType('agent/updateproxy');
})(UpdateAgentProxyRequest = exports.UpdateAgentProxyRequest || (exports.UpdateAgentProxyRequest = {}));
var DeleteAgentProxyRequest;
(function (DeleteAgentProxyRequest) {
    DeleteAgentProxyRequest.type = new vscode_languageclient_1.RequestType('agent/deleteproxy');
})(DeleteAgentProxyRequest = exports.DeleteAgentProxyRequest || (exports.DeleteAgentProxyRequest = {}));
// Agent Credentials request
var AgentCredentialsRequest;
(function (AgentCredentialsRequest) {
    AgentCredentialsRequest.type = new vscode_languageclient_1.RequestType('security/credentials');
})(AgentCredentialsRequest = exports.AgentCredentialsRequest || (exports.AgentCredentialsRequest = {}));
// Job Schedules requests
var AgentJobSchedulesRequest;
(function (AgentJobSchedulesRequest) {
    AgentJobSchedulesRequest.type = new vscode_languageclient_1.RequestType('agent/schedules');
})(AgentJobSchedulesRequest = exports.AgentJobSchedulesRequest || (exports.AgentJobSchedulesRequest = {}));
var CreateAgentJobScheduleRequest;
(function (CreateAgentJobScheduleRequest) {
    CreateAgentJobScheduleRequest.type = new vscode_languageclient_1.RequestType('agent/createschedule');
})(CreateAgentJobScheduleRequest = exports.CreateAgentJobScheduleRequest || (exports.CreateAgentJobScheduleRequest = {}));
var UpdateAgentJobScheduleRequest;
(function (UpdateAgentJobScheduleRequest) {
    UpdateAgentJobScheduleRequest.type = new vscode_languageclient_1.RequestType('agent/updateschedule');
})(UpdateAgentJobScheduleRequest = exports.UpdateAgentJobScheduleRequest || (exports.UpdateAgentJobScheduleRequest = {}));
var DeleteAgentJobScheduleRequest;
(function (DeleteAgentJobScheduleRequest) {
    DeleteAgentJobScheduleRequest.type = new vscode_languageclient_1.RequestType('agent/deleteschedule');
})(DeleteAgentJobScheduleRequest = exports.DeleteAgentJobScheduleRequest || (exports.DeleteAgentJobScheduleRequest = {}));
// ------------------------------- < Agent Management > ------------------------------------
// ------------------------------- < DacFx > ------------------------------------
var TaskExecutionMode;
(function (TaskExecutionMode) {
    TaskExecutionMode[TaskExecutionMode["execute"] = 0] = "execute";
    TaskExecutionMode[TaskExecutionMode["script"] = 1] = "script";
    TaskExecutionMode[TaskExecutionMode["executeAndScript"] = 2] = "executeAndScript";
})(TaskExecutionMode = exports.TaskExecutionMode || (exports.TaskExecutionMode = {}));
var ExportRequest;
(function (ExportRequest) {
    ExportRequest.type = new vscode_languageclient_1.RequestType('dacfx/export');
})(ExportRequest = exports.ExportRequest || (exports.ExportRequest = {}));
var ImportRequest;
(function (ImportRequest) {
    ImportRequest.type = new vscode_languageclient_1.RequestType('dacfx/import');
})(ImportRequest = exports.ImportRequest || (exports.ImportRequest = {}));
var ExtractRequest;
(function (ExtractRequest) {
    ExtractRequest.type = new vscode_languageclient_1.RequestType('dacfx/extract');
})(ExtractRequest = exports.ExtractRequest || (exports.ExtractRequest = {}));
var DeployRequest;
(function (DeployRequest) {
    DeployRequest.type = new vscode_languageclient_1.RequestType('dacfx/deploy');
})(DeployRequest = exports.DeployRequest || (exports.DeployRequest = {}));
var GenerateDeployScriptRequest;
(function (GenerateDeployScriptRequest) {
    GenerateDeployScriptRequest.type = new vscode_languageclient_1.RequestType('dacfx/generateDeploymentScript');
})(GenerateDeployScriptRequest = exports.GenerateDeployScriptRequest || (exports.GenerateDeployScriptRequest = {}));
var GenerateDeployPlanRequest;
(function (GenerateDeployPlanRequest) {
    GenerateDeployPlanRequest.type = new vscode_languageclient_1.RequestType('dacfx/generateDeployPlan');
})(GenerateDeployPlanRequest = exports.GenerateDeployPlanRequest || (exports.GenerateDeployPlanRequest = {}));
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/887f4e8985023602e599cf86bdb44df48bb28569/extensions/mssql/out/contracts.js.map
