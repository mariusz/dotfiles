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
const quickPicks_1 = require("../quickPicks");
const path = require("path");
class DiffWithRevisionCommand extends common_1.ActiveEditorCommand {
    constructor(git) {
        super(common_1.Commands.DiffWithRevision);
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
            const gitUri = yield gitService_1.GitUri.fromUri(uri, this.git);
            if (args.maxCount == null) {
                args.maxCount = this.git.config.advanced.maxQuickHistory;
            }
            const progressCancellation = quickPicks_1.FileHistoryQuickPick.showProgress(gitUri);
            try {
                const log = yield this.git.getLogForFile(gitUri.repoPath, gitUri.fsPath, gitUri.sha, { maxCount: args.maxCount });
                if (log === undefined)
                    return messages_1.Messages.showFileNotUnderSourceControlWarningMessage('Unable to open history compare');
                if (progressCancellation.token.isCancellationRequested)
                    return undefined;
                const pick = yield quickPicks_1.FileHistoryQuickPick.show(this.git, log, gitUri, progressCancellation, { pickerOnly: true });
                if (pick === undefined)
                    return undefined;
                if (pick instanceof quickPicks_1.CommandQuickPickItem)
                    return pick.execute();
                const compare = yield this.git.getVersionedFile(gitUri.repoPath, gitUri.fsPath, pick.commit.sha);
                if (args.line !== undefined && args.line !== 0) {
                    if (args.showOptions === undefined) {
                        args.showOptions = {};
                    }
                    args.showOptions.selection = new vscode_1.Range(args.line, 0, args.line, 0);
                }
                yield vscode_1.commands.executeCommand(constants_1.BuiltInCommands.Diff, vscode_1.Uri.file(compare), gitUri.fileUri(), `${path.basename(gitUri.fsPath)} (${pick.commit.shortSha}) ${constants_1.GlyphChars.ArrowLeftRight} ${path.basename(gitUri.fsPath)}`, args.showOptions);
            }
            catch (ex) {
                logger_1.Logger.error(ex, 'DiffWithRevisionCommand', 'getVersionedFile');
                return vscode_1.window.showErrorMessage(`Unable to open history compare. See output channel for more details`);
            }
        });
    }
}
exports.DiffWithRevisionCommand = DiffWithRevisionCommand;
//# sourceMappingURL=diffWithRevision.js.map