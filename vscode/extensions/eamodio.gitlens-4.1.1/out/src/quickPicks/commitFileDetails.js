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
const commands_1 = require("../commands");
const common_1 = require("./common");
const gitService_1 = require("../gitService");
const keyboard_1 = require("../keyboard");
const remotes_1 = require("./remotes");
const moment = require("moment");
const path = require("path");
class OpenCommitFileCommandQuickPickItem extends common_1.OpenFileCommandQuickPickItem {
    constructor(commit, item) {
        let description;
        let uri;
        if (commit.status === 'D') {
            uri = gitService_1.GitService.toGitContentUri(commit.previousSha, commit.previousShortSha, commit.previousFileName, commit.repoPath, undefined);
            description = `\u00a0 \u2014 \u00a0\u00a0 ${path.basename(commit.fileName)} in \u00a0$(git-commit) ${commit.previousShortSha} (deleted in \u00a0$(git-commit) ${commit.shortSha})`;
        }
        else {
            uri = gitService_1.GitService.toGitContentUri(commit);
            description = `\u00a0 \u2014 \u00a0\u00a0 ${path.basename(commit.fileName)} in \u00a0$(git-commit) ${commit.shortSha}`;
        }
        super(uri, item || {
            label: `$(file-symlink-file) Open File`,
            description: description
        });
    }
}
exports.OpenCommitFileCommandQuickPickItem = OpenCommitFileCommandQuickPickItem;
class OpenCommitWorkingTreeFileCommandQuickPickItem extends common_1.OpenFileCommandQuickPickItem {
    constructor(commit, item) {
        const uri = vscode_1.Uri.file(path.resolve(commit.repoPath, commit.fileName));
        super(uri, item || {
            label: `$(file-symlink-file) Open Working File`,
            description: `\u00a0 \u2014 \u00a0\u00a0 ${path.basename(commit.fileName)}`
        });
    }
}
exports.OpenCommitWorkingTreeFileCommandQuickPickItem = OpenCommitWorkingTreeFileCommandQuickPickItem;
class CommitFileDetailsQuickPick {
    static show(git, commit, uri, goBackCommand, currentCommand, fileLog) {
        return __awaiter(this, void 0, void 0, function* () {
            const items = [];
            const stash = commit.type === 'stash';
            const workingName = (commit.workingFileName && path.basename(commit.workingFileName)) || path.basename(commit.fileName);
            const isUncommitted = commit.isUncommitted;
            if (isUncommitted) {
                const c = yield git.getLogCommit(undefined, commit.uri.fsPath, { previous: true });
                if (c === undefined)
                    return undefined;
                commit = c;
            }
            if (!stash) {
                items.push(new common_1.CommandQuickPickItem({
                    label: `$(git-commit) Show Commit Details`,
                    description: `\u00a0 \u2014 \u00a0\u00a0 $(git-commit) ${commit.shortSha}`
                }, commands_1.Commands.ShowQuickCommitDetails, [
                    new gitService_1.GitUri(commit.uri, commit),
                    {
                        commit,
                        sha: commit.sha,
                        goBackCommand: currentCommand
                    }
                ]));
                if (commit.previousSha) {
                    items.push(new common_1.CommandQuickPickItem({
                        label: `$(git-compare) Compare File with Previous`,
                        description: `\u00a0 \u2014 \u00a0\u00a0 $(git-commit) ${commit.previousShortSha} \u00a0 $(git-compare) \u00a0 $(git-commit) ${commit.shortSha}`
                    }, commands_1.Commands.DiffWithPrevious, [
                        commit.uri,
                        {
                            commit
                        }
                    ]));
                }
            }
            if (commit.workingFileName) {
                items.push(new common_1.CommandQuickPickItem({
                    label: `$(git-compare) Compare File with Working Tree`,
                    description: `\u00a0 \u2014 \u00a0\u00a0 $(git-commit) ${commit.shortSha} \u00a0 $(git-compare) \u00a0 $(file-text) ${workingName}`
                }, commands_1.Commands.DiffWithWorking, [
                    vscode_1.Uri.file(path.resolve(commit.repoPath, commit.workingFileName)),
                    {
                        commit
                    }
                ]));
            }
            if (!stash) {
                items.push(new common_1.CommandQuickPickItem({
                    label: `$(clippy) Copy Commit ID to Clipboard`,
                    description: `\u00a0 \u2014 \u00a0\u00a0 ${commit.shortSha}`
                }, commands_1.Commands.CopyShaToClipboard, [
                    uri,
                    {
                        sha: commit.sha
                    }
                ]));
                items.push(new common_1.CommandQuickPickItem({
                    label: `$(clippy) Copy Message to Clipboard`,
                    description: `\u00a0 \u2014 \u00a0\u00a0 ${commit.message}`
                }, commands_1.Commands.CopyMessageToClipboard, [
                    uri,
                    {
                        message: commit.message,
                        sha: commit.sha
                    }
                ]));
            }
            items.push(new OpenCommitFileCommandQuickPickItem(commit));
            if (commit.workingFileName && commit.status !== 'D') {
                items.push(new OpenCommitWorkingTreeFileCommandQuickPickItem(commit));
            }
            const remotes = system_1.Arrays.uniqueBy(yield git.getRemotes(commit.repoPath), _ => _.url, _ => !!_.provider);
            if (remotes.length) {
                if (!stash) {
                    items.push(new remotes_1.OpenRemotesCommandQuickPickItem(remotes, {
                        type: 'file',
                        fileName: commit.fileName,
                        commit
                    }, currentCommand));
                }
                if (commit.workingFileName && commit.status !== 'D') {
                    const branch = yield git.getBranch(commit.repoPath || git.repoPath);
                    items.push(new remotes_1.OpenRemotesCommandQuickPickItem(remotes, {
                        type: 'working-file',
                        fileName: commit.workingFileName,
                        branch: branch.name
                    }, currentCommand));
                }
            }
            if (commit.workingFileName) {
                items.push(new common_1.CommandQuickPickItem({
                    label: `$(history) Show File History`,
                    description: `\u00a0 \u2014 \u00a0\u00a0 of ${path.basename(commit.fileName)}`
                }, commands_1.Commands.ShowQuickFileHistory, [
                    vscode_1.Uri.file(path.resolve(commit.repoPath, commit.workingFileName)),
                    {
                        fileLog,
                        goBackCommand: currentCommand
                    }
                ]));
            }
            if (!stash) {
                items.push(new common_1.CommandQuickPickItem({
                    label: `$(history) Show ${commit.workingFileName ? 'Previous ' : ''}File History`,
                    description: `\u00a0 \u2014 \u00a0\u00a0 of ${path.basename(commit.fileName)} \u00a0\u2022\u00a0 from \u00a0$(git-commit) ${commit.shortSha}`
                }, commands_1.Commands.ShowQuickFileHistory, [
                    new gitService_1.GitUri(commit.uri, commit),
                    {
                        goBackCommand: currentCommand
                    }
                ]));
            }
            if (goBackCommand) {
                items.splice(0, 0, goBackCommand);
            }
            let previousCommand = undefined;
            let nextCommand = undefined;
            if (!stash) {
                if (fileLog !== undefined && !fileLog.truncated && fileLog.sha === undefined) {
                    previousCommand = commit.previousSha === undefined
                        ? undefined
                        : new common_1.KeyCommandQuickPickItem(commands_1.Commands.ShowQuickCommitFileDetails, [
                            commit.previousUri,
                            {
                                fileLog,
                                sha: commit.previousSha,
                                goBackCommand
                            }
                        ]);
                    nextCommand = commit.nextSha === undefined
                        ? undefined
                        : new common_1.KeyCommandQuickPickItem(commands_1.Commands.ShowQuickCommitFileDetails, [
                            commit.nextUri,
                            {
                                fileLog,
                                sha: commit.nextSha,
                                goBackCommand
                            }
                        ]);
                }
                else {
                    previousCommand = () => __awaiter(this, void 0, void 0, function* () {
                        let log = fileLog;
                        let c = log && log.commits.get(commit.sha);
                        if (c === undefined || c.previousSha === undefined) {
                            log = yield git.getLogForFile(commit.repoPath, uri.fsPath, commit.sha, git.config.advanced.maxQuickHistory);
                            if (log === undefined)
                                return keyboard_1.KeyNoopCommand;
                            c = log && log.commits.get(commit.sha);
                            if (c === undefined && commit.isMerge) {
                                c = system_1.Iterables.first(log.commits.values());
                            }
                            if (c) {
                                c.nextSha = commit.nextSha;
                                c.nextFileName = commit.nextFileName;
                            }
                        }
                        if (c === undefined || c.previousSha === undefined)
                            return keyboard_1.KeyNoopCommand;
                        return new common_1.KeyCommandQuickPickItem(commands_1.Commands.ShowQuickCommitFileDetails, [
                            c.previousUri,
                            {
                                fileLog: log,
                                sha: c.previousSha,
                                goBackCommand
                            }
                        ]);
                    });
                    nextCommand = () => __awaiter(this, void 0, void 0, function* () {
                        let log = fileLog;
                        let c = log && log.commits.get(commit.sha);
                        if (c === undefined || c.nextSha === undefined) {
                            log = undefined;
                            c = undefined;
                            const next = yield git.findNextCommit(commit.repoPath, uri.fsPath, commit.sha);
                            if (next !== undefined && next.sha !== commit.sha) {
                                c = commit;
                                c.nextSha = next.sha;
                                c.nextFileName = next.originalFileName || next.fileName;
                            }
                        }
                        if (c === undefined || c.nextSha === undefined)
                            return keyboard_1.KeyNoopCommand;
                        return new common_1.KeyCommandQuickPickItem(commands_1.Commands.ShowQuickCommitFileDetails, [
                            c.nextUri,
                            {
                                fileLog: log,
                                sha: c.nextSha,
                                goBackCommand
                            }
                        ]);
                    });
                }
            }
            const scope = yield keyboard_1.Keyboard.instance.beginScope({
                left: goBackCommand,
                ',': previousCommand,
                '.': nextCommand
            });
            const pick = yield vscode_1.window.showQuickPick(items, {
                matchOnDescription: true,
                placeHolder: `${commit.getFormattedPath()} \u00a0\u2022\u00a0 ${isUncommitted ? 'Uncommitted \u21E8 ' : ''}${commit.shortSha} \u00a0\u2022\u00a0 ${commit.author}, ${moment(commit.date).fromNow()} \u00a0\u2022\u00a0 ${commit.message}`,
                ignoreFocusOut: common_1.getQuickPickIgnoreFocusOut(),
                onDidSelectItem: (item) => {
                    scope.setKeyCommand('right', item);
                }
            });
            yield scope.dispose();
            return pick;
        });
    }
}
exports.CommitFileDetailsQuickPick = CommitFileDetailsQuickPick;
//# sourceMappingURL=commitFileDetails.js.map