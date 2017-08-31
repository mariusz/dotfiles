'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const provider_1 = require("./provider");
exports.RemoteProvider = provider_1.RemoteProvider;
const bitbucket_1 = require("./bitbucket");
const github_1 = require("./github");
const gitlab_1 = require("./gitlab");
const visualStudio_1 = require("./visualStudio");
const logger_1 = require("../../logger");
const providerMap = new Map([
    ['bitbucket.org', (domain, path) => new bitbucket_1.BitbucketService(domain, path)],
    ['github.com', (domain, path) => new github_1.GitHubService(domain, path)],
    ['gitlab.com', (domain, path) => new gitlab_1.GitLabService(domain, path)],
    ['visualstudio.com', (domain, path) => new visualStudio_1.VisualStudioService(domain, path)]
]);
const UrlRegex = /^(?:git:\/\/(.*?)\/|https:\/\/(.*?)\/|http:\/\/(.*?)\/|git@(.*):|ssh:\/\/(?:.*@)?(.*?)(?::.*?)?\/)(.*)$/;
class RemoteProviderFactory {
    static getRemoteProvider(url) {
        try {
            const match = UrlRegex.exec(url);
            if (match == null)
                return undefined;
            const domain = match[1] || match[2] || match[3] || match[4] || match[5];
            const path = match[6].replace(/\.git\/?$/, '');
            const key = domain.toLowerCase().endsWith('visualstudio.com')
                ? 'visualstudio.com'
                : domain;
            const creator = providerMap.get(key.toLowerCase());
            if (!creator)
                return undefined;
            return creator(domain, path);
        }
        catch (ex) {
            logger_1.Logger.error(ex, 'RemoteProviderFactory');
            return undefined;
        }
    }
}
exports.RemoteProviderFactory = RemoteProviderFactory;
//# sourceMappingURL=factory.js.map