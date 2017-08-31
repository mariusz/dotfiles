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
const constants_1 = require("../constants");
const gitService_1 = require("../gitService");
const messages_1 = require("../messages");
const logger_1 = require("../logger");
class ShowBlameHistoryCommand extends common_1.EditorCommand {
    constructor(git) {
        super(common_1.Commands.ShowBlameHistory);
        this.git = git;
    }
    execute(editor, edit, uri, args = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            uri = common_1.getCommandUri(uri, editor);
            if (uri === undefined)
                return undefined;
            if (args.range == null || args.position == null) {
                args = Object.assign({}, args);
                args.range = editor.document.validateRange(new vscode_1.Range(0, 0, 1000000, 1000000));
                args.position = editor.document.validateRange(new vscode_1.Range(0, 0, 0, 1000000)).start;
            }
            const gitUri = yield gitService_1.GitUri.fromUri(uri, this.git);
            try {
                const locations = yield this.git.getBlameLocations(gitUri, args.range, args.sha, args.line);
                if (locations === undefined)
                    return messages_1.Messages.showFileNotUnderSourceControlWarningMessage('Unable to show blame history');
                return vscode_1.commands.executeCommand(constants_1.BuiltInCommands.ShowReferences, uri, args.position, locations);
            }
            catch (ex) {
                logger_1.Logger.error(ex, 'ShowBlameHistoryCommand', 'getBlameLocations');
                return vscode_1.window.showErrorMessage(`Unable to show blame history. See output channel for more details`);
            }
        });
    }
}
exports.ShowBlameHistoryCommand = ShowBlameHistoryCommand;
//# sourceMappingURL=showBlameHistory.js.map