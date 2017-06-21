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
const commands_1 = require("./commands");
const constants_1 = require("./constants");
const gitService_1 = require("./gitService");
class GitDiffWithWorkingCodeLens extends vscode_1.CodeLens {
    constructor(git, fileName, commit, range) {
        super(range);
        this.fileName = fileName;
        this.commit = commit;
    }
}
exports.GitDiffWithWorkingCodeLens = GitDiffWithWorkingCodeLens;
class GitDiffWithPreviousCodeLens extends vscode_1.CodeLens {
    constructor(git, fileName, commit, range) {
        super(range);
        this.fileName = fileName;
        this.commit = commit;
    }
}
exports.GitDiffWithPreviousCodeLens = GitDiffWithPreviousCodeLens;
class GitRevisionCodeLensProvider {
    constructor(context, git) {
        this.git = git;
    }
    provideCodeLenses(document, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = gitService_1.GitService.fromGitContentUri(document.uri);
            const gitUri = new gitService_1.GitUri(vscode_1.Uri.file(data.fileName), data);
            const lenses = [];
            const commit = yield this.git.getLogCommit(gitUri.repoPath, gitUri.fsPath, gitUri.sha, { firstIfMissing: true, previous: true });
            if (!commit)
                return lenses;
            lenses.push(new GitDiffWithWorkingCodeLens(this.git, commit.uri.fsPath, commit, new vscode_1.Range(0, 0, 0, 1)));
            if (commit.previousSha) {
                lenses.push(new GitDiffWithPreviousCodeLens(this.git, commit.previousUri.fsPath, commit, new vscode_1.Range(0, 1, 0, 2)));
            }
            return lenses;
        });
    }
    resolveCodeLens(lens, token) {
        if (lens instanceof GitDiffWithWorkingCodeLens)
            return this._resolveDiffWithWorkingTreeCodeLens(lens, token);
        if (lens instanceof GitDiffWithPreviousCodeLens)
            return this._resolveGitDiffWithPreviousCodeLens(lens, token);
        return Promise.reject(undefined);
    }
    _resolveDiffWithWorkingTreeCodeLens(lens, token) {
        lens.command = {
            title: `Compare ${lens.commit.shortSha} with Working Tree`,
            command: commands_1.Commands.DiffWithWorking,
            arguments: [
                vscode_1.Uri.file(lens.fileName),
                {
                    commit: lens.commit,
                    line: lens.range.start.line
                }
            ]
        };
        return Promise.resolve(lens);
    }
    _resolveGitDiffWithPreviousCodeLens(lens, token) {
        lens.command = {
            title: `Compare ${lens.commit.shortSha} with Previous ${lens.commit.previousShortSha}`,
            command: commands_1.Commands.DiffWithPrevious,
            arguments: [
                vscode_1.Uri.file(lens.fileName),
                {
                    commit: lens.commit,
                    line: lens.range.start.line
                }
            ]
        };
        return Promise.resolve(lens);
    }
}
GitRevisionCodeLensProvider.selector = { scheme: constants_1.DocumentSchemes.GitLensGit };
exports.GitRevisionCodeLensProvider = GitRevisionCodeLensProvider;
//# sourceMappingURL=gitRevisionCodeLensProvider.js.map