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
const gitService_1 = require("../gitService");
const logger_1 = require("../logger");
const messages_1 = require("../messages");
const explorerNodes_1 = require("../views/explorerNodes");
class OpenCommitInRemoteCommand extends common_1.ActiveEditorCommand {
    constructor(git) {
        super(common_1.Commands.OpenCommitInRemote);
        this.git = git;
    }
    preExecute(context, args = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            if (context.type === 'view' && context.node instanceof explorerNodes_1.CommitNode) {
                args = Object.assign({}, args);
                args.sha = context.node.commit.sha;
                return this.execute(context.editor, context.node.commit.uri, args);
            }
            return this.execute(context.editor, context.uri, args);
        });
    }
    execute(editor, uri, args = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            uri = common_1.getCommandUri(uri, editor);
            if (uri === undefined)
                return undefined;
            if (editor !== undefined && editor.document !== undefined && editor.document.isDirty)
                return undefined;
            const gitUri = yield gitService_1.GitUri.fromUri(uri, this.git);
            if (!gitUri.repoPath)
                return undefined;
            try {
                if (args.sha === undefined) {
                    const line = editor === undefined ? gitUri.offset : editor.selection.active.line;
                    const blameline = line - gitUri.offset;
                    if (blameline < 0)
                        return undefined;
                    const blame = yield this.git.getBlameForLine(gitUri, blameline);
                    if (blame === undefined)
                        return messages_1.Messages.showFileNotUnderSourceControlWarningMessage('Unable to open commit in remote provider');
                    let commit = blame.commit;
                    if (commit.isUncommitted) {
                        commit = new gitService_1.GitBlameCommit(commit.repoPath, commit.previousSha, commit.previousFileName, commit.author, commit.date, commit.message, []);
                    }
                    args.sha = commit.sha;
                }
                const remotes = system_1.Arrays.uniqueBy(yield this.git.getRemotes(gitUri.repoPath), _ => _.url, _ => !!_.provider);
                return vscode_1.commands.executeCommand(common_1.Commands.OpenInRemote, uri, {
                    resource: {
                        type: 'commit',
                        sha: args.sha
                    },
                    remotes
                });
            }
            catch (ex) {
                logger_1.Logger.error(ex, 'OpenCommitInRemoteCommand');
                return vscode_1.window.showErrorMessage(`Unable to open commit in remote provider. See output channel for more details`);
            }
        });
    }
}
exports.OpenCommitInRemoteCommand = OpenCommitInRemoteCommand;
//# sourceMappingURL=openCommitInRemote.js.map