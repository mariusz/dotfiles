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
const path = require("path");
class OpenStatusFileCommandQuickPickItem extends common_1.OpenFileCommandQuickPickItem {
    constructor(status, item) {
        const icon = status.getIcon();
        const description = status.getFormattedDirectory(true);
        super(status.Uri, item || {
            label: `${status.staged ? '$(check)' : '\u00a0\u00a0\u00a0'}\u00a0\u00a0${icon}\u00a0\u00a0\u00a0${path.basename(status.fileName)}`,
            description: description
        });
    }
    onDidPressKey(key) {
        return vscode_1.commands.executeCommand(commands_1.Commands.DiffWithWorking, this.uri, {
            showOptions: {
                preserveFocus: true,
                preview: false
            }
        });
    }
}
exports.OpenStatusFileCommandQuickPickItem = OpenStatusFileCommandQuickPickItem;
class OpenStatusFilesCommandQuickPickItem extends common_1.CommandQuickPickItem {
    constructor(statuses, item) {
        const uris = statuses.map(_ => _.Uri);
        super(item || {
            label: `$(file-symlink-file) Open Changed Files`,
            description: ''
        }, commands_1.Commands.OpenChangedFiles, [
            undefined,
            {
                uris
            }
        ]);
    }
}
exports.OpenStatusFilesCommandQuickPickItem = OpenStatusFilesCommandQuickPickItem;
class RepoStatusQuickPick {
    static show(status, goBackCommand) {
        return __awaiter(this, void 0, void 0, function* () {
            const files = status.files;
            files.sort((a, b) => (a.staged ? -1 : 1) - (b.staged ? -1 : 1) || a.fileName.localeCompare(b.fileName));
            const added = files.filter(_ => _.status === 'A' || _.status === '?');
            const deleted = files.filter(_ => _.status === 'D');
            const changed = files.filter(_ => _.status !== 'A' && _.status !== '?' && _.status !== 'D');
            const hasStaged = files.some(_ => _.staged);
            let stagedStatus = '';
            let unstagedStatus = '';
            if (hasStaged) {
                const stagedAdded = added.filter(_ => _.staged).length;
                const stagedChanged = changed.filter(_ => _.staged).length;
                const stagedDeleted = deleted.filter(_ => _.staged).length;
                stagedStatus = `+${stagedAdded} ~${stagedChanged} -${stagedDeleted}`;
                unstagedStatus = `+${added.length - stagedAdded} ~${changed.length - stagedChanged} -${deleted.length - stagedDeleted}`;
            }
            else {
                unstagedStatus = `+${added.length} ~${changed.length} -${deleted.length}`;
            }
            const items = Array.from(system_1.Iterables.map(files, s => new OpenStatusFileCommandQuickPickItem(s)));
            const currentCommand = new common_1.CommandQuickPickItem({
                label: `go back \u21A9`,
                description: `\u00a0 \u2014 \u00a0\u00a0 to \u00a0$(git-branch) ${status.branch} status`
            }, commands_1.Commands.ShowQuickRepoStatus, [
                undefined,
                {
                    goBackCommand
                }
            ]);
            if (hasStaged) {
                let index = 0;
                const unstagedIndex = files.findIndex(_ => !_.staged);
                if (unstagedIndex > -1) {
                    items.splice(unstagedIndex, 0, new common_1.CommandQuickPickItem({
                        label: `Unstaged Files`,
                        description: unstagedStatus
                    }, commands_1.Commands.ShowQuickRepoStatus, [
                        undefined,
                        {
                            goBackCommand
                        }
                    ]));
                    items.splice(unstagedIndex, 0, new OpenStatusFilesCommandQuickPickItem(files.filter(_ => _.status !== 'D' && _.staged), {
                        label: `\u00a0\u00a0\u00a0\u00a0 $(file-symlink-file) Open Staged Files`,
                        description: ''
                    }));
                    items.push(new OpenStatusFilesCommandQuickPickItem(files.filter(_ => _.status !== 'D' && !_.staged), {
                        label: `\u00a0\u00a0\u00a0\u00a0 $(file-symlink-file) Open Unstaged Files`,
                        description: ''
                    }));
                }
                items.splice(index++, 0, new common_1.CommandQuickPickItem({
                    label: `Staged Files`,
                    description: stagedStatus
                }, commands_1.Commands.ShowQuickRepoStatus, [
                    undefined,
                    {
                        goBackCommand
                    }
                ]));
            }
            else if (files.some(_ => !_.staged)) {
                items.splice(0, 0, new common_1.CommandQuickPickItem({
                    label: `Unstaged Files`,
                    description: unstagedStatus
                }, commands_1.Commands.ShowQuickRepoStatus, [
                    undefined,
                    {
                        goBackCommand
                    }
                ]));
            }
            if (files.length) {
                items.push(new OpenStatusFilesCommandQuickPickItem(files.filter(_ => _.status !== 'D')));
                items.push(new common_1.CommandQuickPickItem({
                    label: '$(x) Close Unchanged Files',
                    description: ''
                }, commands_1.Commands.CloseUnchangedFiles));
            }
            else {
                items.push(new common_1.CommandQuickPickItem({
                    label: `No changes in the working tree`,
                    description: ''
                }, commands_1.Commands.ShowQuickRepoStatus, [
                    undefined,
                    {
                        goBackCommand
                    }
                ]));
            }
            items.splice(0, 0, new common_1.CommandQuickPickItem({
                label: `$(repo) Show Stashed Changes`,
                description: `\u00a0 \u2014 \u00a0\u00a0 shows stashed changes in the repository`
            }, commands_1.Commands.ShowQuickStashList, [
                new gitService_1.GitUri(vscode_1.Uri.file(status.repoPath), { fileName: '', repoPath: status.repoPath }),
                {
                    goBackCommand: currentCommand
                }
            ]));
            if (status.upstream && status.state.ahead) {
                items.splice(0, 0, new common_1.CommandQuickPickItem({
                    label: `$(cloud-upload)\u00a0 ${status.state.ahead} Commit${status.state.ahead > 1 ? 's' : ''} ahead of \u00a0$(git-branch) ${status.upstream}`,
                    description: `\u00a0 \u2014 \u00a0\u00a0 shows commits in \u00a0$(git-branch) ${status.branch} but not \u00a0$(git-branch) ${status.upstream}`
                }, commands_1.Commands.ShowQuickBranchHistory, [
                    new gitService_1.GitUri(vscode_1.Uri.file(status.repoPath), { fileName: '', repoPath: status.repoPath, sha: `${status.upstream}..${status.branch}` }),
                    {
                        branch: status.branch,
                        maxCount: 0,
                        goBackCommand: currentCommand
                    }
                ]));
            }
            if (status.upstream && status.state.behind) {
                items.splice(0, 0, new common_1.CommandQuickPickItem({
                    label: `$(cloud-download)\u00a0 ${status.state.behind} Commit${status.state.behind > 1 ? 's' : ''} behind \u00a0$(git-branch) ${status.upstream}`,
                    description: `\u00a0 \u2014 \u00a0\u00a0 shows commits in \u00a0$(git-branch) ${status.upstream} but not \u00a0$(git-branch) ${status.branch}${status.sha ? ` (since \u00a0$(git-commit) ${status.sha.substring(0, 8)})` : ''}`
                }, commands_1.Commands.ShowQuickBranchHistory, [
                    new gitService_1.GitUri(vscode_1.Uri.file(status.repoPath), { fileName: '', repoPath: status.repoPath, sha: `${status.branch}..${status.upstream}` }),
                    {
                        branch: status.upstream,
                        maxCount: 0,
                        goBackCommand: currentCommand
                    }
                ]));
            }
            if (status.upstream && !status.state.ahead && !status.state.behind) {
                items.splice(0, 0, new common_1.CommandQuickPickItem({
                    label: `$(git-branch) ${status.branch} is up-to-date with \u00a0$(git-branch) ${status.upstream}`,
                    description: ''
                }, commands_1.Commands.ShowQuickRepoStatus, [
                    undefined,
                    {
                        goBackCommand
                    }
                ]));
            }
            if (goBackCommand) {
                items.splice(0, 0, goBackCommand);
            }
            const scope = yield keyboard_1.Keyboard.instance.beginScope({ left: goBackCommand });
            const pick = yield vscode_1.window.showQuickPick(items, {
                matchOnDescription: true,
                placeHolder: `status of ${status.branch}${status.upstream ? ` \u00a0\u2194\u00a0 ${status.upstream}` : ''}`,
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
exports.RepoStatusQuickPick = RepoStatusQuickPick;
//# sourceMappingURL=repoStatus.js.map