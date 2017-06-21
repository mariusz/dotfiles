"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
function getGitCommand() {
    const gitConfig = vscode_1.workspace.getConfiguration('git');
    return gitConfig.get('path', 'git') || 'git';
}
exports.getGitCommand = getGitCommand;
//# sourceMappingURL=getgitcommand.js.map