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
const path = require("path");
class FileHistoryQuickPick {
    static showProgress(uri) {
        return common_1.showQuickPickProgress(`${uri.getFormattedPath()}${uri.sha ? ` \u00a0\u2022\u00a0 ${uri.shortSha}` : ''}`, {
            left: keyboard_1.KeyNoopCommand,
            ',': keyboard_1.KeyNoopCommand,
            '.': keyboard_1.KeyNoopCommand
        });
    }
    static show(git, log, uri, progressCancellation, goBackCommand, nextPageCommand) {
        return __awaiter(this, void 0, void 0, function* () {
            const items = Array.from(system_1.Iterables.map(log.commits.values(), c => new common_1.CommitQuickPickItem(c)));
            let previousPageCommand = undefined;
            let index = 0;
            if (log.truncated || log.sha) {
                if (log.truncated) {
                    index++;
                    items.splice(0, 0, new common_1.CommandQuickPickItem({
                        label: `$(sync) Show All Commits`,
                        description: `\u00a0 \u2014 \u00a0\u00a0 this may take a while`
                    }, commands_1.Commands.ShowQuickFileHistory, [
                        vscode_1.Uri.file(uri.fsPath),
                        {
                            maxCount: 0,
                            goBackCommand
                        }
                    ]));
                }
                else {
                    const workingFileName = yield git.findWorkingFileName(log.repoPath, path.relative(log.repoPath, uri.fsPath));
                    if (workingFileName) {
                        index++;
                        items.splice(0, 0, new common_1.CommandQuickPickItem({
                            label: `$(history) Show File History`,
                            description: `\u00a0 \u2014 \u00a0\u00a0 of ${path.basename(workingFileName)}`
                        }, commands_1.Commands.ShowQuickFileHistory, [
                            vscode_1.Uri.file(path.resolve(log.repoPath, workingFileName)),
                            {
                                goBackCommand: new common_1.CommandQuickPickItem({
                                    label: `go back \u21A9`,
                                    description: `\u00a0 \u2014 \u00a0\u00a0 to history of \u00a0$(file-text) ${path.basename(uri.fsPath)}${uri.sha ? ` from \u00a0$(git-commit) ${uri.shortSha}` : ''}`
                                }, commands_1.Commands.ShowQuickFileHistory, [
                                    uri,
                                    {
                                        log: log,
                                        maxCount: log.maxCount,
                                        range: log.range,
                                        goBackCommand
                                    }
                                ])
                            }
                        ]));
                    }
                }
                if (nextPageCommand) {
                    index++;
                    items.splice(0, 0, nextPageCommand);
                }
                if (log.truncated) {
                    const npc = new common_1.CommandQuickPickItem({
                        label: `$(arrow-right) Show Next Commits`,
                        description: `\u00a0 \u2014 \u00a0\u00a0 shows ${log.maxCount} newer commits`
                    }, commands_1.Commands.ShowQuickFileHistory, [
                        uri,
                        {
                            maxCount: log.maxCount,
                            goBackCommand,
                            nextPageCommand
                        }
                    ]);
                    const last = system_1.Iterables.last(log.commits.values());
                    if (last != null) {
                        previousPageCommand = new common_1.CommandQuickPickItem({
                            label: `$(arrow-left) Show Previous Commits`,
                            description: `\u00a0 \u2014 \u00a0\u00a0 shows ${log.maxCount} older commits`
                        }, commands_1.Commands.ShowQuickFileHistory, [
                            new gitService_1.GitUri(uri, last),
                            {
                                maxCount: log.maxCount,
                                goBackCommand,
                                nextPageCommand: npc
                            }
                        ]);
                        index++;
                        items.splice(0, 0, previousPageCommand);
                    }
                }
            }
            const branch = yield git.getBranch(uri.repoPath);
            const currentCommand = new common_1.CommandQuickPickItem({
                label: `go back \u21A9`,
                description: `\u00a0 \u2014 \u00a0\u00a0 to history of \u00a0$(file-text) ${path.basename(uri.fsPath)}${uri.sha ? ` from \u00a0$(git-commit) ${uri.shortSha}` : ''}`
            }, commands_1.Commands.ShowQuickFileHistory, [
                uri,
                {
                    log,
                    maxCount: log.maxCount,
                    range: log.range
                }
            ]);
            if (goBackCommand === undefined) {
                items.splice(index++, 0, new common_1.CommandQuickPickItem({
                    label: `$(history) Show Branch History`,
                    description: `\u00a0 \u2014 \u00a0\u00a0 shows  \u00a0$(git-branch) ${branch.name} history`
                }, commands_1.Commands.ShowQuickCurrentBranchHistory, [
                    undefined,
                    {
                        goBackCommand: currentCommand
                    }
                ]));
            }
            const remotes = system_1.Arrays.uniqueBy(yield git.getRemotes(uri.repoPath), _ => _.url, _ => !!_.provider);
            if (remotes.length) {
                items.splice(index++, 0, new remotes_1.OpenRemotesCommandQuickPickItem(remotes, {
                    type: 'file',
                    branch: branch.name,
                    fileName: uri.getRelativePath(),
                    sha: uri.sha
                }, currentCommand));
            }
            if (goBackCommand) {
                items.splice(0, 0, goBackCommand);
            }
            if (progressCancellation.token.isCancellationRequested)
                return undefined;
            const scope = yield keyboard_1.Keyboard.instance.beginScope({
                left: goBackCommand,
                ',': previousPageCommand,
                '.': nextPageCommand
            });
            const commit = system_1.Iterables.first(log.commits.values());
            progressCancellation.cancel();
            const pick = yield vscode_1.window.showQuickPick(items, {
                matchOnDescription: true,
                matchOnDetail: true,
                placeHolder: `${commit.getFormattedPath()}${uri.sha ? ` \u00a0\u2022\u00a0 ${uri.shortSha}` : ''}`,
                ignoreFocusOut: common_1.getQuickPickIgnoreFocusOut()
            });
            yield scope.dispose();
            return pick;
        });
    }
}
exports.FileHistoryQuickPick = FileHistoryQuickPick;
//# sourceMappingURL=fileHistory.js.map