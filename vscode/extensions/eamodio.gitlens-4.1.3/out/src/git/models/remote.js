'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const factory_1 = require("../remotes/factory");
class GitRemote {
    constructor(remote) {
        remote = remote.trim();
        const [name, info] = remote.split('\t');
        this.name = name;
        const [url, typeInfo] = info.split(' ');
        this.url = url;
        this.type = typeInfo.substring(1, typeInfo.length - 1);
        this.provider = factory_1.RemoteProviderFactory.getRemoteProvider(this.url);
    }
}
exports.GitRemote = GitRemote;
//# sourceMappingURL=remote.js.map