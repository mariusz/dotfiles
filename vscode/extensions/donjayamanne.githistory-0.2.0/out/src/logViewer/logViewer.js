"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const vscode = require('vscode');
const htmlGenerator = require('./htmlGenerator');
const gitHistory = require('../helpers/gitHistory');
const path = require('path');
const gitHistorySchema = 'git-history-viewer';
const PAGE_SIZE = 50;
let previewUri = vscode.Uri.parse(gitHistorySchema + '://authority/git-history');
let historyRetrieved;
let pageIndex = 0;
let pageSize = PAGE_SIZE;
let canGoPrevious = false;
let canGoNext = true;
class TextDocumentContentProvider {
    constructor() {
        this._onDidChange = new vscode.EventEmitter();
    }
    provideTextDocumentContent(uri, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const entries = yield gitHistory.getLogEntries(vscode.workspace.rootPath, pageIndex, pageSize);
                canGoPrevious = pageIndex > 0;
                canGoNext = entries.length === pageSize;
                this.entries = entries;
                let html = this.generateHistoryView();
                return html;
            }
            catch (error) {
                return this.generateErrorView(error);
            }
        });
    }
    get onDidChange() {
        return this._onDidChange.event;
    }
    update(uri) {
        this._onDidChange.fire(uri);
    }
    getStyleSheetPath(resourceName) {
        return vscode.Uri.file(path.join(__dirname, '..', '..', '..', 'resources', resourceName)).toString();
    }
    getScriptFilePath(resourceName) {
        return vscode.Uri.file(path.join(__dirname, '..', '..', 'src', 'browser', resourceName)).toString();
    }
    getNodeModulesPath(resourceName) {
        return vscode.Uri.file(path.join(__dirname, '..', '..', '..', 'node_modules', resourceName)).toString();
    }
    generateErrorView(error) {
        return `
            <head>
                <link rel="stylesheet" href="${this.getNodeModulesPath(path.join('normalize.css', 'normalize.css'))}" >
                <link rel="stylesheet" href="${this.getStyleSheetPath(path.join('octicons', 'font', 'octicons.css'))}" >
                <link rel="stylesheet" href="${this.getStyleSheetPath('animate.min.css')}" >
                <link rel="stylesheet" href="${this.getStyleSheetPath('main.css')}" >
            </head>
            <body>
                ${htmlGenerator.generateErrorView(error)}
            </body>
        `;
    }
    generateHistoryView() {
        const innerHtml = htmlGenerator.generateHistoryHtmlView(this.entries, canGoPrevious, canGoNext);
        return `
            <head>
                <link rel="stylesheet" href="${this.getNodeModulesPath(path.join('normalize.css', 'normalize.css'))}" >
                <link rel="stylesheet" href="${this.getStyleSheetPath(path.join('octicons', 'font', 'octicons.css'))}" >
                <link rel="stylesheet" href="${this.getStyleSheetPath('animate.min.css')}" >
                <link rel="stylesheet" href="${this.getStyleSheetPath('hint.min.css')}" >
                <link rel="stylesheet" href="${this.getStyleSheetPath('main.css')}" >
                <script src="${this.getNodeModulesPath(path.join('jquery', 'dist', 'jquery.min.js'))}"></script>
                <script src="${this.getNodeModulesPath(path.join('clipboard', 'dist', 'clipboard.min.js'))}"></script>
                <script src="${this.getScriptFilePath('proxy.js')}"></script>
                <script src="${this.getScriptFilePath('svgGenerator.js')}"></script>
                <script src="${this.getScriptFilePath('detailsView.js')}"></script>
            </head>

            <body>
                ${innerHtml}
            </body>
        `;
    }
}
function activate(context) {
    let provider = new TextDocumentContentProvider();
    let registration = vscode.workspace.registerTextDocumentContentProvider(gitHistorySchema, provider);
    let disposable = vscode.commands.registerCommand('git.viewHistory', () => {
        // Unique name everytime, so that we always refresh the history log
        // Untill we add a refresh button to the view
        historyRetrieved = false;
        pageIndex = 0;
        canGoPrevious = false;
        canGoNext = true;
        previewUri = vscode.Uri.parse(gitHistorySchema + '://authority/git-history?x=' + new Date().getTime().toString());
        return vscode.commands.executeCommand('vscode.previewHtml', previewUri, vscode.ViewColumn.One, 'Git History (git log)').then((success) => {
        }, (reason) => {
            vscode.window.showErrorMessage(reason);
        });
    });
    context.subscriptions.push(disposable, registration);
    disposable = vscode.commands.registerCommand('git.copyText', (sha) => {
        vscode.window.showInformationMessage(sha);
    });
    context.subscriptions.push(disposable);
    disposable = vscode.commands.registerCommand('git.logNavigate', (direction) => {
        pageIndex = pageIndex + (direction === 'next' ? 1 : -1);
        provider.update(previewUri);
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
//# sourceMappingURL=logViewer.js.map