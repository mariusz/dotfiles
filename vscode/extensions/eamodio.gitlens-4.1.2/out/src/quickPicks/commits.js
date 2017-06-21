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
const keyboard_1 = require("../keyboard");
const quickPicks_1 = require("../quickPicks");
class CommitsQuickPick {
    static show(git, log, placeHolder, goBackCommand) {
        return __awaiter(this, void 0, void 0, function* () {
            const items = ((log && Array.from(system_1.Iterables.map(log.commits.values(), c => new quickPicks_1.CommitQuickPickItem(c)))) || []);
            if (goBackCommand) {
                items.splice(0, 0, goBackCommand);
            }
            const scope = yield keyboard_1.Keyboard.instance.beginScope({ left: goBackCommand });
            const pick = yield vscode_1.window.showQuickPick(items, {
                matchOnDescription: true,
                placeHolder: placeHolder,
                ignoreFocusOut: quickPicks_1.getQuickPickIgnoreFocusOut()
            });
            yield scope.dispose();
            return pick;
        });
    }
}
exports.CommitsQuickPick = CommitsQuickPick;
//# sourceMappingURL=commits.js.map