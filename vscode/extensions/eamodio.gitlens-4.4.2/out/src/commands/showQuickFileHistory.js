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
const common_1 = require("./common");
const constants_1 = require("../constants");
const gitService_1 = require("../gitService");
const logger_1 = require("../logger");
const quickPicks_1 = require("../quickPicks");
const messages_1 = require("../messages");
const path = require("path");
class ShowQuickFileHistoryCommand extends common_1.ActiveEditorCachedCommand {
    constructor(git) {
        super(common_1.Commands.ShowQuickFileHistory);
        this.git = git;
    }
    execute(editor, uri, args = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            uri = common_1.getCommandUri(uri, editor);
            if (uri === undefined)
                return vscode_1.commands.executeCommand(common_1.Commands.ShowQuickCurrentBranchHistory);
            const gitUri = yield gitService_1.GitUri.fromUri(uri, this.git);
            args = Object.assign({}, args);
            if (args.maxCount == null) {
                args.maxCount = this.git.config.advanced.maxQuickHistory;
            }
            const progressCancellation = quickPicks_1.FileHistoryQuickPick.showProgress(gitUri);
            try {
                if (args.log === undefined) {
                    args.log = yield this.git.getLogForFile(gitUri.repoPath, gitUri.fsPath, gitUri.sha, { maxCount: args.maxCount, range: args.range });
                    if (args.log === undefined)
                        return messages_1.Messages.showFileNotUnderSourceControlWarningMessage('Unable to show file history');
                }
                if (progressCancellation.token.isCancellationRequested)
                    return undefined;
                const pick = yield quickPicks_1.FileHistoryQuickPick.show(this.git, args.log, gitUri, progressCancellation, { goBackCommand: args.goBackCommand, nextPageCommand: args.nextPageCommand });
                if (pick === undefined)
                    return undefined;
                if (pick instanceof quickPicks_1.CommandQuickPickItem)
                    return pick.execute();
                const currentCommand = new quickPicks_1.CommandQuickPickItem({
                    label: `go back ${constants_1.GlyphChars.ArrowBack}`,
                    description: `${system_1.Strings.pad(constants_1.GlyphChars.Dash, 2, 3)} to history of ${constants_1.GlyphChars.Space}$(file-text) ${path.basename(pick.commit.fileName)}${gitUri.sha ? ` from ${constants_1.GlyphChars.Space}$(git-commit) ${gitUri.shortSha}` : ''}`
                }, common_1.Commands.ShowQuickFileHistory, [
                    uri,
                    args
                ]);
                return vscode_1.commands.executeCommand(common_1.Commands.ShowQuickCommitFileDetails, new gitService_1.GitUri(pick.commit.uri, pick.commit), {
                    commit: pick.commit,
                    fileLog: args.log,
                    sha: pick.commit.sha,
                    goBackCommand: currentCommand
                });
            }
            catch (ex) {
                logger_1.Logger.error(ex, 'ShowQuickFileHistoryCommand');
                return vscode_1.window.showErrorMessage(`Unable to show file history. See output channel for more details`);
            }
            finally {
                progressCancellation.dispose();
            }
        });
    }
}
exports.ShowQuickFileHistoryCommand = ShowQuickFileHistoryCommand;
//# sourceMappingURL=showQuickFileHistory.js.map