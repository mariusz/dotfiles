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
const commands_1 = require("../commands");
const constants_1 = require("../constants");
const keyboard_1 = require("../keyboard");
const quickPicks_1 = require("../quickPicks");
class StashListQuickPick {
    static show(git, stash, mode, goBackCommand, currentCommand) {
        return __awaiter(this, void 0, void 0, function* () {
            const items = ((stash && Array.from(system_1.Iterables.map(stash.commits.values(), c => new quickPicks_1.CommitQuickPickItem(c)))) || []);
            if (mode === 'list') {
                items.splice(0, 0, new quickPicks_1.CommandQuickPickItem({
                    label: `$(repo-push) Stash Unstaged Changes`,
                    description: `${system_1.Strings.pad(constants_1.GlyphChars.Dash, 2, 3)} stashes only unstaged changes`
                }, commands_1.Commands.StashSave, [
                    {
                        unstagedOnly: true,
                        goBackCommand: currentCommand
                    }
                ]));
                items.splice(0, 0, new quickPicks_1.CommandQuickPickItem({
                    label: `$(repo-force-push) Stash Changes`,
                    description: `${system_1.Strings.pad(constants_1.GlyphChars.Dash, 2, 3)} stashes all changes`
                }, commands_1.Commands.StashSave, [
                    {
                        unstagedOnly: false,
                        goBackCommand: currentCommand
                    }
                ]));
            }
            if (goBackCommand) {
                items.splice(0, 0, goBackCommand);
            }
            const scope = yield keyboard_1.Keyboard.instance.beginScope({ left: goBackCommand });
            const pick = yield vscode_1.window.showQuickPick(items, {
                matchOnDescription: true,
                placeHolder: mode === 'apply'
                    ? `Apply stashed changes to your working tree${constants_1.GlyphChars.Ellipsis}`
                    : `stashed changes ${constants_1.GlyphChars.Dash} search by message, filename, or commit id`,
                ignoreFocusOut: quickPicks_1.getQuickPickIgnoreFocusOut()
            });
            yield scope.dispose();
            return pick;
        });
    }
}
exports.StashListQuickPick = StashListQuickPick;
//# sourceMappingURL=stashList.js.map