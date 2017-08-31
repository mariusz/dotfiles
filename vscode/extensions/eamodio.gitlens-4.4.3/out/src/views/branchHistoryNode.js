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
const commitNode_1 = require("./commitNode");
const constants_1 = require("../constants");
const explorerNode_1 = require("./explorerNode");
class BranchHistoryNode extends explorerNode_1.ExplorerNode {
    constructor(branch, uri, context, git) {
        super(uri, context, git);
        this.branch = branch;
        this.resourceType = 'branch-history';
    }
    getChildren() {
        return __awaiter(this, void 0, void 0, function* () {
            const log = yield this.git.getLogForRepo(this.uri.repoPath, this.branch.name);
            if (log === undefined)
                return [];
            return [...system_1.Iterables.map(log.commits.values(), c => new commitNode_1.CommitNode(c, this.context, this.git))];
        });
    }
    getTreeItem() {
        const item = new vscode_1.TreeItem(`${this.branch.name}${this.branch.current ? ` ${constants_1.GlyphChars.Dash} current` : ''}`, vscode_1.TreeItemCollapsibleState.Collapsed);
        item.contextValue = this.resourceType;
        return item;
    }
}
exports.BranchHistoryNode = BranchHistoryNode;
//# sourceMappingURL=branchHistoryNode.js.map