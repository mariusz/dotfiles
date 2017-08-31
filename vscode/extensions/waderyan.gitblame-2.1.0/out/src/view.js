"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const textdecorator_1 = require("./util/textdecorator");
const spinner_1 = require("./util/spinner");
const blame_1 = require("./git/blame");
class StatusBarView {
    constructor() {
        this.spinnerActive = false;
        this.prefix = '$(git-commit)';
        this.statusBarItem = vscode_1.window.createStatusBarItem(vscode_1.StatusBarAlignment.Left);
        this.spinner = new spinner_1.Spinner();
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new StatusBarView();
        }
        return this.instance;
    }
    setText(text, hasCommand = true) {
        this.statusBarItem.text = text ? `${this.prefix} ${text}` : this.prefix;
        this.statusBarItem.tooltip = hasCommand ? 'git blame' : 'git blame - No info about the current line';
        this.statusBarItem.command = hasCommand ? 'gitblame.quickInfo' : '';
        this.statusBarItem.show();
    }
    clear() {
        this.stopProgress();
        this.setText('', false);
    }
    update(commitInfo) {
        this.stopProgress();
        if (commitInfo && !blame_1.GitBlame.isGeneratedCommit(commitInfo)) {
            const clickable = !blame_1.GitBlame.isBlankCommit(commitInfo);
            this.setText(textdecorator_1.TextDecorator.toTextView(commitInfo), clickable);
        }
        else {
            this.clear();
        }
    }
    stopProgress() {
        clearInterval(this.progressInterval);
        this.spinnerActive = false;
    }
    startProgress() {
        if (this.spinnerActive) {
            return;
        }
        this.stopProgress();
        if (this.spinner.updatable()) {
            this.progressInterval = setInterval(() => {
                this.setSpinner();
            }, 100);
        }
        else {
            this.setSpinner();
        }
        this.spinnerActive = true;
    }
    setSpinner() {
        this.setText(`${this.spinner} Waiting for git blame response`, false);
        ;
    }
    dispose() {
        this.stopProgress();
        this.statusBarItem.dispose();
    }
}
exports.StatusBarView = StatusBarView;
//# sourceMappingURL=view.js.map