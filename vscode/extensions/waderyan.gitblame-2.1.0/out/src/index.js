"use strict";
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
const blamecontroller_1 = require("./git/blamecontroller");
function activate(context) {
    return __awaiter(this, void 0, void 0, function* () {
        if (vscode_1.workspace.rootPath) {
            const controller = new blamecontroller_1.GitBlameController();
            const blameCommand = vscode_1.commands.registerCommand('gitblame.quickInfo', controller.showMessage, controller);
            const linkCommand = vscode_1.commands.registerCommand('gitblame.online', controller.blameLink, controller);
            context.subscriptions.push(controller, blameCommand, linkCommand);
        }
    });
}
exports.activate = activate;
//# sourceMappingURL=index.js.map