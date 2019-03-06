/*!--------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
/*---------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
define("vs/workbench/node/extensionHostProcess.nls", {
	"sql/workbench/api/node/extHostModelView": [
		"Unkown component type. Must use ModelBuilder to create objects",
		"The index is invalid.",
		"Unkown component configuration, must use ModelBuilder to create a configuration object"
	],
	"sql/workbench/api/node/extHostModelViewDialog": [
		"Done",
		"Cancel",
		"Generate script",
		"Next",
		"Previous"
	],
	"sql/workbench/api/node/extHostModelViewTree": [
		"No tree view with id '{0}' registered."
	],
	"sql/workbench/api/node/extHostNotebook": [
		"A NotebookProvider with valid providerId must be passed to this method",
		"no notebook provider found",
		"No Manager found",
		"Notebook Manager for notebook {0} does not have a server manager. Cannot perform operations on it",
		"Notebook Manager for notebook {0} does not have a content manager. Cannot perform operations on it",
		"Notebook Manager for notebook {0} does not have a session manager. Cannot perform operations on it"
	],
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
	"vs/base/node/processes": [
		"Can't execute a shell command on a UNC drive."
	],
	"vs/editor/common/config/editorOptions": [
		"The editor is not accessible at this time. Press Alt+F1 for options.",
		"Editor content"
	],
	"vs/editor/common/modes/modesRegistry": [
		"Plain Text"
	],
	"vs/platform/configuration/common/configurationRegistry": [
		"Default Configuration Overrides",
		"Configure editor settings to be overridden for {0} language.",
		"Configure editor settings to be overridden for a language.",
		"Cannot register '{0}'. This matches property pattern '\\\\[.*\\\\]$' for describing language specific editor settings. Use 'configurationDefaults' contribution.",
		"Cannot register '{0}'. This property is already registered."
	],
	"vs/platform/markers/common/markers": [
		"Error",
		"Warning",
		"Info"
	],
	"vs/platform/workspaces/common/workspaces": [
		"Code Workspace",
		"Untitled (Workspace)",
		"{0} (Workspace)",
		"{0} (Workspace)"
	],
	"vs/workbench/api/node/extHostDiagnostics": [
		"Not showing {0} further errors and warnings."
	],
	"vs/workbench/api/node/extHostExtensionActivator": [
		"Extension '{1}' failed to activate. Reason: unknown dependency '{0}'.",
		"Extension '{1}' failed to activate. Reason: dependency '{0}' failed to activate.",
		"Extension '{0}' failed to activate. Reason: more than 10 levels of dependencies (most likely a dependency loop).",
		"Activating extension '{0}' failed: {1}."
	],
	"vs/workbench/api/node/extHostProgress": [
		"{0} (Extension)"
	],
	"vs/workbench/api/node/extHostTask": [
		"{0}: {1}"
	],
	"vs/workbench/api/node/extHostTreeViews": [
		"No tree view with id '{0}' registered.",
		"No tree view with id '{0}' registered.",
		"No tree view with id '{0}' registered.",
		"No tree view with id '{0}' registered.",
		"Element with id {0} is already registered"
	],
	"vs/workbench/api/node/extHostWorkspace": [
		"Extension '{0}' failed to update workspace folders: {1}"
	],
	"vs/workbench/node/extensionHostMain": [
		"Path {0} does not point to a valid extension test runner."
	]
});