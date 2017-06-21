'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const github_1 = require("./github");
class GitLabService extends github_1.GitHubService {
    constructor(domain, path) {
        super(domain, path);
        this.domain = domain;
        this.path = path;
    }
    get name() {
        return 'GitLab';
    }
}
exports.GitLabService = GitLabService;
//# sourceMappingURL=gitlab.js.map