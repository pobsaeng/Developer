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
const fspath = require("path");
const fs = require("fs");
const nls = require("vscode-nls");
const localize = nls.loadMessageBundle(__filename);
const Constants = require("../constants");
const fileSources_1 = require("./fileSources");
const cancelableStream_1 = require("./cancelableStream");
const treeNodes_1 = require("./treeNodes");
const utils = require("../utils");
class TreeDataContext {
    constructor(extensionContext, changeHandler) {
        this.extensionContext = extensionContext;
        this.changeHandler = changeHandler;
    }
}
exports.TreeDataContext = TreeDataContext;
class HdfsProvider {
    constructor(extensionContext, vscodeApi) {
        this.vscodeApi = vscodeApi;
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.connections = [];
        this.context = new TreeDataContext(extensionContext, this);
    }
    get onDidChangeTreeData() {
        return this._onDidChangeTreeData.event;
    }
    getTreeItem(element) {
        return element.getTreeItem();
    }
    getChildren(element) {
        if (element) {
            return element.getChildren(false);
        }
        else {
            return this.connections.length > 0 ? this.connections : [ErrorNode.create(HdfsProvider.NoConnectionsMessage, element)];
        }
    }
    addConnection(displayName, fileSource) {
        if (!this.connections.find(c => c.getDisplayName() === displayName)) {
            this.connections.push(new ConnectionNode(this.context, displayName, fileSource));
            this._onDidChangeTreeData.fire();
        }
    }
    addHdfsConnection(options) {
        let displayName = `${options.user}@${options.host}:${options.port}`;
        let fileSource = fileSources_1.FileSourceFactory.instance.createHdfsFileSource(options);
        this.addConnection(displayName, fileSource);
    }
    notifyNodeChanged(node) {
        this._onDidChangeTreeData.fire(node);
    }
}
HdfsProvider.NoConnectionsMessage = 'No connections added';
HdfsProvider.ConnectionsLabel = 'Connections';
exports.HdfsProvider = HdfsProvider;
class HdfsFileSourceNode extends treeNodes_1.TreeNode {
    constructor(context, _path, fileSource) {
        super();
        this.context = context;
        this._path = _path;
        this.fileSource = fileSource;
    }
    get hdfsPath() {
        return this._path;
    }
    get nodePathValue() {
        return this.getDisplayName();
    }
    getDisplayName() {
        return fspath.basename(this._path);
    }
    delete(recursive = false) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.fileSource.delete(this.hdfsPath, recursive);
            // Notify parent should be updated. If at top, will return undefined which will refresh whole tree
            this.parent.onChildRemoved();
            this.context.changeHandler.notifyNodeChanged(this.parent);
        });
    }
}
exports.HdfsFileSourceNode = HdfsFileSourceNode;
class FolderNode extends HdfsFileSourceNode {
    constructor(context, path, fileSource, nodeType) {
        super(context, path, fileSource);
        this._nodeType = nodeType ? nodeType : Constants.MssqlClusterItems.Folder;
    }
    ensureChildrenExist() {
        if (!this.children) {
            this.children = [];
        }
    }
    onChildRemoved() {
        this.children = undefined;
    }
    getChildren(refreshChildren) {
        return __awaiter(this, void 0, void 0, function* () {
            if (refreshChildren || !this.children) {
                this.ensureChildrenExist();
                try {
                    let files = yield this.fileSource.enumerateFiles(this._path);
                    if (files) {
                        // Note: for now, assuming HDFS-provided sorting is sufficient
                        this.children = files.map((file) => {
                            let node = file.isDirectory ? new FolderNode(this.context, file.path, this.fileSource)
                                : new FileNode(this.context, file.path, this.fileSource);
                            node.parent = this;
                            return node;
                        });
                    }
                }
                catch (error) {
                    this.children = [ErrorNode.create(localize(0, null, utils.getErrorMessage(error)), this)];
                }
            }
            return this.children;
        });
    }
    getTreeItem() {
        let item = new vscode.TreeItem(this.getDisplayName(), vscode.TreeItemCollapsibleState.Collapsed);
        // For now, folder always looks the same. We're using SQL icons to differentiate remote vs local files
        item.iconPath = {
            dark: this.context.extensionContext.asAbsolutePath('resources/light/Folder.svg'),
            light: this.context.extensionContext.asAbsolutePath('resources/light/Folder.svg')
        };
        item.contextValue = this._nodeType;
        return item;
    }
    getNodeInfo() {
        // TODO handle error message case by returning it in the OE API
        // TODO support better mapping of node type
        let nodeInfo = {
            label: this.getDisplayName(),
            isLeaf: false,
            errorMessage: undefined,
            metadata: undefined,
            nodePath: this.generateNodePath(),
            nodeStatus: undefined,
            nodeType: this._nodeType,
            nodeSubType: undefined,
            iconType: 'Folder'
        };
        return nodeInfo;
    }
    writeFile(localFile) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.runChildAddAction(() => this.writeFileAsync(localFile));
        });
    }
    writeFileAsync(localFile) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.fileSource.writeFile(localFile, this._path);
            let fileNode = new FileNode(this.context, fileSources_1.File.createPath(this._path, fileSources_1.File.getBasename(localFile)), this.fileSource);
            return fileNode;
        });
    }
    mkdir(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.runChildAddAction(() => this.mkdirAsync(name));
        });
    }
    mkdirAsync(name) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.fileSource.mkdir(name, this._path);
            let subDir = new FolderNode(this.context, fileSources_1.File.createPath(this._path, name), this.fileSource);
            return subDir;
        });
    }
    runChildAddAction(action) {
        return __awaiter(this, void 0, void 0, function* () {
            let node = yield action();
            yield this.getChildren(true);
            if (this.children) {
                // Find the child matching the node. This is necessary
                // since writing can add duplicates.
                node = this.children.find(n => n.nodePathValue === node.nodePathValue);
                this.context.changeHandler.notifyNodeChanged(this);
            }
            else {
                // Failed to retrieve children from server so something went wrong
                node = undefined;
            }
            return node;
        });
    }
}
exports.FolderNode = FolderNode;
class ConnectionNode extends FolderNode {
    constructor(context, displayName, fileSource) {
        super(context, '/', fileSource, Constants.MssqlClusterItems.Connection);
        this.displayName = displayName;
    }
    getDisplayName() {
        return this.displayName;
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error(localize(1, null));
        });
    }
    getTreeItem() {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            let item = yield _super("getTreeItem").call(this);
            item.contextValue = this._nodeType;
            return item;
        });
    }
}
exports.ConnectionNode = ConnectionNode;
class FileNode extends HdfsFileSourceNode {
    constructor(context, path, fileSource) {
        super(context, path, fileSource);
    }
    onChildRemoved() {
        // do nothing
    }
    getChildren(refreshChildren) {
        return [];
    }
    getTreeItem() {
        let item = new vscode.TreeItem(this.getDisplayName(), vscode.TreeItemCollapsibleState.None);
        item.iconPath = {
            dark: this.context.extensionContext.asAbsolutePath('resources/dark/file_inverse.svg'),
            light: this.context.extensionContext.asAbsolutePath('resources/light/file.svg')
        };
        item.contextValue = Constants.MssqlClusterItems.File;
        return item;
    }
    getNodeInfo() {
        // TODO improve node type handling so it's not tied to SQL Server types
        let nodeInfo = {
            label: this.getDisplayName(),
            isLeaf: true,
            errorMessage: undefined,
            metadata: undefined,
            nodePath: this.generateNodePath(),
            nodeStatus: undefined,
            nodeType: Constants.MssqlClusterItems.File,
            nodeSubType: this.getSubType(),
            iconType: 'FileGroupFile'
        };
        return nodeInfo;
    }
    getFileContentsAsString(maxBytes) {
        return __awaiter(this, void 0, void 0, function* () {
            let contents = yield this.fileSource.readFile(this.hdfsPath, maxBytes);
            return contents ? contents.toString('utf8') : '';
        });
    }
    getFileLinesAsString(maxLines) {
        return __awaiter(this, void 0, void 0, function* () {
            let contents = yield this.fileSource.readFileLines(this.hdfsPath, maxLines);
            return contents ? contents.toString('utf8') : '';
        });
    }
    writeFileContentsToDisk(localPath, cancelToken) {
        return new Promise((resolve, reject) => {
            let readStream = this.fileSource.createReadStream(this.hdfsPath);
            let writeStream = fs.createWriteStream(localPath, {
                encoding: 'utf8'
            });
            let cancelable = new cancelableStream_1.CancelableStream(cancelToken);
            cancelable.on('error', (err) => {
                reject(err);
            });
            readStream.pipe(cancelable).pipe(writeStream);
            let error = undefined;
            writeStream.on('error', (err) => {
                error = err;
                reject(error);
            });
            writeStream.on('finish', (location) => {
                if (!error) {
                    resolve(vscode.Uri.file(localPath));
                }
            });
        });
    }
    getSubType() {
        if (this.getDisplayName().toLowerCase().endsWith('.jar') || this.getDisplayName().toLowerCase().endsWith('.py')) {
            return Constants.MssqlClusterItemsSubType.Spark;
        }
        return undefined;
    }
}
exports.FileNode = FileNode;
class ErrorNode extends treeNodes_1.TreeNode {
    constructor(message) {
        super();
        this.message = message;
    }
    static create(message, parent) {
        let node = new ErrorNode(message);
        node.parent = parent;
        return node;
    }
    ensureNodePathValue() {
        if (!this._nodePathValue) {
            this._nodePathValue = `message_${ErrorNode.messageNum++}`;
        }
    }
    get nodePathValue() {
        this.ensureNodePathValue();
        return this._nodePathValue;
    }
    getChildren(refreshChildren) {
        return [];
    }
    getTreeItem() {
        let item = new vscode.TreeItem(this.message, vscode.TreeItemCollapsibleState.None);
        item.contextValue = Constants.MssqlClusterItems.Error;
        return item;
    }
    getNodeInfo() {
        let nodeInfo = {
            label: this.message,
            isLeaf: false,
            errorMessage: undefined,
            metadata: undefined,
            nodePath: this.generateNodePath(),
            nodeStatus: undefined,
            nodeType: Constants.MssqlClusterItems.Error,
            nodeSubType: undefined,
            iconType: 'MessageType'
        };
        return nodeInfo;
    }
}
ErrorNode.messageNum = 0;
exports.ErrorNode = ErrorNode;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/887f4e8985023602e599cf86bdb44df48bb28569/extensions/mssql/out/objectExplorerNodeProvider/hdfsProvider.js.map
