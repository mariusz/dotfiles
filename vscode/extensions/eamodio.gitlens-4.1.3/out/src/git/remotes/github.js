'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const provider_1 = require("./provider");
class GitHubService extends provider_1.RemoteProvider {
    constructor(domain, path) {
        super(domain, path);
        this.domain = domain;
        this.path = path;
    }
    get name() {
        return 'GitHub';
    }
    getUrlForBranch(branch) {
        return `${this.baseUrl}/commits/${branch}`;
    }
    getUrlForCommit(sha) {
        return `${this.baseUrl}/commit/${sha}`;
    }
    getUrlForFile(fileName, branch, sha, range) {
        let line = '';
        if (range) {
            if (range.start.line === range.end.line) {
                line = `#L${range.start.line}`;
            }
            else {
                line = `#L${range.start.line}-L${range.end.line}`;
            }
        }
        if (sha)
            return `${this.baseUrl}/blob/${sha}/${fileName}${line}`;
        if (branch)
            return `${this.baseUrl}/blob/${branch}/${fileName}${line}`;
        return `${this.baseUrl}?path=${fileName}${line}`;
    }
}
exports.GitHubService = GitHubService;
//# sourceMappingURL=github.js.map