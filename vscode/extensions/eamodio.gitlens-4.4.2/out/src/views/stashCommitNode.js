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
const vscode_1 = require("vscode");
const commitFileNode_1 = require("./commitFileNode");
const explorerNode_1 = require("./explorerNode");
const gitService_1 = require("../gitService");
class StashCommitNode extends explorerNode_1.ExplorerNode {
    constructor(commit, context, git) {
        super(new gitService_1.GitUri(commit.uri, commit), context, git);
        this.commit = commit;
        this.resourceType = 'stash-commit';
        this._onDidChangeTreeData = new vscode_1.EventEmitter();
    }
    get onDidChangeTreeData() {
        return this._onDidChangeTreeData.event;
    }
    getChildren() {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.resolve(this.commit.fileStatuses.map(_ => new commitFileNode_1.CommitFileNode(_, this.commit, this.git.config.stashExplorer.stashFileFormat, this.context, this.git)));
        });
    }
    getTreeItem() {
        const label = gitService_1.CommitFormatter.fromTemplate(this.git.config.stashExplorer.stashFormat, this.commit, this.git.config.defaultDateFormat);
        const item = new vscode_1.TreeItem(label, vscode_1.TreeItemCollapsibleState.Collapsed);
        item.contextValue = this.resourceType;
        return item;
    }
    refresh() {
        this._onDidChangeTreeData.fire();
    }
}
exports.StashCommitNode = StashCommitNode;
//# sourceMappingURL=stashCommitNode.js.map