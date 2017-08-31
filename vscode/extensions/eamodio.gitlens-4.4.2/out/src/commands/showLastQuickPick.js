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
class ShowLastQuickPickCommand extends common_1.Command {
    constructor() {
        super(common_1.Commands.ShowLastQuickPick);
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const command = common_1.getLastCommand();
            if (command === undefined)
                return undefined;
            try {
                return vscode_1.commands.executeCommand(command.command, ...command.args);
            }
            catch (ex) {
                logger_1.Logger.error(ex, 'ShowLastQuickPickCommand');
                return vscode_1.window.showErrorMessage(`Unable to show last quick pick. See output channel for more details`);
            }
        });
    }
}
exports.ShowLastQuickPickCommand = ShowLastQuickPickCommand;
//# sourceMappingURL=showLastQuickPick.js.map