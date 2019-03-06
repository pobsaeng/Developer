/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const stream_1 = require("stream");
const nls = require("vscode-nls");
const localize = nls.loadMessageBundle(__filename);
class CancelableStream extends stream_1.Transform {
    constructor(cancelationToken) {
        super();
        this.cancelationToken = cancelationToken;
    }
    _transform(chunk, encoding, callback) {
        if (this.cancelationToken && this.cancelationToken.token.isCancellationRequested) {
            callback(new Error(localize(0, null)));
        }
        else {
            this.push(chunk);
            callback();
        }
    }
}
exports.CancelableStream = CancelableStream;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/887f4e8985023602e599cf86bdb44df48bb28569/extensions/mssql/out/objectExplorerNodeProvider/cancelableStream.js.map
