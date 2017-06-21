'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const git_1 = require("../git");
const gitUri_1 = require("../gitUri");
const path = require("path");
class GitCommit {
    constructor(type, repoPath, sha, fileName, author, date, message, originalFileName, previousSha, previousFileName) {
        this.repoPath = repoPath;
        this.sha = sha;
        this.fileName = fileName;
        this.author = author;
        this.date = date;
        this.message = message;
        this.type = type;
        this.fileName = this.fileName && this.fileName.replace(/, ?$/, '');
        this.originalFileName = originalFileName;
        this.previousSha = previousSha;
        this.previousFileName = previousFileName;
    }
    get shortSha() {
        return this.sha.substring(0, 8);
    }
    get isUncommitted() {
        if (this._isUncommitted === undefined) {
            this._isUncommitted = git_1.Git.isUncommitted(this.sha);
        }
        return this._isUncommitted;
    }
    get previousShortSha() {
        return this.previousSha && this.previousSha.substring(0, 8);
    }
    get previousUri() {
        return this.previousFileName ? vscode_1.Uri.file(path.resolve(this.repoPath, this.previousFileName)) : this.uri;
    }
    get uri() {
        return vscode_1.Uri.file(path.resolve(this.repoPath, this.originalFileName || this.fileName));
    }
    getFormattedPath(separator = ' \u00a0\u2022\u00a0 ') {
        return gitUri_1.GitUri.getFormattedPath(this.fileName, separator);
    }
}
exports.GitCommit = GitCommit;
//# sourceMappingURL=commit.js.map