'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const commit_1 = require("./commit");
class GitBlameCommit extends commit_1.GitCommit {
    constructor(repoPath, sha, fileName, author, date, message, lines, originalFileName, previousSha, previousFileName) {
        super('blame', repoPath, sha, fileName, author, date, message, originalFileName, previousSha, previousFileName);
        this.lines = lines;
    }
}
exports.GitBlameCommit = GitBlameCommit;
//# sourceMappingURL=blameCommit.js.map