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
const constants_1 = require("../constants");
const gitService_1 = require("../gitService");
const keyboard_1 = require("../keyboard");
const remotes_1 = require("./remotes");
class BranchHistoryQuickPick {
    static showProgress(branch) {
        return common_1.showQuickPickProgress(`${branch} history ${constants_1.GlyphChars.Dash} search by commit message, filename, or commit id`, {
            left: keyboard_1.KeyNoopCommand,
            ',': keyboard_1.KeyNoopCommand,
            '.': keyboard_1.KeyNoopCommand
        });
    }
    static show(git, log, uri, branch, progressCancellation, goBackCommand, nextPageCommand) {
        return __awaiter(this, void 0, void 0, function* () {
            const items = Array.from(system_1.Iterables.map(log.commits.values(), c => new common_1.CommitQuickPickItem(c)));
            const currentCommand = new common_1.CommandQuickPickItem({
                label: `go back ${constants_1.GlyphChars.ArrowBack}`,
                description: `${system_1.Strings.pad(constants_1.GlyphChars.Dash, 2, 3)} to ${constants_1.GlyphChars.Space}$(git-branch) ${branch} history`
            }, commands_1.Commands.ShowQuickBranchHistory, [
                uri,
                {
                    branch,
                    log,
                    maxCount: log.maxCount,
                    goBackCommand
                }
            ]);
            const remotes = system_1.Arrays.uniqueBy(yield git.getRemotes((uri && uri.repoPath) || git.repoPath), _ => _.url, _ => !!_.provider);
            if (remotes.length) {
                items.splice(0, 0, new remotes_1.OpenRemotesCommandQuickPickItem(remotes, {
                    type: 'branch',
                    branch
                }, currentCommand));
            }
            items.splice(0, 0, new common_1.CommandQuickPickItem({
                label: `$(search) Show Commit Search`,
                description: `${system_1.Strings.pad(constants_1.GlyphChars.Dash, 2, 3)} search for commits by message, author, files, or commit id`
            }, commands_1.Commands.ShowCommitSearch, [
                new gitService_1.GitUri(vscode_1.Uri.file(log.repoPath), { fileName: '', repoPath: log.repoPath }),
                {
                    goBackCommand: currentCommand
                }
            ]));
            let previousPageCommand = undefined;
            if (log.truncated || log.sha) {
                if (log.truncated) {
                    items.splice(0, 0, new common_1.CommandQuickPickItem({
                        label: `$(sync) Show All Commits`,
                        description: `${system_1.Strings.pad(constants_1.GlyphChars.Dash, 2, 3)} this may take a while`
                    }, commands_1.Commands.ShowQuickBranchHistory, [
                        new gitService_1.GitUri(vscode_1.Uri.file(log.repoPath), { fileName: '', repoPath: log.repoPath }),
                        {
                            branch,
                            maxCount: 0,
                            goBackCommand
                        }
                    ]));
                }
                else {
                    items.splice(0, 0, new common_1.CommandQuickPickItem({
                        label: `$(history) Show Branch History`,
                        description: `${system_1.Strings.pad(constants_1.GlyphChars.Dash, 2, 3)} shows ${constants_1.GlyphChars.Space}$(git-branch) ${branch} history`
                    }, commands_1.Commands.ShowQuickBranchHistory, [
                        new gitService_1.GitUri(vscode_1.Uri.file(log.repoPath), { fileName: '', repoPath: log.repoPath }),
                        {
                            branch,
                            goBackCommand: currentCommand
                        }
                    ]));
                }
                if (nextPageCommand) {
                    items.splice(0, 0, nextPageCommand);
                }
                if (log.truncated) {
                    const npc = new common_1.CommandQuickPickItem({
                        label: `$(arrow-right) Show Next Commits`,
                        description: `${system_1.Strings.pad(constants_1.GlyphChars.Dash, 2, 3)} shows ${log.maxCount} newer commits`
                    }, commands_1.Commands.ShowQuickBranchHistory, [
                        uri,
                        {
                            branch,
                            maxCount: log.maxCount,
                            nextPageCommand
                        }
                    ]);
                    const last = system_1.Iterables.last(log.commits.values());
                    if (last != null) {
                        previousPageCommand = new common_1.CommandQuickPickItem({
                            label: `$(arrow-left) Show Previous Commits`,
                            description: `${system_1.Strings.pad(constants_1.GlyphChars.Dash, 2, 3)} shows ${log.maxCount} older commits`
                        }, commands_1.Commands.ShowQuickBranchHistory, [
                            new gitService_1.GitUri(uri ? uri : last.uri, last),
                            {
                                branch,
                                maxCount: log.maxCount,
                                goBackCommand,
                                nextPageCommand: npc
                            }
                        ]);
                        items.splice(0, 0, previousPageCommand);
                    }
                }
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
            progressCancellation.cancel();
            const pick = yield vscode_1.window.showQuickPick(items, {
                matchOnDescription: true,
                matchOnDetail: true,
                placeHolder: `${branch} history ${constants_1.GlyphChars.Dash} search by commit message, filename, or commit id`,
                ignoreFocusOut: common_1.getQuickPickIgnoreFocusOut()
            });
            yield scope.dispose();
            return pick;
        });
    }
}
exports.BranchHistoryQuickPick = BranchHistoryQuickPick;
//# sourceMappingURL=branchHistory.js.map