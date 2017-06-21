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
const constants_1 = require("./constants");
const moment = require("moment");
exports.SuppressedKeys = {
    CommitHasNoPreviousCommitWarning: 'suppressCommitHasNoPreviousCommitWarning',
    CommitNotFoundWarning: 'suppressCommitNotFoundWarning',
    FileNotUnderSourceControlWarning: 'suppressFileNotUnderSourceControlWarning',
    GitVersionWarning: 'suppressGitVersionWarning',
    LineUncommittedWarning: 'suppressLineUncommittedWarning',
    NoRepositoryWarning: 'suppressNoRepositoryWarning',
    UpdateNotice: 'suppressUpdateNotice'
};
class Messages {
    static configure(context) {
        this.context = context;
    }
    static showCommitHasNoPreviousCommitWarningMessage(commit) {
        return Messages._showMessage('info', `Commit ${commit.shortSha} (${commit.author}, ${moment(commit.date).fromNow()}) has no previous commit`, exports.SuppressedKeys.CommitHasNoPreviousCommitWarning);
    }
    static showCommitNotFoundWarningMessage(message) {
        return Messages._showMessage('warn', `${message}. The commit could not be found`, exports.SuppressedKeys.CommitNotFoundWarning);
    }
    static showFileNotUnderSourceControlWarningMessage(message) {
        return Messages._showMessage('warn', `${message}. The file is probably not under source control`, exports.SuppressedKeys.FileNotUnderSourceControlWarning);
    }
    static showLineUncommittedWarningMessage(message) {
        return Messages._showMessage('warn', `${message}. The line has uncommitted changes`, exports.SuppressedKeys.LineUncommittedWarning);
    }
    static showNoRepositoryWarningMessage(message) {
        return Messages._showMessage('warn', `${message}. No repository could be found`, exports.SuppressedKeys.NoRepositoryWarning);
    }
    static showUnsupportedGitVersionErrorMessage(version) {
        return Messages._showMessage('error', `GitLens requires a newer version of Git (>= 2.2.0) than is currently installed (${version}). Please install a more recent version of Git.`, exports.SuppressedKeys.GitVersionWarning);
    }
    static showUpdateMessage(version) {
        return __awaiter(this, void 0, void 0, function* () {
            const viewReleaseNotes = 'View Release Notes';
            const result = yield Messages._showMessage('info', `GitLens has been updated to v${version}`, exports.SuppressedKeys.UpdateNotice, undefined, viewReleaseNotes);
            if (result === viewReleaseNotes) {
                vscode_1.commands.executeCommand(constants_1.BuiltInCommands.Open, vscode_1.Uri.parse('https://marketplace.visualstudio.com/items/eamodio.gitlens/changelog'));
            }
            return result;
        });
    }
    static showWelcomeMessage() {
        return __awaiter(this, void 0, void 0, function* () {
            const viewDocs = 'View Docs';
            const result = yield vscode_1.window.showInformationMessage(`Thank you for choosing GitLens! GitLens is powerful, feature rich, and highly configurable, so please be sure to view the docs and tailor it to suit your needs.`, viewDocs);
            if (result === viewDocs) {
                vscode_1.commands.executeCommand(constants_1.BuiltInCommands.Open, vscode_1.Uri.parse('https://marketplace.visualstudio.com/items/eamodio.gitlens'));
            }
            return result;
        });
    }
    static _showMessage(type, message, suppressionKey, dontShowAgain = 'Don\'t Show Again', ...actions) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Messages.context.globalState.get(suppressionKey, false))
                return undefined;
            if (dontShowAgain !== null) {
                actions.push(dontShowAgain);
            }
            let result = undefined;
            switch (type) {
                case 'info':
                    result = yield vscode_1.window.showInformationMessage(message, ...actions);
                    break;
                case 'warn':
                    result = yield vscode_1.window.showWarningMessage(message, ...actions);
                    break;
                case 'error':
                    result = yield vscode_1.window.showErrorMessage(message, ...actions);
                    break;
            }
            if (dontShowAgain === null || result === dontShowAgain) {
                yield Messages.context.globalState.update(suppressionKey, true);
                return undefined;
            }
            return result;
        });
    }
}
exports.Messages = Messages;
//# sourceMappingURL=messages.js.map