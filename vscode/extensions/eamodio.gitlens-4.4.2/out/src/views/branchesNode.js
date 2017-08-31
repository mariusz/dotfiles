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
const system_1 = require("../system");
const vscode_1 = require("vscode");
const branchHistoryNode_1 = require("./branchHistoryNode");
const explorerNode_1 = require("./explorerNode");
class BranchesNode extends explorerNode_1.ExplorerNode {
    constructor(uri, context, git) {
        super(uri, context, git);
        this.resourceType = 'branches';
    }
    getChildren() {
        return __awaiter(this, void 0, void 0, function* () {
            const branches = yield this.git.getBranches(this.uri.repoPath);
            if (branches === undefined)
                return [];
            return [...system_1.Iterables.filterMap(branches.sort(_ => _.current ? 0 : 1), b => b.remote ? undefined : new branchHistoryNode_1.BranchHistoryNode(b, this.uri, this.context, this.git))];
        });
    }
    getTreeItem() {
        const item = new vscode_1.TreeItem(`Branches`, vscode_1.TreeItemCollapsibleState.Collapsed);
        item.contextValue = this.resourceType;
        return item;
    }
}
exports.BranchesNode = BranchesNode;
//# sourceMappingURL=branchesNode.js.map