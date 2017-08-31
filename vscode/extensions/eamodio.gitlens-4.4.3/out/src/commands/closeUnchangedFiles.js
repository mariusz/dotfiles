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
const activeEditorTracker_1 = require("../activeEditorTracker");
const common_1 = require("./common");
const comparers_1 = require("../comparers");
const constants_1 = require("../constants");
const logger_1 = require("../logger");
const messages_1 = require("../messages");
class CloseUnchangedFilesCommand extends common_1.ActiveEditorCommand {
    constructor(git) {
        super(common_1.Commands.CloseUnchangedFiles);
        this.git = git;
    }
    execute(editor, uri, args = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            uri = common_1.getCommandUri(uri, editor);
            try {
                if (args.uris === undefined) {
                    args = Object.assign({}, args);
                    const repoPath = yield this.git.getRepoPathFromUri(uri);
                    if (!repoPath)
                        return messages_1.Messages.showNoRepositoryWarningMessage(`Unable to close unchanged files`);
                    const status = yield this.git.getStatusForRepo(repoPath);
                    if (status === undefined)
                        return vscode_1.window.showWarningMessage(`Unable to close unchanged files`);
                    args.uris = status.files.map(_ => _.Uri);
                }
                if (args.uris.length === 0)
                    return vscode_1.commands.executeCommand(constants_1.BuiltInCommands.CloseAllEditors);
                const editorTracker = new activeEditorTracker_1.ActiveEditorTracker();
                let count = 0;
                let previous = undefined;
                let editor = vscode_1.window.activeTextEditor;
                while (true) {
                    if (editor !== undefined) {
                        if (comparers_1.TextEditorComparer.equals(previous, editor, { useId: true, usePosition: true })) {
                            break;
                        }
                        if (editor.document !== undefined &&
                            (editor.document.isDirty || args.uris.some(_ => comparers_1.UriComparer.equals(_, editor.document && editor.document.uri)))) {
                            const lastPrevious = previous;
                            previous = editor;
                            editor = yield editorTracker.awaitNext(500);
                            if (comparers_1.TextEditorComparer.equals(lastPrevious, editor, { useId: true, usePosition: true })) {
                                break;
                            }
                            continue;
                        }
                    }
                    previous = editor;
                    editor = yield editorTracker.awaitClose(500);
                    if (previous === undefined && editor === undefined) {
                        count++;
                        if (count >= 4) {
                            break;
                        }
                    }
                    else {
                        count = 0;
                    }
                }
                editorTracker.dispose();
                return undefined;
            }
            catch (ex) {
                logger_1.Logger.error(ex, 'CloseUnchangedFilesCommand');
                return vscode_1.window.showErrorMessage(`Unable to close unchanged files. See output channel for more details`);
            }
        });
    }
}
exports.CloseUnchangedFilesCommand = CloseUnchangedFilesCommand;
//# sourceMappingURL=closeUnchangedFiles.js.map