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
const copy_paste_1 = require("copy-paste");
class CopyMessageToClipboardCommand extends common_1.ActiveEditorCommand {
    constructor(git) {
        super(common_1.Commands.CopyMessageToClipboard);
        this.git = git;
    }
    execute(editor, uri, args = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            uri = common_1.getCommandUri(uri, editor);
            try {
                if (uri === undefined) {
                    if (!this.git.repoPath)
                        return undefined;
                    const log = yield this.git.getLogForRepo(this.git.repoPath, undefined, 1);
                    if (!log)
                        return undefined;
                    args.message = system_1.Iterables.first(log.commits.values()).message;
                    copy_paste_1.copy(args.message);
                    return undefined;
                }
                const gitUri = yield gitService_1.GitUri.fromUri(uri, this.git);
                if (args.message === undefined) {
                    if (args.sha === undefined) {
                        if (editor !== undefined && editor.document !== undefined && editor.document.isDirty)
                            return undefined;
                        const line = (editor && editor.selection.active.line) || gitUri.offset;
                        const blameline = line - gitUri.offset;
                        if (blameline < 0)
                            return undefined;
                        try {
                            const blame = yield this.git.getBlameForLine(gitUri, blameline);
                            if (!blame)
                                return undefined;
                            if (blame.commit.isUncommitted)
                                return undefined;
                            args.sha = blame.commit.sha;
                            if (!gitUri.repoPath) {
                                gitUri.repoPath = blame.commit.repoPath;
                            }
                        }
                        catch (ex) {
                            logger_1.Logger.error(ex, 'CopyMessageToClipboardCommand', `getBlameForLine(${blameline})`);
                            return vscode_1.window.showErrorMessage(`Unable to copy message. See output channel for more details`);
                        }
                    }
                    const commit = yield this.git.getLogCommit(gitUri.repoPath, gitUri.fsPath, args.sha);
                    if (!commit)
                        return undefined;
                    args.message = commit.message;
                }
                copy_paste_1.copy(args.message);
                return undefined;
            }
            catch (ex) {
                logger_1.Logger.error(ex, 'CopyMessageToClipboardCommand');
                return vscode_1.window.showErrorMessage(`Unable to copy message. See output channel for more details`);
            }
        });
    }
}
exports.CopyMessageToClipboardCommand = CopyMessageToClipboardCommand;
//# sourceMappingURL=copyMessageToClipboard.js.map