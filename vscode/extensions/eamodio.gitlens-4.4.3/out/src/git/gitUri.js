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
const system_1 = require("../system");
const vscode_1 = require("vscode");
const constants_1 = require("../constants");
const gitService_1 = require("../gitService");
const path = require("path");
class GitUri extends vscode_1.Uri {
    constructor(uri, commitOrRepoPath) {
        super();
        if (!uri)
            return;
        const base = this;
        for (const key in uri) {
            if (uri.hasOwnProperty(key)) {
                base[key] = uri[key];
            }
        }
        this.offset = 0;
        if (uri.scheme === constants_1.DocumentSchemes.GitLensGit) {
            const data = gitService_1.GitService.fromGitContentUri(uri);
            base._fsPath = path.resolve(data.repoPath, data.originalFileName || data.fileName);
            this.offset = (data.decoration && data.decoration.split('\n').length) || 0;
            if (!gitService_1.GitService.isUncommitted(data.sha)) {
                this.sha = data.sha;
                this.repoPath = data.repoPath;
            }
        }
        else if (commitOrRepoPath) {
            if (typeof commitOrRepoPath === 'string') {
                this.repoPath = commitOrRepoPath;
            }
            else {
                const commit = commitOrRepoPath;
                base._fsPath = path.resolve(commit.repoPath, commit.originalFileName || commit.fileName);
                if (commit.repoPath !== undefined) {
                    this.repoPath = commit.repoPath;
                }
                if (commit.sha !== undefined && !gitService_1.GitService.isUncommitted(commit.sha)) {
                    this.sha = commit.sha;
                }
            }
        }
    }
    get shortSha() {
        return this.sha && this.sha.substring(0, 8);
    }
    fileUri() {
        return vscode_1.Uri.file(this.sha ? this.path : this.fsPath);
    }
    getFormattedPath(separator = system_1.Strings.pad(constants_1.GlyphChars.Dot, 2, 2)) {
        let directory = path.dirname(this.fsPath);
        if (this.repoPath) {
            directory = path.relative(this.repoPath, directory);
        }
        directory = gitService_1.GitService.normalizePath(directory);
        return (!directory || directory === '.')
            ? path.basename(this.fsPath)
            : `${path.basename(this.fsPath)}${separator}${directory}`;
    }
    getRelativePath() {
        return gitService_1.GitService.normalizePath(path.relative(this.repoPath || '', this.fsPath));
    }
    static fromUri(uri, git) {
        return __awaiter(this, void 0, void 0, function* () {
            if (uri instanceof GitUri)
                return uri;
            if (!git.isTrackable(uri))
                return new GitUri(uri, git.repoPath);
            if (uri.scheme === constants_1.DocumentSchemes.Git) {
                const commit = yield git.getLogCommit(undefined, uri.fsPath);
                if (commit !== undefined)
                    return new GitUri(uri, commit);
            }
            const gitUri = git.getGitUriForFile(uri);
            if (gitUri)
                return gitUri;
            return new GitUri(uri, (yield git.getRepoPathFromFile(uri.fsPath)) || git.repoPath);
        });
    }
    static fromFileStatus(status, repoPathOrCommit, original = false) {
        const repoPath = typeof repoPathOrCommit === 'string' ? repoPathOrCommit : repoPathOrCommit.repoPath;
        const uri = vscode_1.Uri.file(path.resolve(repoPath, original ? status.originalFileName || status.fileName : status.fileName));
        return new GitUri(uri, repoPathOrCommit);
    }
    static getDirectory(fileName) {
        const directory = gitService_1.GitService.normalizePath(path.dirname(fileName));
        return (!directory || directory === '.') ? '' : directory;
    }
    static getFormattedPath(fileNameOrUri, separator = system_1.Strings.pad(constants_1.GlyphChars.Dot, 2, 2)) {
        let fileName;
        if (fileNameOrUri instanceof vscode_1.Uri) {
            if (fileNameOrUri instanceof GitUri)
                return fileNameOrUri.getFormattedPath(separator);
            fileName = fileNameOrUri.fsPath;
        }
        else {
            fileName = fileNameOrUri;
        }
        const directory = GitUri.getDirectory(fileName);
        return !directory
            ? path.basename(fileName)
            : `${path.basename(fileName)}${separator}${directory}`;
    }
}
exports.GitUri = GitUri;
//# sourceMappingURL=gitUri.js.map