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
const common_1 = require("./common");
const logger_1 = require("../logger");
const messages_1 = require("../messages");
class ShowQuickCurrentBranchHistoryCommand extends common_1.ActiveEditorCachedCommand {
    constructor(git) {
        super(common_1.Commands.ShowQuickCurrentBranchHistory);
        this.git = git;
    }
    execute(editor, uri, args = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            uri = common_1.getCommandUri(uri, editor);
            try {
                const repoPath = yield this.git.getRepoPathFromUri(uri);
                if (!repoPath)
                    return messages_1.Messages.showNoRepositoryWarningMessage(`Unable to show branch history`);
                const branch = yield this.git.getBranch(repoPath);
                if (branch === undefined)
                    return undefined;
                return vscode_1.commands.executeCommand(common_1.Commands.ShowQuickBranchHistory, uri, {
                    branch: branch.name,
                    goBackCommand: args.goBackCommand
                });
            }
            catch (ex) {
                logger_1.Logger.error(ex, 'ShowQuickCurrentBranchHistoryCommand');
                return vscode_1.window.showErrorMessage(`Unable to show branch history. See output channel for more details`);
            }
        });
    }
}
exports.ShowQuickCurrentBranchHistoryCommand = ShowQuickCurrentBranchHistoryCommand;
//# sourceMappingURL=showQuickCurrentBranchHistory.js.map