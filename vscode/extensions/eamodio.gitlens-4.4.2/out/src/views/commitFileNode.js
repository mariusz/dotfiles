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
const commands_1 = require("../commands");
const explorerNode_1 = require("./explorerNode");
const gitService_1 = require("../gitService");
const path = require("path");
class CommitFileNode extends explorerNode_1.ExplorerNode {
    constructor(status, commit, template, context, git) {
        super(new gitService_1.GitUri(vscode_1.Uri.file(path.resolve(commit.repoPath, status.fileName)), { repoPath: commit.repoPath, fileName: status.fileName, sha: commit.sha }), context, git);
        this.status = status;
        this.commit = commit;
        this.template = template;
        this.resourceType = 'commit-file';
    }
    getChildren() {
        return Promise.resolve([]);
    }
    getTreeItem() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.commit.type !== 'file') {
                const log = yield this.git.getLogForFile(this.commit.repoPath, this.status.fileName, this.commit.sha, { maxCount: 2 });
                if (log !== undefined) {
                    this.commit = log.commits.get(this.commit.sha) || this.commit;
                }
            }
            const item = new vscode_1.TreeItem(gitService_1.StatusFileFormatter.fromTemplate(this.template, this.status), vscode_1.TreeItemCollapsibleState.None);
            item.contextValue = this.resourceType;
            const icon = gitService_1.getGitStatusIcon(this.status.status);
            item.iconPath = {
                dark: this.context.asAbsolutePath(path.join('images', 'dark', icon)),
                light: this.context.asAbsolutePath(path.join('images', 'light', icon))
            };
            item.command = this.getCommand();
            return item;
        });
    }
    getCommand() {
        return {
            title: 'Compare File with Previous',
            command: commands_1.Commands.DiffWithPrevious,
            arguments: [
                gitService_1.GitUri.fromFileStatus(this.status, this.commit.repoPath),
                {
                    commit: this.commit,
                    line: 0,
                    showOptions: {
                        preserveFocus: true,
                        preview: true
                    }
                }
            ]
        };
    }
}
exports.CommitFileNode = CommitFileNode;
//# sourceMappingURL=commitFileNode.js.map