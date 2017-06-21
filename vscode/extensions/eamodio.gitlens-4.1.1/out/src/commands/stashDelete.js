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
class StashDeleteCommand extends common_1.Command {
    constructor(git) {
        super(common_1.Commands.StashDelete);
        this.git = git;
    }
    execute(args = { confirm: true }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.git.repoPath)
                return undefined;
            if (args.stashItem === undefined || args.stashItem.stashName === undefined)
                return undefined;
            if (args.confirm === undefined) {
                args.confirm = true;
            }
            try {
                if (args.confirm) {
                    const message = args.stashItem.message.length > 80 ? `${args.stashItem.message.substring(0, 80)}\u2026` : args.stashItem.message;
                    const result = yield vscode_1.window.showWarningMessage(`Delete stashed changes '${message}'?`, { title: 'Yes' }, { title: 'No', isCloseAffordance: true });
                    if (result === undefined || result.title !== 'Yes')
                        return args.goBackCommand === undefined ? undefined : args.goBackCommand.execute();
                }
                return yield this.git.stashDelete(this.git.repoPath, args.stashItem.stashName);
            }
            catch (ex) {
                logger_1.Logger.error(ex, 'StashDeleteCommand');
                return vscode_1.window.showErrorMessage(`Unable to delete stash. See output channel for more details`);
            }
        });
    }
}
exports.StashDeleteCommand = StashDeleteCommand;
//# sourceMappingURL=stashDelete.js.map