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
class ShowQuickCommitFileDetailsCommand extends common_1.ActiveEditorCachedCommand {
    constructor(git) {
        super(common_1.Commands.ShowQuickCommitFileDetails);
        this.git = git;
    }
    execute(editor, uri, args = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            uri = common_1.getCommandUri(uri, editor);
            if (uri === undefined)
                return undefined;
            let workingFileName = args.commit && args.commit.workingFileName;
            const gitUri = yield gitService_1.GitUri.fromUri(uri, this.git);
            args = Object.assign({}, args);
            if (args.sha === undefined) {
                if (editor === undefined)
                    return undefined;
                const blameline = editor.selection.active.line - gitUri.offset;
                if (blameline < 0)
                    return undefined;
                try {
                    const blame = yield this.git.getBlameForLine(gitUri, blameline);
                    if (blame === undefined)
                        return messages_1.Messages.showFileNotUnderSourceControlWarningMessage('Unable to show commit file details');
                    if (blame.commit.isUncommitted)
                        return messages_1.Messages.showLineUncommittedWarningMessage('Unable to show commit file details');
                    args.sha = blame.commit.sha;
                    args.commit = blame.commit;
                    workingFileName = path.relative(args.commit.repoPath, gitUri.fsPath);
                }
                catch (ex) {
                    logger_1.Logger.error(ex, 'ShowQuickCommitFileDetailsCommand', `getBlameForLine(${blameline})`);
                    return vscode_1.window.showErrorMessage(`Unable to show commit file details. See output channel for more details`);
                }
            }
            try {
                if (args.commit === undefined || args.commit.type !== 'file') {
                    if (args.commit !== undefined) {
                        workingFileName = undefined;
                    }
                    if (args.fileLog !== undefined) {
                        args.commit = args.fileLog.commits.get(args.sha);
                        if (args.commit === undefined) {
                            args.fileLog = undefined;
                        }
                    }
                    if (args.fileLog === undefined) {
                        args.commit = yield this.git.getLogCommit(args.commit === undefined ? gitUri.repoPath : args.commit.repoPath, gitUri.fsPath, args.sha, { previous: true });
                        if (args.commit === undefined)
                            return messages_1.Messages.showCommitNotFoundWarningMessage(`Unable to show commit file details`);
                    }
                }
                if (args.commit === undefined)
                    return messages_1.Messages.showCommitNotFoundWarningMessage(`Unable to show commit file details`);
                args.commit.workingFileName = workingFileName;
                args.commit.workingFileName = yield this.git.findWorkingFileName(args.commit);
                const shortSha = args.sha.substring(0, 8);
                if (args.goBackCommand === undefined) {
                    args.goBackCommand = new quickPicks_1.CommandQuickPickItem({
                        label: `go back ${constants_1.GlyphChars.ArrowBack}`,
                        description: `${system_1.Strings.pad(constants_1.GlyphChars.Dash, 2, 3)} to details of ${constants_1.GlyphChars.Space}$(git-commit) ${shortSha}`
                    }, common_1.Commands.ShowQuickCommitDetails, [
                        new gitService_1.GitUri(args.commit.uri, args.commit),
                        {
                            commit: args.commit,
                            sha: args.sha
                        }
                    ]);
                }
                const currentCommand = new quickPicks_1.CommandQuickPickItem({
                    label: `go back ${constants_1.GlyphChars.ArrowBack}`,
                    description: `${system_1.Strings.pad(constants_1.GlyphChars.Dash, 2, 3)} to details of ${constants_1.GlyphChars.Space}$(file-text) ${path.basename(args.commit.fileName)} in ${constants_1.GlyphChars.Space}$(git-commit) ${shortSha}`
                }, common_1.Commands.ShowQuickCommitFileDetails, [
                    new gitService_1.GitUri(args.commit.uri, args.commit),
                    args
                ]);
                const pick = yield quickPicks_1.CommitFileDetailsQuickPick.show(this.git, args.commit, uri, args.goBackCommand, currentCommand, args.fileLog);
                if (pick === undefined)
                    return undefined;
                if (pick instanceof quickPicks_1.CommandQuickPickItem)
                    return pick.execute();
                return undefined;
            }
            catch (ex) {
                logger_1.Logger.error(ex, 'ShowQuickCommitFileDetailsCommand');
                return vscode_1.window.showErrorMessage(`Unable to show commit file details. See output channel for more details`);
            }
        });
    }
}
exports.ShowQuickCommitFileDetailsCommand = ShowQuickCommitFileDetailsCommand;
//# sourceMappingURL=showQuickCommitFileDetails.js.map