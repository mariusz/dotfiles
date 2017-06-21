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
const commands_1 = require("../commands");
const common_1 = require("./common");
const gitService_1 = require("../gitService");
const path = require("path");
class OpenRemoteCommandQuickPickItem extends common_1.CommandQuickPickItem {
    constructor(remote, resource) {
        super({
            label: `$(link-external) Open ${gitService_1.getNameFromRemoteResource(resource)} in ${remote.provider.name}`,
            description: `\u00a0 \u2014 \u00a0\u00a0 $(repo) ${remote.provider.path}`
        }, undefined, undefined);
        this.remote = remote;
        this.resource = resource;
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.remote.provider.open(this.resource);
        });
    }
}
exports.OpenRemoteCommandQuickPickItem = OpenRemoteCommandQuickPickItem;
class OpenRemotesCommandQuickPickItem extends common_1.CommandQuickPickItem {
    constructor(remotes, resource, goBackCommand) {
        const name = gitService_1.getNameFromRemoteResource(resource);
        let description = '';
        switch (resource.type) {
            case 'branch':
                description = `$(git-branch) ${resource.branch}`;
                break;
            case 'commit':
                const shortSha = resource.sha.substring(0, 8);
                description = `$(git-commit) ${shortSha}`;
                break;
            case 'file':
                if (resource.commit !== undefined && resource.commit instanceof gitService_1.GitLogCommit) {
                    if (resource.commit.status === 'D') {
                        resource.sha = resource.commit.previousSha;
                        description = `$(file-text) ${path.basename(resource.fileName)} in \u00a0$(git-commit) ${resource.commit.previousShortSha} (deleted in \u00a0$(git-commit) ${resource.commit.shortSha})`;
                    }
                    else {
                        resource.sha = resource.commit.sha;
                        description = `$(file-text) ${path.basename(resource.fileName)} in \u00a0$(git-commit) ${resource.commit.shortSha}`;
                    }
                }
                else {
                    const shortFileSha = resource.sha === undefined ? '' : resource.sha.substring(0, 8);
                    description = `$(file-text) ${path.basename(resource.fileName)}${shortFileSha ? ` in \u00a0$(git-commit) ${shortFileSha}` : ''}`;
                }
                break;
            case 'repo':
                description = `$(repo) Repository`;
                break;
            case 'working-file':
                description = `$(file-text) ${path.basename(resource.fileName)}`;
                break;
        }
        const remote = remotes[0];
        if (remotes.length === 1) {
            super({
                label: `$(link-external) Open ${name} in ${remote.provider.name}`,
                description: `\u00a0 \u2014 \u00a0\u00a0 $(repo) ${remote.provider.path} \u00a0\u2022\u00a0 ${description}`
            }, commands_1.Commands.OpenInRemote, [
                undefined,
                {
                    remotes,
                    resource,
                    goBackCommand
                }
            ]);
            return;
        }
        const provider = remotes.every(_ => _.provider !== undefined && _.provider.name === remote.provider.name)
            ? remote.provider.name
            : 'Remote';
        super({
            label: `$(link-external) Open ${name} in ${provider}\u2026`,
            description: `\u00a0 \u2014 \u00a0\u00a0 ${description}`
        }, commands_1.Commands.OpenInRemote, [
            undefined,
            {
                remotes,
                resource,
                goBackCommand
            }
        ]);
    }
}
exports.OpenRemotesCommandQuickPickItem = OpenRemotesCommandQuickPickItem;
class RemotesQuickPick {
    static show(remotes, placeHolder, resource, goBackCommand) {
        return __awaiter(this, void 0, void 0, function* () {
            const items = remotes.map(_ => new OpenRemoteCommandQuickPickItem(_, resource));
            if (goBackCommand) {
                items.splice(0, 0, goBackCommand);
            }
            const pick = yield vscode_1.window.showQuickPick(items, {
                placeHolder: placeHolder,
                ignoreFocusOut: common_1.getQuickPickIgnoreFocusOut()
            });
            if (pick === undefined)
                return undefined;
            return pick;
        });
    }
}
exports.RemotesQuickPick = RemotesQuickPick;
//# sourceMappingURL=remotes.js.map