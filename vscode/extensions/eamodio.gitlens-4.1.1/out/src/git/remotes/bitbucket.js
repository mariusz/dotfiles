'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const provider_1 = require("./provider");
class BitbucketService extends provider_1.RemoteProvider {
    constructor(domain, path) {
        super(domain, path);
        this.domain = domain;
        this.path = path;
    }
    get name() {
        return 'Bitbucket';
    }
    getUrlForBranch(branch) {
        return `${this.baseUrl}/commits/branch/${branch}`;
    }
    getUrlForCommit(sha) {
        return `${this.baseUrl}/commits/${sha}`;
    }
    getUrlForFile(fileName, branch, sha, range) {
        let line = '';
        if (range) {
            if (range.start.line === range.end.line) {
                line = `#${fileName}-${range.start.line}`;
            }
            else {
                line = `#${fileName}-${range.start.line}:${range.end.line}`;
            }
        }
        if (sha)
            return `${this.baseUrl}/src/${sha}/${fileName}${line}`;
        if (branch)
            return `${this.baseUrl}/src/${branch}/${fileName}${line}`;
        return `${this.baseUrl}?path=${fileName}${line}`;
    }
}
exports.BitbucketService = BitbucketService;
//# sourceMappingURL=bitbucket.js.map