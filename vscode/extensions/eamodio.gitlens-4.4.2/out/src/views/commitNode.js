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
const commitFileNode_1 = require("./commitFileNode");
const explorerNode_1 = require("./explorerNode");
const gitService_1 = require("../gitService");
class CommitNode extends explorerNode_1.ExplorerNode {
    constructor(commit, context, git) {
        super(new gitService_1.GitUri(commit.uri, commit), context, git);
        this.commit = commit;
        this.resourceType = 'commit';
        this.commit = commit;
    }
    getChildren() {
        return __awaiter(this, void 0, void 0, function* () {
            const log = yield this.git.getLogForRepo(this.commit.repoPath, this.commit.sha, 1);
            if (log === undefined)
                return [];
            const commit = system_1.Iterables.first(log.commits.values());
            if (commit === undefined)
                return [];
            return [...system_1.Iterables.map(commit.fileStatuses, s => new commitFileNode_1.CommitFileNode(s, commit, this.git.config.gitExplorer.commitFileFormat, this.context, this.git))];
        });
    }
    getTreeItem() {
        const label = gitService_1.CommitFormatter.fromTemplate(this.git.config.gitExplorer.commitFormat, this.commit, this.git.config.defaultDateFormat);
        const item = new vscode_1.TreeItem(label, vscode_1.TreeItemCollapsibleState.Collapsed);
        item.contextValue = this.resourceType;
        item.iconPath = {
            dark: this.context.asAbsolutePath('images/dark/icon-commit.svg'),
            light: this.context.asAbsolutePath('images/light/icon-commit.svg')
        };
        return item;
    }
}
exports.CommitNode = CommitNode;
//# sourceMappingURL=commitNode.js.map