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
const sqlops = require("sqlops");
const vscode = require("vscode");
const nls = require("vscode-nls");
const localize = nls.loadMessageBundle(__filename);
const providerBase_1 = require("./providerBase");
const connection_1 = require("./connection");
const utils = require("../utils");
const treeNodes_1 = require("./treeNodes");
const hdfsProvider_1 = require("./hdfsProvider");
const constants = require("../constants");
const SqlClusterLookUp = require("../sqlClusterLookUp");
exports.mssqlOutputChannel = vscode.window.createOutputChannel(constants.providerId);
class MssqlObjectExplorerNodeProvider extends providerBase_1.ProviderBase {
    constructor(appContext) {
        super();
        this.appContext = appContext;
        this.supportedProviderId = constants.providerId;
        this.expandCompleteEmitter = new vscode.EventEmitter();
        this.sessionMap = new Map();
        this.appContext.registerService(constants.ObjectExplorerService, this);
    }
    handleSessionOpen(session) {
        return new Promise((resolve, reject) => {
            if (!session) {
                reject('handleSessionOpen requires a session object to be passed');
            }
            else {
                resolve(this.doSessionOpen(session));
            }
        });
    }
    doSessionOpen(session) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!session || !session.sessionId) {
                return false;
            }
            let sqlConnProfile = yield sqlops.objectexplorer.getSessionConnectionProfile(session.sessionId);
            if (!sqlConnProfile) {
                return false;
            }
            let clusterConnInfo = yield SqlClusterLookUp.getSqlClusterConnection(sqlConnProfile);
            if (!clusterConnInfo) {
                return false;
            }
            let clusterConnection = new connection_1.SqlClusterConnection(clusterConnInfo);
            let clusterSession = new SqlClusterSession(clusterConnection, session, sqlConnProfile, this.appContext, this);
            this.sessionMap.set(session.sessionId, clusterSession);
            return true;
        });
    }
    expandNode(nodeInfo, isRefresh = false) {
        return new Promise((resolve, reject) => {
            if (!nodeInfo) {
                reject('expandNode requires a nodeInfo object to be passed');
            }
            else {
                resolve(this.doExpandNode(nodeInfo, isRefresh));
            }
        });
    }
    doExpandNode(nodeInfo, isRefresh = false) {
        return __awaiter(this, void 0, void 0, function* () {
            let session = this.sessionMap.get(nodeInfo.sessionId);
            let response = {
                sessionId: nodeInfo.sessionId,
                nodePath: nodeInfo.nodePath,
                errorMessage: undefined,
                nodes: []
            };
            if (!session) {
                // This is not an error case. Just fire reponse with empty nodes for example: request from standalone SQL instance
                this.expandCompleteEmitter.fire(response);
                return false;
            }
            else {
                setTimeout(() => {
                    // Running after promise resolution as we need the Ops Studio-side map to have been updated
                    // Intentionally not awaiting or catching errors.
                    // Any failure in startExpansion should be emitted in the expand complete result
                    // We want this to be async and ideally return true before it completes
                    this.startExpansion(session, nodeInfo, isRefresh);
                }, 10);
            }
            return true;
        });
    }
    startExpansion(session, nodeInfo, isRefresh = false) {
        return __awaiter(this, void 0, void 0, function* () {
            let expandResult = {
                sessionId: session.sessionId,
                nodePath: nodeInfo.nodePath,
                errorMessage: undefined,
                nodes: []
            };
            try {
                let node = yield session.rootNode.findNodeByPath(nodeInfo.nodePath, true);
                if (node) {
                    expandResult.errorMessage = node.getNodeInfo().errorMessage;
                    let children = yield node.getChildren(true);
                    if (children) {
                        expandResult.nodes = children.map(c => c.getNodeInfo());
                        // There is only child returned when failure happens
                        if (children.length === 1) {
                            let child = children[0].getNodeInfo();
                            if (child && child.nodeType === constants.MssqlClusterItems.Error) {
                                expandResult.errorMessage = child.label;
                                expandResult.nodes = [];
                            }
                        }
                    }
                }
            }
            catch (error) {
                expandResult.errorMessage = utils.getErrorMessage(error);
            }
            this.expandCompleteEmitter.fire(expandResult);
        });
    }
    refreshNode(nodeInfo) {
        // TODO #3815 implement properly
        return this.expandNode(nodeInfo, true);
    }
    handleSessionClose(closeSessionInfo) {
        this.sessionMap.delete(closeSessionInfo.sessionId);
    }
    findNodes(findNodesInfo) {
        // TODO #3814 implement
        let response = {
            nodes: []
        };
        return Promise.resolve(response);
    }
    registerOnExpandCompleted(handler) {
        this.expandCompleteEmitter.event(handler);
    }
    notifyNodeChanged(node) {
        this.notifyNodeChangesAsync(node);
    }
    notifyNodeChangesAsync(node) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let session = this.getSqlClusterSessionForNode(node);
                if (!session) {
                    this.appContext.apiWrapper.showErrorMessage(localize(0, null, node.nodePathValue));
                }
                else {
                    let nodeInfo = node.getNodeInfo();
                    let expandInfo = {
                        nodePath: nodeInfo.nodePath,
                        sessionId: session.sessionId
                    };
                    yield this.refreshNode(expandInfo);
                }
            }
            catch (err) {
                exports.mssqlOutputChannel.appendLine(localize(1, null, err));
            }
        });
    }
    getSqlClusterSessionForNode(node) {
        let sqlClusterSession = undefined;
        while (node !== undefined) {
            if (node instanceof DataServicesNode) {
                sqlClusterSession = node.session;
                break;
            }
            else {
                node = node.parent;
            }
        }
        return sqlClusterSession;
    }
    findSqlClusterNodeByContext(context) {
        return __awaiter(this, void 0, void 0, function* () {
            let node = undefined;
            let explorerContext = 'explorerContext' in context ? context.explorerContext : context;
            let sqlConnProfile = explorerContext.connectionProfile;
            let session = this.findSqlClusterSessionBySqlConnProfile(sqlConnProfile);
            if (session) {
                if (explorerContext.isConnectionNode) {
                    // Note: ideally fix so we verify T matches RootNode and go from there
                    node = session.rootNode;
                }
                else {
                    // Find the node under the session
                    node = (yield session.rootNode.findNodeByPath(explorerContext.nodeInfo.nodePath, true));
                }
            }
            return node;
        });
    }
    findSqlClusterSessionBySqlConnProfile(connectionProfile) {
        for (let session of this.sessionMap.values()) {
            if (session.isMatchedSqlConnection(connectionProfile)) {
                return session;
            }
        }
        return undefined;
    }
}
exports.MssqlObjectExplorerNodeProvider = MssqlObjectExplorerNodeProvider;
class SqlClusterSession {
    constructor(_sqlClusterConnection, _sqlSession, _sqlConnectionProfile, _appContext, _changeHandler) {
        this._sqlClusterConnection = _sqlClusterConnection;
        this._sqlSession = _sqlSession;
        this._sqlConnectionProfile = _sqlConnectionProfile;
        this._appContext = _appContext;
        this._changeHandler = _changeHandler;
        this._rootNode = new SqlClusterRootNode(this, new hdfsProvider_1.TreeDataContext(this._appContext.extensionContext, this._changeHandler), this._sqlSession.rootNode.nodePath);
    }
    get sqlClusterConnection() { return this._sqlClusterConnection; }
    get sqlSession() { return this._sqlSession; }
    get sqlConnectionProfile() { return this._sqlConnectionProfile; }
    get sessionId() { return this._sqlSession.sessionId; }
    get rootNode() { return this._rootNode; }
    isMatchedSqlConnection(sqlConnProfile) {
        return this._sqlConnectionProfile.id === sqlConnProfile.id;
    }
}
exports.SqlClusterSession = SqlClusterSession;
class SqlClusterRootNode extends treeNodes_1.TreeNode {
    constructor(_session, _treeDataContext, _nodePathValue) {
        super();
        this._session = _session;
        this._treeDataContext = _treeDataContext;
        this._nodePathValue = _nodePathValue;
    }
    get session() {
        return this._session;
    }
    get nodePathValue() {
        return this._nodePathValue;
    }
    getChildren(refreshChildren) {
        if (refreshChildren || !this._children) {
            this._children = [];
            let dataServicesNode = new DataServicesNode(this._session, this._treeDataContext, this._nodePathValue);
            dataServicesNode.parent = this;
            this._children.push(dataServicesNode);
        }
        return this._children;
    }
    getTreeItem() {
        throw new Error('Not intended for use in a file explorer view.');
    }
    getNodeInfo() {
        let nodeInfo = {
            label: localize(2, null),
            isLeaf: false,
            errorMessage: undefined,
            metadata: undefined,
            nodePath: this.generateNodePath(),
            nodeStatus: undefined,
            nodeType: 'sqlCluster:root',
            nodeSubType: undefined,
            iconType: 'folder'
        };
        return nodeInfo;
    }
}
class DataServicesNode extends treeNodes_1.TreeNode {
    constructor(_session, _context, _nodePath) {
        super();
        this._session = _session;
        this._context = _context;
        this._nodePath = _nodePath;
    }
    get session() {
        return this._session;
    }
    get nodePathValue() {
        return this._nodePath;
    }
    getChildren(refreshChildren) {
        if (refreshChildren || !this._children) {
            this._children = [];
            let fileSource = this.session.sqlClusterConnection.createHdfsFileSource();
            let hdfsNode = new hdfsProvider_1.ConnectionNode(this._context, localize(3, null), fileSource);
            hdfsNode.parent = this;
            this._children.push(hdfsNode);
        }
        return this._children;
    }
    getTreeItem() {
        throw new Error('Not intended for use in a file explorer view.');
    }
    getNodeInfo() {
        let nodeInfo = {
            label: localize(4, null),
            isLeaf: false,
            errorMessage: undefined,
            metadata: undefined,
            nodePath: this.generateNodePath(),
            nodeStatus: undefined,
            nodeType: 'dataservices',
            nodeSubType: undefined,
            iconType: 'folder'
        };
        return nodeInfo;
    }
}
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/887f4e8985023602e599cf86bdb44df48bb28569/extensions/mssql/out/objectExplorerNodeProvider/objectExplorerNodeProvider.js.map
