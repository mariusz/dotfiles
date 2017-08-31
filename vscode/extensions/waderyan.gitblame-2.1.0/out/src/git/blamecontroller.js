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
const valid_url_1 = require("valid-url");
const vscode_1 = require("vscode");
const errorhandler_1 = require("../util/errorhandler");
const textdecorator_1 = require("../util/textdecorator");
const blame_1 = require("./blame");
const view_1 = require("../view");
const property_1 = require("../util/property");
const constants_1 = require("../constants");
class GitBlameController {
    constructor() {
        this.statusBarView = view_1.StatusBarView.getInstance();
        this.gitBlame = new blame_1.GitBlame();
        this.setupDisposables();
        this.setupListeners();
        this.init();
    }
    setupDisposables() {
        const disposables = [];
        // The controller does not use the ErrorHandler but
        // is responsible for keeping it disposable
        const errorHandler = errorhandler_1.ErrorHandler.getInstance();
        const propertyHolder = property_1.Property.getInstance();
        this.disposable = vscode_1.Disposable.from(this.statusBarView, this.gitBlame, errorHandler, propertyHolder);
    }
    setupListeners() {
        const disposables = [];
        vscode_1.window.onDidChangeActiveTextEditor(this.onTextEditorMove, this, disposables);
        vscode_1.window.onDidChangeTextEditorSelection(this.onTextEditorMove, this, disposables);
        vscode_1.workspace.onDidSaveTextDocument(this.onTextEditorMove, this, disposables);
        this.disposable = vscode_1.Disposable.from(this.disposable, ...disposables);
    }
    init() {
        this.onTextEditorMove();
    }
    onTextEditorMove() {
        return __awaiter(this, void 0, void 0, function* () {
            const beforeBlameOpenFile = this.getCurrentActiveFileName();
            const beforeBlameLineNumber = this.getCurrentActiveLineNumber();
            const commitInfo = yield this.gitBlame.getCurrentLineInfo();
            // Only update if we haven't moved since we started blaming
            if (beforeBlameOpenFile === this.getCurrentActiveFileName() && beforeBlameLineNumber === this.getCurrentActiveLineNumber()) {
                this.updateView(commitInfo);
            }
        });
    }
    getCurrentActiveFileName() {
        return vscode_1.window.activeTextEditor && vscode_1.window.activeTextEditor.document.fileName;
    }
    getCurrentActiveLineNumber() {
        return vscode_1.window.activeTextEditor && vscode_1.window.activeTextEditor.selection.active.line;
    }
    showMessage() {
        return __awaiter(this, void 0, void 0, function* () {
            const commitInfo = yield this.getCommitInfo();
            const commitToolUrl = this.getToolUrl(commitInfo);
            const messageFormat = property_1.Property.get(property_1.Properties.InfoMessageFormat);
            const normalizedTokens = textdecorator_1.TextDecorator.normalizeCommitInfoTokens(commitInfo);
            const message = textdecorator_1.TextDecorator.parseTokens(messageFormat, normalizedTokens);
            const extraAction = commitToolUrl ? constants_1.TITLE_VIEW_ONLINE : '';
            this.updateView(commitInfo);
            const item = yield vscode_1.window.showInformationMessage(message, extraAction);
            if (item === constants_1.TITLE_VIEW_ONLINE) {
                vscode_1.commands.executeCommand('vscode.open', commitToolUrl);
            }
        });
    }
    blameLink() {
        return __awaiter(this, void 0, void 0, function* () {
            const commitInfo = yield this.getCommitInfo();
            const commitToolUrl = this.getToolUrl(commitInfo);
            if (commitToolUrl) {
                vscode_1.commands.executeCommand('vscode.open', commitToolUrl);
            }
            else {
                vscode_1.window.showErrorMessage('Missing gitblame.commitUrl configuration value.');
            }
        });
    }
    getCommitInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            let commitInfo = yield this.gitBlame.getCurrentLineInfo();
            if (blame_1.GitBlame.isGeneratedCommit(commitInfo)) {
                vscode_1.window.showErrorMessage('The current file and line can not be blamed.');
            }
            return commitInfo;
        });
    }
    getToolUrl(commitInfo) {
        if (blame_1.GitBlame.isBlankCommit(commitInfo)) {
            return;
        }
        const parsedUrl = textdecorator_1.TextDecorator.parseTokens(property_1.Property.get(property_1.Properties.CommitUrl), {
            'hash': commitInfo.hash
        });
        if (valid_url_1.isWebUri(parsedUrl)) {
            return vscode_1.Uri.parse(parsedUrl);
        }
        else if (parsedUrl) {
            vscode_1.window.showErrorMessage('Malformed URL in setting gitblame.commitUrl. Must be a valid web url.');
        }
    }
    updateView(commitInfo) {
        if (blame_1.GitBlame.isGeneratedCommit(commitInfo)) {
            this.statusBarView.clear();
        }
        else {
            this.statusBarView.update(commitInfo);
        }
    }
    dispose() {
        this.disposable.dispose();
    }
}
exports.GitBlameController = GitBlameController;
//# sourceMappingURL=blamecontroller.js.map