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
const vscode_1 = require("vscode");
const common_1 = require("./common");
const constants_1 = require("../constants");
const gitService_1 = require("../gitService");
const logger_1 = require("../logger");
const messages_1 = require("../messages");
const path = require("path");
class DiffLineWithPreviousCommand extends common_1.ActiveEditorCommand {
    constructor(git) {
        super(common_1.Commands.DiffLineWithPrevious);
        this.git = git;
    }
    execute(editor, uri, args = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            uri = common_1.getCommandUri(uri, editor);
            if (uri === undefined)
                return undefined;
            const gitUri = yield gitService_1.GitUri.fromUri(uri, this.git);
            args = Object.assign({}, args);
            if (args.line === undefined) {
                args.line = editor === undefined ? gitUri.offset : editor.selection.active.line;
            }
            if (args.commit === undefined || gitService_1.GitService.isUncommitted(args.commit.sha)) {
                if (editor !== undefined && editor.document !== undefined && editor.document.isDirty)
                    return undefined;
                const blameline = args.line - gitUri.offset;
                if (blameline < 0)
                    return undefined;
                try {
                    const blame = yield this.git.getBlameForLine(gitUri, blameline);
                    if (blame === undefined)
                        return messages_1.Messages.showFileNotUnderSourceControlWarningMessage('Unable to open compare');
                    args.commit = blame.commit;
                    if (gitUri.sha === undefined || gitUri.sha === args.commit.sha) {
                        return vscode_1.commands.executeCommand(common_1.Commands.DiffWithPrevious, new gitService_1.GitUri(uri, args.commit), {
                            line: args.line,
                            showOptions: args.showOptions
                        });
                    }
                    if (args.commit.isUncommitted) {
                        uri = args.commit.uri;
                        args.commit = new gitService_1.GitCommit(args.commit.type, args.commit.repoPath, args.commit.previousSha, args.commit.previousFileName, args.commit.author, args.commit.date, args.commit.message);
                        args.line = (blame.line.line + 1) + gitUri.offset;
                        return vscode_1.commands.executeCommand(common_1.Commands.DiffWithWorking, uri, {
                            commit: args.commit,
                            line: args.line,
                            showOptions: args.showOptions
                        });
                    }
                }
                catch (ex) {
                    logger_1.Logger.error(ex, 'DiffWithPreviousLineCommand', `getBlameForLine(${blameline})`);
                    return vscode_1.window.showErrorMessage(`Unable to open compare. See output channel for more details`);
                }
            }
            try {
                const [rhs, lhs] = yield Promise.all([
                    this.git.getVersionedFile(gitUri.repoPath, gitUri.fsPath, gitUri.sha),
                    this.git.getVersionedFile(args.commit.repoPath, args.commit.uri.fsPath, args.commit.sha)
                ]);
                if (args.line !== undefined && args.line !== 0) {
                    if (args.showOptions === undefined) {
                        args.showOptions = {};
                    }
                    args.showOptions.selection = new vscode_1.Range(args.line, 0, args.line, 0);
                }
                yield vscode_1.commands.executeCommand(constants_1.BuiltInCommands.Diff, vscode_1.Uri.file(lhs), vscode_1.Uri.file(rhs), `${path.basename(args.commit.uri.fsPath)} (${args.commit.shortSha}) ${constants_1.GlyphChars.ArrowLeftRight} ${path.basename(gitUri.fsPath)} (${gitUri.shortSha})`, args.showOptions);
            }
            catch (ex) {
                logger_1.Logger.error(ex, 'DiffWithPreviousLineCommand', 'getVersionedFile');
                return vscode_1.window.showErrorMessage(`Unable to open compare. See output channel for more details`);
            }
        });
    }
}
exports.DiffLineWithPreviousCommand = DiffLineWithPreviousCommand;
//# sourceMappingURL=diffLineWithPrevious.js.map