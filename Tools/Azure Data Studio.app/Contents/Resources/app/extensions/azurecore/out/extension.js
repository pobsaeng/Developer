'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const os = require("os");
const constants = require("./constants");
const azureResourceController_1 = require("./controllers/azureResourceController");
const appContext_1 = require("./appContext");
const apiWrapper_1 = require("./apiWrapper");
const azureAccountProviderService_1 = require("./account-provider/azureAccountProviderService");
const databaseServerProvider_1 = require("./azureResource/providers/databaseServer/databaseServerProvider");
const databaseServerService_1 = require("./azureResource/providers/databaseServer/databaseServerService");
const databaseProvider_1 = require("./azureResource/providers/database/databaseProvider");
const databaseService_1 = require("./azureResource/providers/database/databaseService");
let controllers = [];
// The function is a duplicate of \src\paths.js. IT would be better to import path.js but it doesn't
// work for now because the extension is running in different process.
function getAppDataPath() {
    var platform = process.platform;
    switch (platform) {
        case 'win32': return process.env['APPDATA'] || path.join(process.env['USERPROFILE'], 'AppData', 'Roaming');
        case 'darwin': return path.join(os.homedir(), 'Library', 'Application Support');
        case 'linux': return process.env['XDG_CONFIG_HOME'] || path.join(os.homedir(), '.config');
        default: throw new Error('Platform not supported');
    }
}
exports.getAppDataPath = getAppDataPath;
function getDefaultLogLocation() {
    return path.join(getAppDataPath(), 'azuredatastudio');
}
exports.getDefaultLogLocation = getDefaultLogLocation;
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(extensionContext) {
    const apiWrapper = new apiWrapper_1.ApiWrapper();
    let appContext = new appContext_1.AppContext(extensionContext, apiWrapper);
    let activations = [];
    // Create the folder for storing the token caches
    let storagePath = path.join(getDefaultLogLocation(), constants.extensionName);
    try {
        if (!fs.existsSync(storagePath)) {
            fs.mkdirSync(storagePath);
            console.log('Initialized Azure account extension storage.');
        }
    }
    catch (e) {
        console.error(`Initialization of Azure account extension storage failed: ${e}`);
        console.error('Azure accounts will not be available');
        return;
    }
    // Create the provider service and activate
    const accountProviderService = new azureAccountProviderService_1.AzureAccountProviderService(extensionContext, storagePath);
    extensionContext.subscriptions.push(accountProviderService);
    accountProviderService.activate();
    const azureResourceController = new azureResourceController_1.default(appContext);
    controllers.push(azureResourceController);
    extensionContext.subscriptions.push(azureResourceController);
    activations.push(azureResourceController.activate());
    return {
        provideResources() {
            return [
                new databaseServerProvider_1.AzureResourceDatabaseServerProvider(new databaseServerService_1.AzureResourceDatabaseServerService(), apiWrapper, extensionContext),
                new databaseProvider_1.AzureResourceDatabaseProvider(new databaseService_1.AzureResourceDatabaseService(), apiWrapper, extensionContext)
            ];
        }
    };
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
    for (let controller of controllers) {
        controller.deactivate();
    }
}
exports.deactivate = deactivate;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/887f4e8985023602e599cf86bdb44df48bb28569/extensions/azurecore/out/extension.js.map
