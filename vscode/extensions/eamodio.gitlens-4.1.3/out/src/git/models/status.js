'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const system_1 = require("../../system");
const vscode_1 = require("vscode");
const constants_1 = require("../../constants");
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
    getFormattedPath(separator = system_1.Strings.pad(constants_1.GlyphChars.Dot, 2, 2)) {
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
            ? `${directory} ${system_1.Strings.pad(constants_1.GlyphChars.ArrowLeft, 1, 1)} ${status.originalFileName}`
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
function getGitStatusIcon(status, missing = constants_1.GlyphChars.Space.repeat(4)) {
    return statusOcticonsMap[status] || missing;
}
exports.getGitStatusIcon = getGitStatusIcon;
//# sourceMappingURL=status.js.map