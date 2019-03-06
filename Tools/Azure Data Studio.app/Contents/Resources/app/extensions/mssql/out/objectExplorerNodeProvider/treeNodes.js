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
class TreeNode {
    constructor() {
        this._parent = undefined;
    }
    get parent() {
        return this._parent;
    }
    set parent(node) {
        this._parent = node;
    }
    generateNodePath() {
        let path = undefined;
        if (this.parent) {
            path = this.parent.generateNodePath();
        }
        path = path ? `${path}/${this.nodePathValue}` : this.nodePathValue;
        return path;
    }
    findNodeByPath(path, expandIfNeeded = false) {
        let condition = (node) => node.getNodeInfo().nodePath === path || node.getNodeInfo().nodePath.startsWith(path);
        let filter = (node) => path.startsWith(node.getNodeInfo().nodePath);
        return TreeNode.findNode(this, condition, filter, true);
    }
    static findNode(node, condition, filter, expandIfNeeded) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!node) {
                return undefined;
            }
            if (condition(node)) {
                return node;
            }
            let nodeInfo = node.getNodeInfo();
            if (nodeInfo.isLeaf) {
                return undefined;
            }
            // TODO #3813 support filtering by already expanded / not yet expanded
            let children = yield node.getChildren(false);
            if (children) {
                for (let child of children) {
                    if (filter && filter(child)) {
                        let childNode = yield this.findNode(child, condition, filter, expandIfNeeded);
                        if (childNode) {
                            return childNode;
                        }
                    }
                }
            }
            return undefined;
        });
    }
}
exports.TreeNode = TreeNode;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/887f4e8985023602e599cf86bdb44df48bb28569/extensions/mssql/out/objectExplorerNodeProvider/treeNodes.js.map
