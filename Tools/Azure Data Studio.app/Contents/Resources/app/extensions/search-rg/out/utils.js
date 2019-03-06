/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var vscode = require("vscode");
function fixDriveC(_path) {
    var root = path.parse(_path).root;
    return root.toLowerCase() === 'c:/' ?
        _path.replace(/^c:[/\\]/i, '/') :
        _path;
}
exports.fixDriveC = fixDriveC;
function anchorGlob(glob) {
    return glob.startsWith('**') || glob.startsWith('/') ? glob : "/" + glob;
}
exports.anchorGlob = anchorGlob;
function joinPath(resource, pathFragment) {
    var joinedPath = path.join(resource.fsPath || '/', pathFragment);
    return vscode.Uri.file(joinedPath);
}
exports.joinPath = joinPath;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/887f4e8985023602e599cf86bdb44df48bb28569/extensions/search-rg/out/utils.js.map
