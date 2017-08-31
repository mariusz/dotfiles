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
class DiffWithWorkingCommand extends common_1.ActiveEditorCommand {
    constructor(git) {
        super(common_1.Commands.DiffWithWorking);
        this.git = git;
    }
    execute(editor, uri, args = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            uri = common_1.getCommandUri(uri, editor);
            if (uri === undefined)
                return undefined;
            args = Object.assign({}, args);
            if (args.line === undefined) {
                args.line = editor === undefined ? 0 : editor.selection.active.line;
            }
            if (args.commit === undefined || gitService_1.GitService.isUncommitted(args.commit.sha)) {
                const gitUri = yield gitService_1.GitUri.fromUri(uri, this.git);
                if (gitUri.sha === undefined)
                    return vscode_1.window.showInformationMessage(`File matches the working tree`);
                try {
                    args.commit = yield this.git.getLogCommit(gitUri.repoPath, gitUri.fsPath, gitUri.sha, { firstIfMissing: true });
                    if (args.commit === undefined)
                        return messages_1.Messages.showFileNotUnderSourceControlWarningMessage('Unable to open compare');
                }
                catch (ex) {
                    logger_1.Logger.error(ex, 'DiffWithWorkingCommand', `getLogCommit(${gitUri.repoPath}, ${gitUri.fsPath}, ${gitUri.sha})`);
                    return vscode_1.window.showErrorMessage(`Unable to open compare. See output channel for more details`);
                }
            }
            const gitUri = yield gitService_1.GitUri.fromUri(uri, this.git);
            const workingFileName = yield this.git.findWorkingFileName(gitUri.repoPath, gitUri.fsPath);
            if (workingFileName === undefined)
                return undefined;
            try {
                const compare = yield this.git.getVersionedFile(args.commit.repoPath, args.commit.uri.fsPath, args.commit.sha);
                if (args.line !== undefined && args.line !== 0) {
                    if (args.showOptions === undefined) {
                        args.showOptions = {};
                    }
                    args.showOptions.selection = new vscode_1.Range(args.line, 0, args.line, 0);
                }
                yield vscode_1.commands.executeCommand(constants_1.BuiltInCommands.Diff, vscode_1.Uri.file(compare), vscode_1.Uri.file(path.resolve(gitUri.repoPath, workingFileName)), `${path.basename(args.commit.uri.fsPath)} (${args.commit.shortSha}) ${constants_1.GlyphChars.ArrowLeftRight} ${path.basename(workingFileName)}`, args.showOptions);
            }
            catch (ex) {
                logger_1.Logger.error(ex, 'DiffWithWorkingCommand', 'getVersionedFile');
                return vscode_1.window.showErrorMessage(`Unable to open compare. See output channel for more details`);
            }
        });
    }
}
exports.DiffWithWorkingCommand = DiffWithWorkingCommand;
//# sourceMappingURL=diffWithWorking.js.map