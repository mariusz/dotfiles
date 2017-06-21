"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class StatusBarView {
    constructor(statusBarItem) {
        this.statusBarItem = statusBarItem;
    }
    refresh(text, hasCommand = true) {
        this.statusBarItem.text = '$(git-commit) ' + text;
        this.statusBarItem.tooltip = hasCommand ? 'git blame' : 'git blame - No info about current line';
        this.statusBarItem.command = hasCommand ? "extension.blame" : undefined;
        this.statusBarItem.show();
    }
}
exports.StatusBarView = StatusBarView;
//# sourceMappingURL=view.js.map