'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const gitUri_1 = require("../gitUri");
const path = require("path");
class GitStatusFile {
    constructor(repoPath, status, fileName, staged, originalFileName) {
        this.repoPath = repoPath;
        this.status = status;
        this.fileName = fileName;
        this.staged = staged;
        this.originalFileName = originalFileName;
    }
    getFormattedDirectory(includeOriginal = false) {
        return GitStatusFile.getFormattedDirectory(this, includeOriginal);
    }
    getFormattedPath(separator = ' \u00a0\u2022\u00a0 ') {
        return gitUri_1.GitUri.getFormattedPath(this.fileName, separator);
    }
    getIcon() {
        return getGitStatusIcon(this.status);
    }
    get Uri() {
        return vscode_1.Uri.file(path.resolve(this.repoPath, this.fileName));
    }
    static getFormattedDirectory(status, includeOriginal = false) {
        const directory = gitUri_1.GitUri.getDirectory(status.fileName);
        return (includeOriginal && status.status === 'R' && status.originalFileName)
            ? `${directory} \u00a0\u2190\u00a0 ${status.originalFileName}`
            : directory;
    }
}
exports.GitStatusFile = GitStatusFile;
const statusOcticonsMap = {
    '!': '$(diff-ignored)',
    '?': '$(diff-added)',
    A: '$(diff-added)',
    C: '$(diff-added)',
    D: '$(diff-removed)',
    M: '$(diff-modified)',
    R: '$(diff-renamed)',
    U: '$(question)'
};
function getGitStatusIcon(status, missing = '\u00a0\u00a0\u00a0\u00a0') {
    return statusOcticonsMap[status] || missing;
}
exports.getGitStatusIcon = getGitStatusIcon;
//# sourceMappingURL=status.js.map