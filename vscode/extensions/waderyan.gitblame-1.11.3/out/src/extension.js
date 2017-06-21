"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const errorhandler_1 = require("./errorhandler");
const gitblame_1 = require("./gitblame");
const view_1 = require("./view");
const controller_1 = require("./controller");
const editorvalidator_1 = require("./editorvalidator");
const textdecorator_1 = require("./textdecorator");
const vscode_1 = require("vscode");
const valid_url_1 = require("valid-url");
const globalBlamer = new gitblame_1.GitBlame();
function activate(context) {
    return __awaiter(this, void 0, void 0, function* () {
        // Workspace not using a folder. No access to git repo.
        if (!vscode_1.workspace.rootPath) {
            return;
        }
        vscode_1.commands.registerCommand('extension.blame', () => {
            showMessage(context);
        });
        // Try to find the repo first in the workspace, then in parent directories
        // because sometimes one opens a subdirectory but still wants information
        // about the full repo.
        try {
            yield lookupRepo(context);
        }
        catch (err) {
            return;
        }
    });
}
exports.activate = activate;
function lookupRepo(context) {
    return __awaiter(this, void 0, void 0, function* () {
        const statusBar = vscode_1.window.createStatusBarItem(vscode_1.StatusBarAlignment.Left);
        const controller = new controller_1.GitBlameController(globalBlamer, new view_1.StatusBarView(statusBar));
        context.subscriptions.push(controller);
        context.subscriptions.push(globalBlamer);
        return Promise.resolve(controller);
    });
}
function showMessage(context) {
    return __awaiter(this, void 0, void 0, function* () {
        const viewOnlineTitle = 'View';
        const config = vscode_1.workspace.getConfiguration('gitblame');
        const commitUrl = config.get('commitUrl');
        const messageFormat = config.get('infoMessageFormat');
        const editor = vscode_1.window.activeTextEditor;
        let commitInfo = null;
        if (!editorvalidator_1.validEditor(editor))
            return;
        try {
            commitInfo = yield globalBlamer.getLineInfo(editor.document.fileName, editor.selection.active.line);
        }
        catch (err) {
            errorhandler_1.handleErrorToLog(err);
            return;
        }
        const normalizedCommitInfo = textdecorator_1.TextDecorator.normalizeCommitInfoTokens(commitInfo);
        let infoMessageArguments = [];
        let urlToUse = null;
        // Add the message
        infoMessageArguments.push(textdecorator_1.TextDecorator.parseTokens(messageFormat, normalizedCommitInfo));
        if (commitUrl) {
            // If we have a commitUrl we parse it and add it
            let parsedUrl = textdecorator_1.TextDecorator.parseTokens(commitUrl, {
                'hash': commitInfo.hash
            });
            if (valid_url_1.isWebUri(parsedUrl)) {
                urlToUse = vscode_1.Uri.parse(parsedUrl);
            }
            else {
                vscode_1.window.showErrorMessage('Malformed URL in setting gitblame.commitUrl. Must be a valid web url.');
            }
            if (urlToUse) {
                infoMessageArguments.push(viewOnlineTitle);
            }
        }
        const item = yield vscode_1.window.showInformationMessage.apply(this, infoMessageArguments);
        if (item === viewOnlineTitle) {
            vscode_1.commands.executeCommand('vscode.open', urlToUse);
        }
    });
}
//# sourceMappingURL=extension.js.map