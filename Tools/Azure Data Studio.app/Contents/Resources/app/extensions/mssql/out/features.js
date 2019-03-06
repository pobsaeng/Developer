/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const dataprotocol_client_1 = require("dataprotocol-client");
const telemetry_1 = require("./telemetry");
const contracts = require("./contracts");
const sqlops = require("sqlops");
const Utils = require("./utils");
const UUID = require("vscode-languageclient/lib/utils/uuid");
class TelemetryFeature {
    constructor(_client) {
        this._client = _client;
    }
    fillClientCapabilities(capabilities) {
        Utils.ensure(capabilities, 'telemetry').telemetry = true;
    }
    initialize() {
        this._client.onNotification(contracts.TelemetryNotification.type, e => {
            telemetry_1.Telemetry.sendTelemetryEvent(e.params.eventName, e.params.properties, e.params.measures);
        });
    }
}
exports.TelemetryFeature = TelemetryFeature;
class DacFxServicesFeature extends dataprotocol_client_1.SqlOpsFeature {
    constructor(client) {
        super(client, DacFxServicesFeature.messageTypes);
    }
    fillClientCapabilities(capabilities) {
    }
    initialize(capabilities) {
        this.register(this.messages, {
            id: UUID.generateUuid(),
            registerOptions: undefined
        });
    }
    registerProvider(options) {
        const client = this._client;
        let self = this;
        let exportBacpac = (databaseName, packageFilePath, ownerUri, taskExecutionMode) => {
            let params = { databaseName: databaseName, packageFilePath: packageFilePath, ownerUri: ownerUri, taskExecutionMode: taskExecutionMode };
            return client.sendRequest(contracts.ExportRequest.type, params).then(r => {
                return r;
            }, e => {
                client.logFailedRequest(contracts.ExportRequest.type, e);
                return Promise.resolve(undefined);
            });
        };
        let importBacpac = (packageFilePath, databaseName, ownerUri, taskExecutionMode) => {
            let params = { packageFilePath: packageFilePath, databaseName: databaseName, ownerUri: ownerUri, taskExecutionMode: taskExecutionMode };
            return client.sendRequest(contracts.ImportRequest.type, params).then(r => {
                return r;
            }, e => {
                client.logFailedRequest(contracts.ImportRequest.type, e);
                return Promise.resolve(undefined);
            });
        };
        let extractDacpac = (databaseName, packageFilePath, applicationName, applicationVersion, ownerUri, taskExecutionMode) => {
            let params = { databaseName: databaseName, packageFilePath: packageFilePath, applicationName: applicationName, applicationVersion: applicationVersion, ownerUri: ownerUri, taskExecutionMode: taskExecutionMode };
            return client.sendRequest(contracts.ExtractRequest.type, params).then(r => {
                return r;
            }, e => {
                client.logFailedRequest(contracts.ExtractRequest.type, e);
                return Promise.resolve(undefined);
            });
        };
        let deployDacpac = (packageFilePath, targetDatabaseName, upgradeExisting, ownerUri, taskExecutionMode) => {
            let params = { packageFilePath: packageFilePath, databaseName: targetDatabaseName, upgradeExisting: upgradeExisting, ownerUri: ownerUri, taskExecutionMode: taskExecutionMode };
            return client.sendRequest(contracts.DeployRequest.type, params).then(r => {
                return r;
            }, e => {
                client.logFailedRequest(contracts.DeployRequest.type, e);
                return Promise.resolve(undefined);
            });
        };
        let generateDeployScript = (packageFilePath, targetDatabaseName, scriptFilePath, ownerUri, taskExecutionMode) => {
            let params = { packageFilePath: packageFilePath, databaseName: targetDatabaseName, scriptFilePath: scriptFilePath, ownerUri: ownerUri, taskExecutionMode: taskExecutionMode };
            return client.sendRequest(contracts.GenerateDeployScriptRequest.type, params).then(r => {
                return r;
            }, e => {
                client.logFailedRequest(contracts.GenerateDeployScriptRequest.type, e);
                return Promise.resolve(undefined);
            });
        };
        let generateDeployPlan = (packageFilePath, targetDatabaseName, ownerUri, taskExecutionMode) => {
            let params = { packageFilePath: packageFilePath, databaseName: targetDatabaseName, ownerUri: ownerUri, taskExecutionMode: taskExecutionMode };
            return client.sendRequest(contracts.GenerateDeployPlanRequest.type, params).then(r => {
                return r;
            }, e => {
                client.logFailedRequest(contracts.GenerateDeployPlanRequest.type, e);
                return Promise.resolve(undefined);
            });
        };
        return sqlops.dataprotocol.registerDacFxServicesProvider({
            providerId: client.providerId,
            exportBacpac,
            importBacpac,
            extractDacpac,
            deployDacpac,
            generateDeployScript,
            generateDeployPlan
        });
    }
}
DacFxServicesFeature.messageTypes = [
    contracts.ExportRequest.type,
    contracts.ImportRequest.type,
    contracts.ExtractRequest.type,
    contracts.DeployRequest.type
];
exports.DacFxServicesFeature = DacFxServicesFeature;
class AgentServicesFeature extends dataprotocol_client_1.SqlOpsFeature {
    constructor(client) {
        super(client, AgentServicesFeature.messagesTypes);
    }
    fillClientCapabilities(capabilities) {
        // this isn't explicitly necessary
        // ensure(ensure(capabilities, 'connection')!, 'agentServices')!.dynamicRegistration = true;
    }
    initialize(capabilities) {
        this.register(this.messages, {
            id: UUID.generateUuid(),
            registerOptions: undefined
        });
    }
    registerProvider(options) {
        const client = this._client;
        let self = this;
        // On updated registration
        let registerOnUpdated = (handler) => {
            self.onUpdatedHandler = handler;
        };
        let fireOnUpdated = () => {
            if (self.onUpdatedHandler) {
                self.onUpdatedHandler();
            }
        };
        // Job management methods
        let getJobs = (ownerUri) => {
            let params = { ownerUri: ownerUri, jobId: null };
            return client.sendRequest(contracts.AgentJobsRequest.type, params).then(r => r, e => {
                client.logFailedRequest(contracts.AgentJobsRequest.type, e);
                return Promise.resolve(undefined);
            });
        };
        let getJobHistory = (ownerUri, jobID, jobName) => {
            let params = { ownerUri: ownerUri, jobId: jobID, jobName: jobName };
            return client.sendRequest(contracts.AgentJobHistoryRequest.type, params).then(r => r, e => {
                client.logFailedRequest(contracts.AgentJobHistoryRequest.type, e);
                return Promise.resolve(undefined);
            });
        };
        let jobAction = (ownerUri, jobName, action) => {
            let params = { ownerUri: ownerUri, jobName: jobName, action: action };
            return client.sendRequest(contracts.AgentJobActionRequest.type, params).then(r => r, e => {
                client.logFailedRequest(contracts.AgentJobActionRequest.type, e);
                return Promise.resolve(undefined);
            });
        };
        let createJob = (ownerUri, jobInfo) => {
            let params = {
                ownerUri: ownerUri,
                job: jobInfo
            };
            let requestType = contracts.CreateAgentJobRequest.type;
            return client.sendRequest(requestType, params).then(r => {
                fireOnUpdated();
                return r;
            }, e => {
                client.logFailedRequest(requestType, e);
                return Promise.resolve(undefined);
            });
        };
        let updateJob = (ownerUri, originalJobName, jobInfo) => {
            let params = {
                ownerUri: ownerUri,
                originalJobName: originalJobName,
                job: jobInfo
            };
            let requestType = contracts.UpdateAgentJobRequest.type;
            return client.sendRequest(requestType, params).then(r => {
                fireOnUpdated();
                return r;
            }, e => {
                client.logFailedRequest(requestType, e);
                return Promise.resolve(undefined);
            });
        };
        let deleteJob = (ownerUri, jobInfo) => {
            let params = {
                ownerUri: ownerUri,
                job: jobInfo
            };
            let requestType = contracts.DeleteAgentJobRequest.type;
            return client.sendRequest(requestType, params).then(r => {
                fireOnUpdated();
                return r;
            }, e => {
                client.logFailedRequest(requestType, e);
                return Promise.resolve(undefined);
            });
        };
        let getJobDefaults = (ownerUri) => {
            let params = {
                ownerUri: ownerUri
            };
            let requestType = contracts.AgentJobDefaultsRequest.type;
            return client.sendRequest(requestType, params).then(r => r, e => {
                client.logFailedRequest(requestType, e);
                return Promise.resolve(undefined);
            });
        };
        // Job Step management methods
        let createJobStep = (ownerUri, stepInfo) => {
            let params = {
                ownerUri: ownerUri,
                step: stepInfo
            };
            let requestType = contracts.CreateAgentJobStepRequest.type;
            return client.sendRequest(requestType, params).then(r => {
                fireOnUpdated();
                return r;
            }, e => {
                client.logFailedRequest(requestType, e);
                return Promise.resolve(undefined);
            });
        };
        let updateJobStep = (ownerUri, originalJobStepName, stepInfo) => {
            let params = {
                ownerUri: ownerUri,
                originalJobStepName: originalJobStepName,
                step: stepInfo
            };
            let requestType = contracts.UpdateAgentJobStepRequest.type;
            return client.sendRequest(requestType, params).then(r => {
                fireOnUpdated();
                return r;
            }, e => {
                client.logFailedRequest(requestType, e);
                return Promise.resolve(undefined);
            });
        };
        let deleteJobStep = (ownerUri, stepInfo) => {
            let params = {
                ownerUri: ownerUri,
                step: stepInfo
            };
            let requestType = contracts.DeleteAgentJobStepRequest.type;
            return client.sendRequest(requestType, params).then(r => {
                fireOnUpdated();
                return r;
            }, e => {
                client.logFailedRequest(requestType, e);
                return Promise.resolve(undefined);
            });
        };
        // Alert management methods
        let getAlerts = (ownerUri) => {
            let params = {
                ownerUri: ownerUri
            };
            let requestType = contracts.AgentAlertsRequest.type;
            return client.sendRequest(requestType, params).then(r => r, e => {
                client.logFailedRequest(requestType, e);
                return Promise.resolve(undefined);
            });
        };
        let createAlert = (ownerUri, alertInfo) => {
            let params = {
                ownerUri: ownerUri,
                alert: alertInfo
            };
            let requestType = contracts.CreateAgentAlertRequest.type;
            return client.sendRequest(requestType, params).then(r => {
                fireOnUpdated();
                return r;
            }, e => {
                client.logFailedRequest(requestType, e);
                return Promise.resolve(undefined);
            });
        };
        let updateAlert = (ownerUri, originalAlertName, alertInfo) => {
            let params = {
                ownerUri: ownerUri,
                originalAlertName: originalAlertName,
                alert: alertInfo
            };
            let requestType = contracts.UpdateAgentAlertRequest.type;
            return client.sendRequest(requestType, params).then(r => {
                fireOnUpdated();
                return r;
            }, e => {
                client.logFailedRequest(requestType, e);
                return Promise.resolve(undefined);
            });
        };
        let deleteAlert = (ownerUri, alertInfo) => {
            let params = {
                ownerUri: ownerUri,
                alert: alertInfo
            };
            let requestType = contracts.DeleteAgentAlertRequest.type;
            return client.sendRequest(requestType, params).then(r => {
                fireOnUpdated();
                return r;
            }, e => {
                client.logFailedRequest(requestType, e);
                return Promise.resolve(undefined);
            });
        };
        // Operator management methods
        let getOperators = (ownerUri) => {
            let params = {
                ownerUri: ownerUri
            };
            let requestType = contracts.AgentOperatorsRequest.type;
            return client.sendRequest(requestType, params).then(r => r, e => {
                client.logFailedRequest(requestType, e);
                return Promise.resolve(undefined);
            });
        };
        let createOperator = (ownerUri, operatorInfo) => {
            let params = {
                ownerUri: ownerUri,
                operator: operatorInfo
            };
            let requestType = contracts.CreateAgentOperatorRequest.type;
            return client.sendRequest(requestType, params).then(r => {
                fireOnUpdated();
                return r;
            }, e => {
                client.logFailedRequest(requestType, e);
                return Promise.resolve(undefined);
            });
        };
        let updateOperator = (ownerUri, originalOperatorName, operatorInfo) => {
            let params = {
                ownerUri: ownerUri,
                originalOperatorName: originalOperatorName,
                operator: operatorInfo
            };
            let requestType = contracts.UpdateAgentOperatorRequest.type;
            return client.sendRequest(requestType, params).then(r => {
                fireOnUpdated();
                return r;
            }, e => {
                client.logFailedRequest(requestType, e);
                return Promise.resolve(undefined);
            });
        };
        let deleteOperator = (ownerUri, operatorInfo) => {
            let params = {
                ownerUri: ownerUri,
                operator: operatorInfo
            };
            let requestType = contracts.DeleteAgentOperatorRequest.type;
            return client.sendRequest(requestType, params).then(r => {
                fireOnUpdated();
                return r;
            }, e => {
                client.logFailedRequest(requestType, e);
                return Promise.resolve(undefined);
            });
        };
        // Proxy management methods
        let getProxies = (ownerUri) => {
            let params = {
                ownerUri: ownerUri
            };
            let requestType = contracts.AgentProxiesRequest.type;
            return client.sendRequest(requestType, params).then(r => r, e => {
                client.logFailedRequest(requestType, e);
                return Promise.resolve(undefined);
            });
        };
        let createProxy = (ownerUri, proxyInfo) => {
            let params = {
                ownerUri: ownerUri,
                proxy: proxyInfo
            };
            let requestType = contracts.CreateAgentProxyRequest.type;
            return client.sendRequest(requestType, params).then(r => {
                fireOnUpdated();
                return r;
            }, e => {
                client.logFailedRequest(requestType, e);
                return Promise.resolve(undefined);
            });
        };
        let updateProxy = (ownerUri, originalProxyName, proxyInfo) => {
            let params = {
                ownerUri: ownerUri,
                originalProxyName: originalProxyName,
                proxy: proxyInfo
            };
            let requestType = contracts.UpdateAgentProxyRequest.type;
            return client.sendRequest(requestType, params).then(r => {
                fireOnUpdated();
                return r;
            }, e => {
                client.logFailedRequest(requestType, e);
                return Promise.resolve(undefined);
            });
        };
        let deleteProxy = (ownerUri, proxyInfo) => {
            let params = {
                ownerUri: ownerUri,
                proxy: proxyInfo
            };
            let requestType = contracts.DeleteAgentProxyRequest.type;
            return client.sendRequest(requestType, params).then(r => {
                fireOnUpdated();
                return r;
            }, e => {
                client.logFailedRequest(requestType, e);
                return Promise.resolve(undefined);
            });
        };
        // Agent Credential Method
        let getCredentials = (ownerUri) => {
            let params = {
                ownerUri: ownerUri
            };
            let requestType = contracts.AgentCredentialsRequest.type;
            return client.sendRequest(requestType, params).then(r => r, e => {
                client.logFailedRequest(requestType, e);
                return Promise.resolve(undefined);
            });
        };
        // Job Schedule management methods
        let getJobSchedules = (ownerUri) => {
            let params = {
                ownerUri: ownerUri
            };
            let requestType = contracts.AgentJobSchedulesRequest.type;
            return client.sendRequest(requestType, params).then(r => r, e => {
                client.logFailedRequest(requestType, e);
                return Promise.resolve(undefined);
            });
        };
        let createJobSchedule = (ownerUri, scheduleInfo) => {
            let params = {
                ownerUri: ownerUri,
                schedule: scheduleInfo
            };
            let requestType = contracts.CreateAgentJobScheduleRequest.type;
            return client.sendRequest(requestType, params).then(r => {
                fireOnUpdated();
                return r;
            }, e => {
                client.logFailedRequest(requestType, e);
                return Promise.resolve(undefined);
            });
        };
        let updateJobSchedule = (ownerUri, originalScheduleName, scheduleInfo) => {
            let params = {
                ownerUri: ownerUri,
                originalScheduleName: originalScheduleName,
                schedule: scheduleInfo
            };
            let requestType = contracts.UpdateAgentJobScheduleRequest.type;
            return client.sendRequest(requestType, params).then(r => {
                fireOnUpdated();
                return r;
            }, e => {
                client.logFailedRequest(requestType, e);
                return Promise.resolve(undefined);
            });
        };
        let deleteJobSchedule = (ownerUri, scheduleInfo) => {
            let params = {
                ownerUri: ownerUri,
                schedule: scheduleInfo
            };
            let requestType = contracts.DeleteAgentJobScheduleRequest.type;
            return client.sendRequest(requestType, params).then(r => {
                fireOnUpdated();
                return r;
            }, e => {
                client.logFailedRequest(requestType, e);
                return Promise.resolve(undefined);
            });
        };
        return sqlops.dataprotocol.registerAgentServicesProvider({
            providerId: client.providerId,
            getJobs,
            getJobHistory,
            jobAction,
            createJob,
            updateJob,
            deleteJob,
            getJobDefaults,
            createJobStep,
            updateJobStep,
            deleteJobStep,
            getAlerts,
            createAlert,
            updateAlert,
            deleteAlert,
            getOperators,
            createOperator,
            updateOperator,
            deleteOperator,
            getProxies,
            createProxy,
            updateProxy,
            deleteProxy,
            getCredentials,
            getJobSchedules,
            createJobSchedule,
            updateJobSchedule,
            deleteJobSchedule,
            registerOnUpdated
        });
    }
}
AgentServicesFeature.messagesTypes = [
    contracts.AgentJobsRequest.type,
    contracts.AgentJobHistoryRequest.type,
    contracts.AgentJobActionRequest.type
];
exports.AgentServicesFeature = AgentServicesFeature;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/887f4e8985023602e599cf86bdb44df48bb28569/extensions/mssql/out/features.js.map
