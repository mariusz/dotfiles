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
const explorerNode_1 = require("./explorerNode");
const stashCommitNode_1 = require("./stashCommitNode");
class StashNode extends explorerNode_1.ExplorerNode {
    constructor(uri, context, git) {
        super(uri, context, git);
        this.resourceType = 'stash-history';
    }
    getChildren() {
        return __awaiter(this, void 0, void 0, function* () {
            const stash = yield this.git.getStashList(this.uri.repoPath);
            if (stash === undefined)
                return [];
            return [...system_1.Iterables.map(stash.commits.values(), c => new stashCommitNode_1.StashCommitNode(c, this.context, this.git))];
        });
    }
    getTreeItem() {
        const item = new vscode_1.TreeItem(`Stashed Changes`, vscode_1.TreeItemCollapsibleState.Collapsed);
        item.contextValue = this.resourceType;
        return item;
    }
}
StashNode.rootType = 'stash-history';
exports.StashNode = StashNode;
//# sourceMappingURL=stashNode.js.map