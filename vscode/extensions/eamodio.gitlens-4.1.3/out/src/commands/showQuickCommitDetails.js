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
class ShowQuickCommitDetailsCommand extends common_1.ActiveEditorCachedCommand {
    constructor(git) {
        super(common_1.Commands.ShowQuickCommitDetails);
        this.git = git;
    }
    execute(editor, uri, args = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            uri = common_1.getCommandUri(uri, editor);
            if (uri === undefined)
                return undefined;
            const gitUri = yield gitService_1.GitUri.fromUri(uri, this.git);
            let repoPath = gitUri.repoPath;
            let workingFileName = path.relative(repoPath || '', gitUri.fsPath);
            if (args.sha === undefined) {
                if (editor === undefined)
                    return undefined;
                const blameline = editor.selection.active.line - gitUri.offset;
                if (blameline < 0)
                    return undefined;
                try {
                    const blame = yield this.git.getBlameForLine(gitUri, blameline);
                    if (blame === undefined)
                        return messages_1.Messages.showFileNotUnderSourceControlWarningMessage('Unable to show commit details');
                    if (blame.commit.isUncommitted)
                        return messages_1.Messages.showLineUncommittedWarningMessage('Unable to show commit details');
                    args.sha = blame.commit.sha;
                    repoPath = blame.commit.repoPath;
                    workingFileName = blame.commit.fileName;
                    args.commit = blame.commit;
                }
                catch (ex) {
                    logger_1.Logger.error(ex, 'ShowQuickCommitDetailsCommand', `getBlameForLine(${blameline})`);
                    return vscode_1.window.showErrorMessage(`Unable to show commit details. See output channel for more details`);
                }
            }
            try {
                if (args.commit === undefined || (args.commit.type !== 'branch' && args.commit.type !== 'stash')) {
                    if (args.repoLog !== undefined) {
                        args.commit = args.repoLog.commits.get(args.sha);
                        if (args.commit === undefined) {
                            args.repoLog = undefined;
                        }
                    }
                    if (args.repoLog === undefined) {
                        const log = yield this.git.getLogForRepo(repoPath, args.sha, 2);
                        if (log === undefined)
                            return messages_1.Messages.showCommitNotFoundWarningMessage(`Unable to show commit details`);
                        args.commit = log.commits.get(args.sha);
                    }
                }
                if (args.commit === undefined)
                    return messages_1.Messages.showCommitNotFoundWarningMessage(`Unable to show commit details`);
                if (args.commit.workingFileName === undefined) {
                    args.commit.workingFileName = workingFileName;
                }
                if (args.goBackCommand === undefined) {
                    args.goBackCommand = new quickPicks_1.CommandQuickPickItem({
                        label: `go back ${constants_1.GlyphChars.ArrowBack}`,
                        description: `${system_1.Strings.pad(constants_1.GlyphChars.Dash, 2, 3)} to branch history`
                    }, common_1.Commands.ShowQuickCurrentBranchHistory, [
                        new gitService_1.GitUri(args.commit.uri, args.commit)
                    ]);
                }
                const currentCommand = new quickPicks_1.CommandQuickPickItem({
                    label: `go back ${constants_1.GlyphChars.ArrowBack}`,
                    description: `${system_1.Strings.pad(constants_1.GlyphChars.Dash, 2, 3)} to details of ${constants_1.GlyphChars.Space}$(git-commit) ${args.commit.shortSha}`
                }, common_1.Commands.ShowQuickCommitDetails, [
                    new gitService_1.GitUri(args.commit.uri, args.commit),
                    args
                ]);
                const pick = yield quickPicks_1.CommitDetailsQuickPick.show(this.git, args.commit, uri, args.goBackCommand, currentCommand, args.repoLog);
                if (pick === undefined)
                    return undefined;
                if (!(pick instanceof quickPicks_1.CommitWithFileStatusQuickPickItem))
                    return pick.execute();
                return vscode_1.commands.executeCommand(common_1.Commands.ShowQuickCommitFileDetails, pick.gitUri, {
                    commit: args.commit,
                    sha: pick.sha,
                    goBackCommand: currentCommand
                });
            }
            catch (ex) {
                logger_1.Logger.error(ex, 'ShowQuickCommitDetailsCommand');
                return vscode_1.window.showErrorMessage(`Unable to show commit details. See output channel for more details`);
            }
        });
    }
}
exports.ShowQuickCommitDetailsCommand = ShowQuickCommitDetailsCommand;
//# sourceMappingURL=showQuickCommitDetails.js.map