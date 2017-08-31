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
const messages_1 = require("../messages");
const quickPicks_1 = require("../quickPicks");
class ShowQuickBranchHistoryCommand extends common_1.ActiveEditorCachedCommand {
    constructor(git) {
        super(common_1.Commands.ShowQuickBranchHistory);
        this.git = git;
    }
    execute(editor, uri, args = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            uri = common_1.getCommandUri(uri, editor);
            const gitUri = uri && (yield gitService_1.GitUri.fromUri(uri, this.git));
            args = Object.assign({}, args);
            if (args.maxCount == null) {
                args.maxCount = this.git.config.advanced.maxQuickHistory;
            }
            let progressCancellation = args.branch === undefined ? undefined : quickPicks_1.BranchHistoryQuickPick.showProgress(args.branch);
            try {
                const repoPath = gitUri === undefined ? this.git.repoPath : gitUri.repoPath;
                if (!repoPath)
                    return messages_1.Messages.showNoRepositoryWarningMessage(`Unable to show branch history`);
                if (args.branch === undefined) {
                    const branches = yield this.git.getBranches(repoPath);
                    const pick = yield quickPicks_1.BranchesQuickPick.show(branches, `Show history for branch${constants_1.GlyphChars.Ellipsis}`);
                    if (pick === undefined)
                        return undefined;
                    if (pick instanceof quickPicks_1.CommandQuickPickItem)
                        return pick.execute();
                    args.branch = pick.branch.name;
                    if (args.branch === undefined)
                        return undefined;
                    progressCancellation = quickPicks_1.BranchHistoryQuickPick.showProgress(args.branch);
                }
                if (args.log === undefined) {
                    args.log = yield this.git.getLogForRepo(repoPath, (gitUri && gitUri.sha) || args.branch, args.maxCount);
                    if (args.log === undefined)
                        return vscode_1.window.showWarningMessage(`Unable to show branch history`);
                }
                if (progressCancellation !== undefined && progressCancellation.token.isCancellationRequested)
                    return undefined;
                const pick = yield quickPicks_1.BranchHistoryQuickPick.show(this.git, args.log, gitUri, args.branch, progressCancellation, args.goBackCommand, args.nextPageCommand);
                if (pick === undefined)
                    return undefined;
                if (pick instanceof quickPicks_1.CommandQuickPickItem)
                    return pick.execute();
                const currentCommand = new quickPicks_1.CommandQuickPickItem({
                    label: `go back ${constants_1.GlyphChars.ArrowBack}`,
                    description: `${system_1.Strings.pad(constants_1.GlyphChars.Dash, 2, 3)} to ${constants_1.GlyphChars.Space}$(git-branch) ${args.branch} history`
                }, common_1.Commands.ShowQuickBranchHistory, [
                    uri,
                    args
                ]);
                return vscode_1.commands.executeCommand(common_1.Commands.ShowQuickCommitDetails, new gitService_1.GitUri(pick.commit.uri, pick.commit), {
                    sha: pick.commit.sha,
                    commit: pick.commit,
                    repoLog: args.log,
                    goBackCommand: currentCommand
                });
            }
            catch (ex) {
                logger_1.Logger.error(ex, 'ShowQuickBranchHistoryCommand');
                return vscode_1.window.showErrorMessage(`Unable to show branch history. See output channel for more details`);
            }
            finally {
                progressCancellation && progressCancellation.dispose();
            }
        });
    }
}
exports.ShowQuickBranchHistoryCommand = ShowQuickBranchHistoryCommand;
//# sourceMappingURL=showQuickBranchHistory.js.map