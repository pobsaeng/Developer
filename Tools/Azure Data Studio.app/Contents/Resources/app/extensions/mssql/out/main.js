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
const vscode = require("vscode");
const sqlops = require("sqlops");
const path = require("path");
const os = require("os");
const nls = require("vscode-nls");
const localize = nls.loadMessageBundle(__filename);
const dataprotocol_client_1 = require("dataprotocol-client");
const service_downloader_1 = require("service-downloader");
const vscode_languageclient_1 = require("vscode-languageclient");
const Constants = require("./constants");
const contextProvider_1 = require("./contextProvider");
const credentialstore_1 = require("./credentialstore/credentialstore");
const resourceProvider_1 = require("./resourceProvider/resourceProvider");
const Utils = require("./utils");
const telemetry_1 = require("./telemetry");
const features_1 = require("./features");
const appContext_1 = require("./appContext");
const apiWrapper_1 = require("./apiWrapper");
const hdfsCommands_1 = require("./objectExplorerNodeProvider/hdfsCommands");
const adapter_1 = require("./prompts/adapter");
const dialogCommands_1 = require("./sparkFeature/dialog/dialogCommands");
const historyTask_1 = require("./sparkFeature/historyTask");
const objectExplorerNodeProvider_1 = require("./objectExplorerNodeProvider/objectExplorerNodeProvider");
const baseConfig = require('./config.json');
const outputChannel = vscode.window.createOutputChannel(Constants.serviceName);
const statusView = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
const jupyterNotebookProviderId = 'jupyter';
const msgSampleCodeDataFrame = localize(0, null);
let untitledCounter = 0;
function activate(context) {
    return __awaiter(this, void 0, void 0, function* () {
        // lets make sure we support this platform first
        let supported = yield Utils.verifyPlatform();
        if (!supported) {
            vscode.window.showErrorMessage('Unsupported platform');
            return;
        }
        let config = JSON.parse(JSON.stringify(baseConfig));
        config.installDirectory = path.join(__dirname, config.installDirectory);
        config.proxy = vscode.workspace.getConfiguration('http').get('proxy');
        config.strictSSL = vscode.workspace.getConfiguration('http').get('proxyStrictSSL') || true;
        const credentialsStore = new credentialstore_1.CredentialStore(config);
        const resourceProvider = new resourceProvider_1.AzureResourceProvider(config);
        let languageClient;
        const serverdownloader = new service_downloader_1.ServerProvider(config);
        serverdownloader.eventEmitter.onAny(generateHandleServerProviderEvent());
        let clientOptions = {
            documentSelector: ['sql'],
            synchronize: {
                configurationSection: Constants.extensionConfigSectionName
            },
            providerId: Constants.providerId,
            errorHandler: new telemetry_1.LanguageClientErrorHandler(),
            features: [
                // we only want to add new features
                ...dataprotocol_client_1.SqlOpsDataClient.defaultFeatures,
                features_1.TelemetryFeature,
                features_1.AgentServicesFeature,
                features_1.DacFxServicesFeature,
            ],
            outputChannel: new CustomOutputChannel()
        };
        let prompter = new adapter_1.default();
        let appContext = new appContext_1.AppContext(context, new apiWrapper_1.ApiWrapper());
        const installationStart = Date.now();
        serverdownloader.getOrDownloadServer().then(e => {
            const installationComplete = Date.now();
            let serverOptions = generateServerOptions(e);
            languageClient = new dataprotocol_client_1.SqlOpsDataClient(Constants.serviceName, serverOptions, clientOptions);
            const processStart = Date.now();
            languageClient.onReady().then(() => {
                const processEnd = Date.now();
                statusView.text = 'Service Started';
                setTimeout(() => {
                    statusView.hide();
                }, 1500);
                telemetry_1.Telemetry.sendTelemetryEvent('startup/LanguageClientStarted', {
                    installationTime: String(installationComplete - installationStart),
                    processStartupTime: String(processEnd - processStart),
                    totalTime: String(processEnd - installationStart),
                    beginningTimestamp: String(installationStart)
                });
            });
            statusView.show();
            statusView.text = 'Starting service';
            languageClient.start();
            credentialsStore.start();
            resourceProvider.start();
            let nodeProvider = new objectExplorerNodeProvider_1.MssqlObjectExplorerNodeProvider(appContext);
            sqlops.dataprotocol.registerObjectExplorerNodeProvider(nodeProvider);
            activateSparkFeatures(appContext);
            activateNotebookTask(appContext);
        }, e => {
            telemetry_1.Telemetry.sendTelemetryEvent('ServiceInitializingFailed');
            vscode.window.showErrorMessage('Failed to start Sql tools service');
        });
        let contextProvider = new contextProvider_1.default();
        context.subscriptions.push(contextProvider);
        context.subscriptions.push(credentialsStore);
        context.subscriptions.push(resourceProvider);
        context.subscriptions.push(new hdfsCommands_1.UploadFilesCommand(prompter, appContext));
        context.subscriptions.push(new hdfsCommands_1.MkDirCommand(prompter, appContext));
        context.subscriptions.push(new hdfsCommands_1.SaveFileCommand(prompter, appContext));
        context.subscriptions.push(new hdfsCommands_1.PreviewFileCommand(prompter, appContext));
        context.subscriptions.push(new hdfsCommands_1.CopyPathCommand(appContext));
        context.subscriptions.push(new hdfsCommands_1.DeleteFilesCommand(prompter, appContext));
        context.subscriptions.push({ dispose: () => languageClient.stop() });
        let api = {
            getMssqlObjectExplorerBrowser() {
                return {
                    getNode: (context) => {
                        let oeProvider = appContext.getService(Constants.ObjectExplorerService);
                        return oeProvider.findSqlClusterNodeByContext(context);
                    }
                };
            }
        };
        return api;
    });
}
exports.activate = activate;
function activateSparkFeatures(appContext) {
    let extensionContext = appContext.extensionContext;
    let apiWrapper = appContext.apiWrapper;
    let outputChannel = objectExplorerNodeProvider_1.mssqlOutputChannel;
    extensionContext.subscriptions.push(new dialogCommands_1.OpenSparkJobSubmissionDialogCommand(appContext, outputChannel));
    extensionContext.subscriptions.push(new dialogCommands_1.OpenSparkJobSubmissionDialogFromFileCommand(appContext, outputChannel));
    apiWrapper.registerTaskHandler(Constants.mssqlClusterLivySubmitSparkJobTask, (profile) => {
        new dialogCommands_1.OpenSparkJobSubmissionDialogTask(appContext, outputChannel).execute(profile);
    });
    apiWrapper.registerTaskHandler(Constants.mssqlClusterLivyOpenSparkHistory, (profile) => {
        new historyTask_1.OpenSparkYarnHistoryTask(appContext).execute(profile, true);
    });
    apiWrapper.registerTaskHandler(Constants.mssqlClusterLivyOpenYarnHistory, (profile) => {
        new historyTask_1.OpenSparkYarnHistoryTask(appContext).execute(profile, false);
    });
}
function activateNotebookTask(appContext) {
    let apiWrapper = appContext.apiWrapper;
    apiWrapper.registerTaskHandler(Constants.mssqlClusterNewNotebookTask, (profile) => {
        return saveProfileAndCreateNotebook(profile);
    });
    apiWrapper.registerTaskHandler(Constants.mssqlClusterOpenNotebookTask, (profile) => {
        return handleOpenNotebookTask(profile);
    });
}
function saveProfileAndCreateNotebook(profile) {
    return handleNewNotebookTask(undefined, profile);
}
function handleNewNotebookTask(oeContext, profile) {
    return __awaiter(this, void 0, void 0, function* () {
        // Ensure we get a unique ID for the notebook. For now we're using a different prefix to the built-in untitled files
        // to handle this. We should look into improving this in the future
        let untitledUri = vscode.Uri.parse(`untitled:Notebook-${untitledCounter++}`);
        let editor = yield sqlops.nb.showNotebookDocument(untitledUri, {
            connectionId: profile.id,
            providerId: jupyterNotebookProviderId,
            preview: false,
            defaultKernel: {
                name: 'pyspark3kernel',
                display_name: 'PySpark3',
                language: 'python'
            }
        });
        if (oeContext && oeContext.nodeInfo && oeContext.nodeInfo.nodePath) {
            // Get the file path after '/HDFS'
            let hdfsPath = oeContext.nodeInfo.nodePath.substring(oeContext.nodeInfo.nodePath.indexOf('/HDFS') + '/HDFS'.length);
            if (hdfsPath.length > 0) {
                let analyzeCommand = "#" + msgSampleCodeDataFrame + os.EOL + "df = (spark.read.option(\"inferSchema\", \"true\")"
                    + os.EOL + ".option(\"header\", \"true\")" + os.EOL + ".csv('{0}'))" + os.EOL + "df.show(10)";
                editor.edit(editBuilder => {
                    editBuilder.replace(0, {
                        cell_type: 'code',
                        source: analyzeCommand.replace('{0}', hdfsPath)
                    });
                });
            }
        }
    });
}
function handleOpenNotebookTask(profile) {
    return __awaiter(this, void 0, void 0, function* () {
        let notebookFileTypeName = localize(1, null);
        let filter = {};
        filter[notebookFileTypeName] = 'ipynb';
        let uris = yield vscode.window.showOpenDialog({
            filters: filter,
            canSelectFiles: true,
            canSelectMany: false
        });
        if (uris && uris.length > 0) {
            let fileUri = uris[0];
            // Verify this is a .ipynb file since this isn't actually filtered on Mac/Linux
            if (path.extname(fileUri.fsPath) !== '.ipynb') {
                // in the future might want additional supported types
                vscode.window.showErrorMessage(localize(2, null));
            }
            else {
                yield sqlops.nb.showNotebookDocument(fileUri, {
                    connectionId: profile.id,
                    providerId: jupyterNotebookProviderId,
                    preview: false
                });
            }
        }
    });
}
function generateServerOptions(executablePath) {
    let launchArgs = Utils.getCommonLaunchArgsAndCleanupOldLogFiles('sqltools', executablePath);
    return { command: executablePath, args: launchArgs, transport: vscode_languageclient_1.TransportKind.stdio };
}
function generateHandleServerProviderEvent() {
    let dots = 0;
    return (e, ...args) => {
        outputChannel.show();
        statusView.show();
        switch (e) {
            case "install_start" /* INSTALL_START */:
                outputChannel.appendLine(`Installing ${Constants.serviceName} service to ${args[0]}`);
                statusView.text = 'Installing Service';
                break;
            case "install_end" /* INSTALL_END */:
                outputChannel.appendLine('Installed');
                break;
            case "download_start" /* DOWNLOAD_START */:
                outputChannel.appendLine(`Downloading ${args[0]}`);
                outputChannel.append(`(${Math.ceil(args[1] / 1024)} KB)`);
                statusView.text = 'Downloading Service';
                break;
            case "download_progress" /* DOWNLOAD_PROGRESS */:
                let newDots = Math.ceil(args[0] / 5);
                if (newDots > dots) {
                    outputChannel.append('.'.repeat(newDots - dots));
                    dots = newDots;
                }
                break;
            case "download_end" /* DOWNLOAD_END */:
                outputChannel.appendLine('Done!');
                break;
        }
    };
}
// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
class CustomOutputChannel {
    append(value) {
        console.log(value);
    }
    appendLine(value) {
        console.log(value);
    }
    clear() {
    }
    show(column, preserveFocus) {
    }
    hide() {
    }
    dispose() {
    }
}
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/887f4e8985023602e599cf86bdb44df48bb28569/extensions/mssql/out/main.js.map
