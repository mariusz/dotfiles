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
const configuration_1 = require("../configuration");
const logger_1 = require("../logger");
class ShowLineBlameCommand extends common_1.EditorCommand {
    constructor(currentLineController) {
        super(common_1.Commands.ShowLineBlame);
        this.currentLineController = currentLineController;
    }
    execute(editor, edit, uri, args = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            if (editor === undefined || editor.document === undefined || editor.document.isDirty)
                return undefined;
            try {
                if (args.type === undefined) {
                    args = Object.assign({}, args);
                    const cfg = vscode_1.workspace.getConfiguration().get(configuration_1.ExtensionKey);
                    args.type = cfg.blame.line.annotationType;
                }
                return this.currentLineController.showAnnotations(editor, args.type);
            }
            catch (ex) {
                logger_1.Logger.error(ex, 'ShowLineBlameCommand');
                return vscode_1.window.showErrorMessage(`Unable to show line blame annotations. See output channel for more details`);
            }
        });
    }
}
exports.ShowLineBlameCommand = ShowLineBlameCommand;
//# sourceMappingURL=showLineBlame.js.map