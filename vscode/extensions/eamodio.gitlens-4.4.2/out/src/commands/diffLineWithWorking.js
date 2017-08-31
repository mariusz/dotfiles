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
const gitService_1 = require("../gitService");
const messages_1 = require("../messages");
const logger_1 = require("../logger");
class DiffLineWithWorkingCommand extends common_1.ActiveEditorCommand {
    constructor(git) {
        super(common_1.Commands.DiffLineWithWorking);
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
                    if (args.commit.isUncommitted) {
                        args.commit = new gitService_1.GitCommit(args.commit.type, args.commit.repoPath, args.commit.previousSha, args.commit.previousFileName, args.commit.author, args.commit.date, args.commit.message);
                        args.line = blame.line.line + 1 + gitUri.offset;
                    }
                }
                catch (ex) {
                    logger_1.Logger.error(ex, 'DiffLineWithWorkingCommand', `getBlameForLine(${blameline})`);
                    return vscode_1.window.showErrorMessage(`Unable to open compare. See output channel for more details`);
                }
            }
            return vscode_1.commands.executeCommand(common_1.Commands.DiffWithWorking, uri, args);
        });
    }
}
exports.DiffLineWithWorkingCommand = DiffLineWithWorkingCommand;
//# sourceMappingURL=diffLineWithWorking.js.map