/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const fspath = require("path");
const webhdfs = require("webhdfs");
const fs = require("fs");
const meter = require("stream-meter");
const bytes = require("bytes");
const https = require("https");
const readline = require("readline");
const os = require("os");
const constants = require("../constants");
const utils = require("../utils");
function joinHdfsPath(parent, child) {
    if (parent === constants.hdfsRootPath) {
        return `/${child}`;
    }
    return `${parent}/${child}`;
}
exports.joinHdfsPath = joinHdfsPath;
class File {
    constructor(path, isDirectory) {
        this.path = path;
        this.isDirectory = isDirectory;
    }
    static createPath(path, fileName) {
        return joinHdfsPath(path, fileName);
    }
    static createChild(parent, fileName, isDirectory) {
        return new File(File.createPath(parent.path, fileName), isDirectory);
    }
    static createFile(parent, fileName) {
        return File.createChild(parent, fileName, false);
    }
    static createDirectory(parent, fileName) {
        return File.createChild(parent, fileName, true);
    }
    static getBasename(file) {
        return fspath.basename(file.path);
    }
}
exports.File = File;
class FileSourceFactory {
    static get instance() {
        if (!FileSourceFactory._instance) {
            FileSourceFactory._instance = new FileSourceFactory();
        }
        return FileSourceFactory._instance;
    }
    createHdfsFileSource(options) {
        options = options && options.host ? FileSourceFactory.removePortFromHost(options) : options;
        let requestParams = options.requestParams ? options.requestParams : {};
        if (requestParams.auth) {
            // TODO Remove handling of unsigned cert once we have real certs in our Knox service
            let agentOptions = {
                host: options.host,
                port: options.port,
                path: constants.hdfsRootPath,
                rejectUnauthorized: false
            };
            let agent = new https.Agent(agentOptions);
            requestParams['agent'] = agent;
        }
        return new HdfsFileSource(webhdfs.createClient(options, requestParams));
    }
    // remove port from host when port is specified after a comma or colon
    static removePortFromHost(options) {
        // determine whether the host has either a ',' or ':' in it
        options = this.setHostAndPort(options, ',');
        options = this.setHostAndPort(options, ':');
        return options;
    }
    // set port and host correctly after we've identified that a delimiter exists in the host name
    static setHostAndPort(options, delimeter) {
        let optionsHost = options.host;
        if (options.host.indexOf(delimeter) > -1) {
            options.host = options.host.slice(0, options.host.indexOf(delimeter));
            options.port = optionsHost.replace(options.host + delimeter, '');
        }
        return options;
    }
}
exports.FileSourceFactory = FileSourceFactory;
class HdfsFileSource {
    constructor(client) {
        this.client = client;
    }
    enumerateFiles(path) {
        return new Promise((resolve, reject) => {
            this.client.readdir(path, (error, files) => {
                if (error) {
                    reject(error.message);
                }
                else {
                    let hdfsFiles = files.map(file => {
                        let hdfsFile = file;
                        return new File(File.createPath(path, hdfsFile.pathSuffix), hdfsFile.type === 'DIRECTORY');
                    });
                    resolve(hdfsFiles);
                }
            });
        });
    }
    mkdir(dirName, remoteBasePath) {
        return new Promise((resolve, reject) => {
            let remotePath = joinHdfsPath(remoteBasePath, dirName);
            this.client.mkdir(remotePath, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(undefined);
                }
            });
        });
    }
    createReadStream(path) {
        return this.client.createReadStream(path);
    }
    readFile(path, maxBytes) {
        return new Promise((resolve, reject) => {
            let remoteFileStream = this.client.createReadStream(path);
            if (maxBytes) {
                remoteFileStream = remoteFileStream.pipe(meter(maxBytes));
            }
            let data = [];
            let error = undefined;
            remoteFileStream.on('error', (err) => {
                error = err.toString();
                if (error.includes('Stream exceeded specified max')) {
                    error = `File exceeds max size of ${bytes(maxBytes)}`;
                }
                reject(error);
            });
            remoteFileStream.on('data', (chunk) => {
                data.push(chunk);
            });
            remoteFileStream.once('finish', () => {
                if (!error) {
                    resolve(Buffer.concat(data));
                }
            });
        });
    }
    readFileLines(path, maxLines) {
        return new Promise((resolve, reject) => {
            let lineReader = readline.createInterface({
                input: this.client.createReadStream(path)
            });
            let lineCount = 0;
            let lineData = [];
            let errorMsg = undefined;
            lineReader.on('line', (line) => {
                lineCount++;
                lineData.push(line);
                if (lineCount >= maxLines) {
                    resolve(Buffer.from(lineData.join(os.EOL)));
                    lineReader.close();
                }
            })
                .on('error', (err) => {
                errorMsg = utils.getErrorMessage(err);
                reject(errorMsg);
            })
                .on('close', () => {
                if (!errorMsg) {
                    resolve(Buffer.from(lineData.join(os.EOL)));
                }
            });
        });
    }
    writeFile(localFile, remoteDirPath) {
        return new Promise((resolve, reject) => {
            let fileName = fspath.basename(localFile.path);
            let remotePath = joinHdfsPath(remoteDirPath, fileName);
            let writeStream = this.client.createWriteStream(remotePath);
            let readStream = fs.createReadStream(localFile.path);
            readStream.pipe(writeStream);
            let error = undefined;
            // API always calls finish, so catch error then handle exit in the finish event
            writeStream.on('error', (err => {
                error = err;
                reject(error);
            }));
            writeStream.on('finish', (location) => {
                if (!error) {
                    resolve(location);
                }
            });
        });
    }
    delete(path, recursive = false) {
        return new Promise((resolve, reject) => {
            this.client.rmdir(path, recursive, (error) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(undefined);
                }
            });
        });
    }
    exists(path) {
        return new Promise((resolve, reject) => {
            this.client.exists(path, (result) => {
                resolve(result);
            });
        });
    }
}
exports.HdfsFileSource = HdfsFileSource;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/887f4e8985023602e599cf86bdb44df48bb28569/extensions/mssql/out/objectExplorerNodeProvider/fileSources.js.map
