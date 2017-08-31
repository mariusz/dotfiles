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
const path = require("path");
class FileHistoryQuickPick {
    static showProgress(uri) {
        return common_1.showQuickPickProgress(`${uri.getFormattedPath()}${uri.sha ? ` ${system_1.Strings.pad(constants_1.GlyphChars.Dot, 1, 1)} ${uri.shortSha}` : ''}`, {
            left: keyboard_1.KeyNoopCommand,
            ',': keyboard_1.KeyNoopCommand,
            '.': keyboard_1.KeyNoopCommand
        });
    }
    static show(git, log, uri, progressCancellation, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            options = Object.assign({ pickerOnly: false }, options);
            const items = Array.from(system_1.Iterables.map(log.commits.values(), c => new common_1.CommitQuickPickItem(c)));
            let previousPageCommand = undefined;
            let index = 0;
            if (log.truncated || log.sha) {
                if (log.truncated) {
                    index++;
                    items.splice(0, 0, new common_1.CommandQuickPickItem({
                        label: `$(sync) Show All Commits`,
                        description: `${system_1.Strings.pad(constants_1.GlyphChars.Dash, 2, 3)} this may take a while`
                    }, commands_1.Commands.ShowQuickFileHistory, [
                        vscode_1.Uri.file(uri.fsPath),
                        {
                            maxCount: 0,
                            goBackCommand: options.goBackCommand
                        }
                    ]));
                }
                else {
                    const workingFileName = yield git.findWorkingFileName(log.repoPath, path.relative(log.repoPath, uri.fsPath));
                    if (workingFileName) {
                        index++;
                        items.splice(0, 0, new common_1.CommandQuickPickItem({
                            label: `$(history) Show File History`,
                            description: `${system_1.Strings.pad(constants_1.GlyphChars.Dash, 2, 3)} of ${path.basename(workingFileName)}`
                        }, commands_1.Commands.ShowQuickFileHistory, [
                            vscode_1.Uri.file(path.resolve(log.repoPath, workingFileName)),
                            {
                                goBackCommand: new common_1.CommandQuickPickItem({
                                    label: `go back ${constants_1.GlyphChars.ArrowBack}`,
                                    description: `${system_1.Strings.pad(constants_1.GlyphChars.Dash, 2, 3)} to history of ${constants_1.GlyphChars.Space}$(file-text) ${path.basename(uri.fsPath)}${uri.sha ? ` from ${constants_1.GlyphChars.Space}$(git-commit) ${uri.shortSha}` : ''}`
                                }, commands_1.Commands.ShowQuickFileHistory, [
                                    uri,
                                    {
                                        log: log,
                                        maxCount: log.maxCount,
                                        range: log.range,
                                        goBackCommand: options.goBackCommand
                                    }
                                ])
                            }
                        ]));
                    }
                }
                if (options.nextPageCommand) {
                    index++;
                    items.splice(0, 0, options.nextPageCommand);
                }
                if (log.truncated) {
                    const npc = new common_1.CommandQuickPickItem({
                        label: `$(arrow-right) Show Next Commits`,
                        description: `${system_1.Strings.pad(constants_1.GlyphChars.Dash, 2, 3)} shows ${log.maxCount} newer commits`
                    }, commands_1.Commands.ShowQuickFileHistory, [
                        uri,
                        {
                            maxCount: log.maxCount,
                            goBackCommand: options.goBackCommand,
                            nextPageCommand: options.nextPageCommand
                        }
                    ]);
                    const last = system_1.Iterables.last(log.commits.values());
                    if (last != null) {
                        previousPageCommand = new common_1.CommandQuickPickItem({
                            label: `$(arrow-left) Show Previous Commits`,
                            description: `${system_1.Strings.pad(constants_1.GlyphChars.Dash, 2, 3)} shows ${log.maxCount} older commits`
                        }, commands_1.Commands.ShowQuickFileHistory, [
                            new gitService_1.GitUri(uri, last),
                            {
                                maxCount: log.maxCount,
                                goBackCommand: options.goBackCommand,
                                nextPageCommand: npc
                            }
                        ]);
                        index++;
                        items.splice(0, 0, previousPageCommand);
                    }
                }
            }
            if (!options.pickerOnly) {
                const branch = yield git.getBranch(uri.repoPath);
                const currentCommand = new common_1.CommandQuickPickItem({
                    label: `go back ${constants_1.GlyphChars.ArrowBack}`,
                    description: `${system_1.Strings.pad(constants_1.GlyphChars.Dash, 2, 3)} to history of ${constants_1.GlyphChars.Space}$(file-text) ${path.basename(uri.fsPath)}${uri.sha ? ` from ${constants_1.GlyphChars.Space}$(git-commit) ${uri.shortSha}` : ''}`
                }, commands_1.Commands.ShowQuickFileHistory, [
                    uri,
                    {
                        log,
                        maxCount: log.maxCount,
                        range: log.range
                    }
                ]);
                if (options.goBackCommand === undefined) {
                    items.splice(index++, 0, new common_1.CommandQuickPickItem({
                        label: `$(history) Show Branch History`,
                        description: `${system_1.Strings.pad(constants_1.GlyphChars.Dash, 2, 3)} shows  ${constants_1.GlyphChars.Space}$(git-branch) ${branch.name} history`
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
                if (options.goBackCommand) {
                    items.splice(0, 0, options.goBackCommand);
                }
            }
            if (progressCancellation.token.isCancellationRequested)
                return undefined;
            const scope = yield keyboard_1.Keyboard.instance.beginScope({
                left: options.goBackCommand,
                ',': previousPageCommand,
                '.': options.nextPageCommand
            });
            const commit = system_1.Iterables.first(log.commits.values());
            progressCancellation.cancel();
            const pick = yield vscode_1.window.showQuickPick(items, {
                matchOnDescription: true,
                matchOnDetail: true,
                placeHolder: `${commit.getFormattedPath()}${uri.sha ? ` ${system_1.Strings.pad(constants_1.GlyphChars.Dot, 1, 1)} ${uri.shortSha}` : ''}`,
                ignoreFocusOut: common_1.getQuickPickIgnoreFocusOut()
            });
            yield scope.dispose();
            return pick;
        });
    }
}
exports.FileHistoryQuickPick = FileHistoryQuickPick;
//# sourceMappingURL=fileHistory.js.map