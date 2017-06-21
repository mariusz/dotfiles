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
const system_1 = require("../system");
const vscode_1 = require("vscode");
const common_1 = require("./common");
const constants_1 = require("../constants");
const gitService_1 = require("../gitService");
const logger_1 = require("../logger");
const quickPicks_1 = require("../quickPicks");
class OpenInRemoteCommand extends common_1.ActiveEditorCommand {
    constructor() {
        super(common_1.Commands.OpenInRemote);
    }
    execute(editor, uri, args = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            uri = common_1.getCommandUri(uri, editor);
            try {
                if (args.remotes === undefined || args.resource === undefined)
                    return undefined;
                if (args.remotes.length === 1) {
                    const command = new quickPicks_1.OpenRemoteCommandQuickPickItem(args.remotes[0], args.resource);
                    return command.execute();
                }
                let placeHolder = '';
                switch (args.resource.type) {
                    case 'branch':
                        const index = args.resource.branch.indexOf('/');
                        if (index >= 0) {
                            const remoteName = args.resource.branch.substring(0, index);
                            const remote = args.remotes.find(r => r.name === remoteName);
                            if (remote !== undefined) {
                                args.resource.branch = args.resource.branch.substring(index + 1);
                                args.remotes = [remote];
                            }
                        }
                        placeHolder = `open ${args.resource.branch} branch in${constants_1.GlyphChars.Ellipsis}`;
                        break;
                    case 'commit':
                        const shortSha = args.resource.sha.substring(0, 8);
                        placeHolder = `open commit ${shortSha} in${constants_1.GlyphChars.Ellipsis}`;
                        break;
                    case 'file':
                        if (args.resource.commit !== undefined && args.resource.commit instanceof gitService_1.GitLogCommit) {
                            if (args.resource.commit.status === 'D') {
                                args.resource.sha = args.resource.commit.previousSha;
                                placeHolder = `open ${args.resource.fileName} ${system_1.Strings.pad(constants_1.GlyphChars.Dot, 1, 1)} ${args.resource.commit.previousShortSha} in${constants_1.GlyphChars.Ellipsis}`;
                            }
                            else {
                                args.resource.sha = args.resource.commit.sha;
                                placeHolder = `open ${args.resource.fileName} ${system_1.Strings.pad(constants_1.GlyphChars.Dot, 1, 1)} ${args.resource.commit.shortSha} in${constants_1.GlyphChars.Ellipsis}`;
                            }
                        }
                        else {
                            const shortFileSha = args.resource.sha === undefined ? '' : args.resource.sha.substring(0, 8);
                            const shaSuffix = shortFileSha ? ` ${system_1.Strings.pad(constants_1.GlyphChars.Dot, 1, 1)} ${shortFileSha}` : '';
                            placeHolder = `open ${args.resource.fileName}${shaSuffix} in${constants_1.GlyphChars.Ellipsis}`;
                        }
                        break;
                    case 'working-file':
                        placeHolder = `open ${args.resource.fileName} in${constants_1.GlyphChars.Ellipsis}`;
                        break;
                }
                if (args.remotes.length === 1) {
                    const command = new quickPicks_1.OpenRemoteCommandQuickPickItem(args.remotes[0], args.resource);
                    return command.execute();
                }
                const pick = yield quickPicks_1.RemotesQuickPick.show(args.remotes, placeHolder, args.resource, args.goBackCommand);
                if (pick === undefined)
                    return undefined;
                return pick.execute();
            }
            catch (ex) {
                logger_1.Logger.error(ex, 'OpenInRemoteCommand');
                return vscode_1.window.showErrorMessage(`Unable to open in remote provider. See output channel for more details`);
            }
        });
    }
}
exports.OpenInRemoteCommand = OpenInRemoteCommand;
//# sourceMappingURL=openInRemote.js.map