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
const logger_1 = require("../logger");
const messages_1 = require("../messages");
const quickPicks_1 = require("../quickPicks");
class DiffDirectoryCommand extends common_1.ActiveEditorCommand {
    constructor(git) {
        super(common_1.Commands.DiffDirectory);
        this.git = git;
    }
    execute(editor, uri, args = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const diffTool = yield this.git.getConfig('diff.tool');
            if (!diffTool) {
                const result = yield vscode_1.window.showWarningMessage(`Unable to open directory compare because there is no Git diff tool configured`, 'View Git Docs');
                if (!result)
                    return undefined;
                return vscode_1.commands.executeCommand(constants_1.BuiltInCommands.Open, vscode_1.Uri.parse('https://git-scm.com/docs/git-config#git-config-difftool'));
            }
            uri = common_1.getCommandUri(uri, editor);
            try {
                const repoPath = yield this.git.getRepoPathFromUri(uri);
                if (!repoPath)
                    return messages_1.Messages.showNoRepositoryWarningMessage(`Unable to open directory compare`);
                if (!args.shaOrBranch1) {
                    args = Object.assign({}, args);
                    const branches = yield this.git.getBranches(repoPath);
                    const current = system_1.Iterables.find(branches, _ => _.current);
                    if (current == null)
                        return vscode_1.window.showWarningMessage(`Unable to open directory compare`);
                    const pick = yield quickPicks_1.BranchesQuickPick.show(branches, `Compare ${current.name} to ${constants_1.GlyphChars.Ellipsis}`);
                    if (pick === undefined)
                        return undefined;
                    if (pick instanceof quickPicks_1.CommandQuickPickItem)
                        return pick.execute();
                    args.shaOrBranch1 = pick.branch.name;
                    if (args.shaOrBranch1 === undefined)
                        return undefined;
                }
                this.git.openDirectoryDiff(repoPath, args.shaOrBranch1, args.shaOrBranch2);
                return undefined;
            }
            catch (ex) {
                logger_1.Logger.error(ex, 'DiffDirectoryCommand');
                return vscode_1.window.showErrorMessage(`Unable to open directory compare. See output channel for more details`);
            }
        });
    }
}
exports.DiffDirectoryCommand = DiffDirectoryCommand;
//# sourceMappingURL=diffDirectory.js.map