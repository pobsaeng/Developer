/*!--------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
/*---------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
define("vs/code/electron-browser/sharedProcess/sharedProcessMain.nls", {
	"vs/base/common/errorMessage": [
		"{0}: {1}",
		"An unknown error occurred. Please consult the log for more details.",
		"A system error occurred ({0})",
		"An unknown error occurred. Please consult the log for more details.",
		"{0} ({1} errors in total)",
		"An unknown error occurred. Please consult the log for more details."
	],
	"vs/base/common/severity": [
		"Error",
		"Warning",
		"Info"
	],
	"vs/base/node/zip": [
		"Error extracting {0}. Invalid file.",
		"Incomplete. Found {0} of {1} entries",
		"{0} not found inside zip."
	],
	"vs/platform/configuration/common/configurationRegistry": [
		"Default Configuration Overrides",
		"Configure editor settings to be overridden for {0} language.",
		"Configure editor settings to be overridden for a language.",
		"Cannot register '{0}'. This matches property pattern '\\\\[.*\\\\]$' for describing language specific editor settings. Use 'configurationDefaults' contribution.",
		"Cannot register '{0}'. This property is already registered."
	],
	"vs/platform/dialogs/common/dialogs": [
		"...1 additional file not shown",
		"...{0} additional files not shown"
	],
	"vs/platform/extensionManagement/common/extensionManagement": [
		"Extensions",
		"Preferences"
	],
	"vs/platform/extensionManagement/node/extensionGalleryService": [
		"Unable to download because the extension compatible with current version '{0}' of VS Code is not found."
	],
	"vs/platform/extensionManagement/node/extensionManagementService": [
		"Extension invalid: package.json is not a JSON file.",
		"Please restart Azure Data Studio before reinstalling {0}.",
		"A newer version of this extension is already installed. Would you like to override this with the older version?",
		"Override",
		"Cancel",
		"Marketplace is not enabled",
		"Error while removing the extension: {0}. Please Quit and Start VS Code before trying again.",
		"Only Marketplace Extensions can be reinstalled",
		"Can't install extension since it was reported to be problematic.",
		"Unable to install because, the depending extension '{0}' compatible with current version '{1}' of VS Code is not found.",
		"Unable to install the extension. Please Quit and Start VS Code before reinstalling.",
		"Unable to install the extension. Please Exit and Start VS Code before reinstalling.",
		"Unable to delete the existing folder '{0}' while installing the extension '{1}'. Please delete the folder manually and try again",
		"Unknown error while renaming {0} to {1}",
		"Also uninstall the dependencies of the extension '{0}'?",
		"Yes",
		"No",
		"Cancel",
		"Cannot uninstall extension '{0}'. Extension '{1}' depends on this.",
		"Cannot uninstall extension '{0}'. Extensions '{1}' and '{2}' depend on this.",
		"Cannot uninstall extension '{0}'. Extensions '{1}', '{2}' and others depend on this.",
		"Could not find extension"
	],
	"vs/platform/extensions/node/extensionValidator": [
		"Could not parse `engines.vscode` value {0}. Please use, for example: ^1.22.0, ^1.22.x, etc.",
		"Version specified in `engines.vscode` ({0}) is not specific enough. For vscode versions before 1.0.0, please define at a minimum the major and minor desired version. E.g. ^0.10.0, 0.10.x, 0.11.0, etc.",
		"Version specified in `engines.vscode` ({0}) is not specific enough. For vscode versions after 1.0.0, please define at a minimum the major desired version. E.g. ^1.10.0, 1.10.x, 1.x.x, 2.x.x, etc.",
		"Extension is not compatible with Code {0}. Extension requires: {1}."
	],
	"vs/platform/request/node/request": [
		"HTTP",
		"The proxy setting to use. If not set will be taken from the http_proxy and https_proxy environment variables.",
		"Controls whether the proxy server certificate should be verified against the list of supplied CAs.",
		"The value to send as the 'Proxy-Authorization' header for every network request."
	],
	"vs/platform/telemetry/common/telemetryService": [
		"Telemetry",
		"Enable usage data and errors to be sent to a Microsoft online service."
	],
	"vs/platform/workspaces/common/workspaces": [
		"Code Workspace",
		"Untitled (Workspace)",
		"{0} (Workspace)",
		"{0} (Workspace)"
	],
	"vs/workbench/common/views": [
		"A view with id '{0}' is already registered in the container '{1}'"
	]
});