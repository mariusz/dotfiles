'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const logCommit_1 = require("./logCommit");
class GitStashCommit extends logCommit_1.GitLogCommit {
    constructor(stashName, repoPath, sha, fileName, date, message, status, fileStatuses, originalFileName, previousSha, previousFileName) {
        super('stash', repoPath, sha, fileName, 'You', date, message, status, fileStatuses, originalFileName, previousSha, previousFileName);
        this.stashName = stashName;
    }
    get shortSha() {
        return this.stashName;
    }
}
exports.GitStashCommit = GitStashCommit;
//# sourceMappingURL=stashCommit.js.map