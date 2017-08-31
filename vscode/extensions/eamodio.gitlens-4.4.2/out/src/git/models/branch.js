'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
class GitBranch {
    constructor(branch) {
        branch = branch.trim();
        if (branch.startsWith('* ')) {
            branch = branch.substring(2);
            this.current = true;
        }
        if (branch.startsWith('remotes/')) {
            branch = branch.substring(8);
            this.remote = true;
        }
        const index = branch.indexOf(' ');
        if (index !== -1) {
            branch = branch.substring(0, index);
        }
        this.name = branch;
    }
}
exports.GitBranch = GitBranch;
//# sourceMappingURL=branch.js.map