/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_languageclient_1 = require("vscode-languageclient");
// --------------------------------- < Read Credential Request > -------------------------------------------------
// Read Credential request message callback declaration
var ReadCredentialRequest;
(function (ReadCredentialRequest) {
    ReadCredentialRequest.type = new vscode_languageclient_1.RequestType('credential/read');
})(ReadCredentialRequest = exports.ReadCredentialRequest || (exports.ReadCredentialRequest = {}));
// --------------------------------- </ Read Credential Request > -------------------------------------------------
// --------------------------------- < Save Credential Request > -------------------------------------------------
// Save Credential request message callback declaration
var SaveCredentialRequest;
(function (SaveCredentialRequest) {
    SaveCredentialRequest.type = new vscode_languageclient_1.RequestType('credential/save');
})(SaveCredentialRequest = exports.SaveCredentialRequest || (exports.SaveCredentialRequest = {}));
// --------------------------------- </ Save Credential Request > -------------------------------------------------
// --------------------------------- < Delete Credential Request > -------------------------------------------------
// Delete Credential request message callback declaration
var DeleteCredentialRequest;
(function (DeleteCredentialRequest) {
    DeleteCredentialRequest.type = new vscode_languageclient_1.RequestType('credential/delete');
})(DeleteCredentialRequest = exports.DeleteCredentialRequest || (exports.DeleteCredentialRequest = {}));
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/887f4e8985023602e599cf86bdb44df48bb28569/extensions/mssql/out/credentialstore/contracts.js.map
