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
class StashSaveCommand extends common_1.Command {
    constructor(git) {
        super(common_1.Commands.StashSave);
        this.git = git;
    }
    execute(args = { unstagedOnly: false }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.git.repoPath)
                return undefined;
            args = Object.assign({}, args);
            if (args.unstagedOnly === undefined) {
                args.unstagedOnly = false;
            }
            try {
                if (args.message == null) {
                    args.message = yield vscode_1.window.showInputBox({
                        prompt: `Please provide a stash message`,
                        placeHolder: `Stash message`
                    });
                    if (args.message === undefined)
                        return args.goBackCommand === undefined ? undefined : args.goBackCommand.execute();
                }
                return yield this.git.stashSave(this.git.repoPath, args.message, args.unstagedOnly);
            }
            catch (ex) {
                logger_1.Logger.error(ex, 'StashSaveCommand');
                return vscode_1.window.showErrorMessage(`Unable to save stash. See output channel for more details`);
            }
        });
    }
}
exports.StashSaveCommand = StashSaveCommand;
//# sourceMappingURL=stashSave.js.map