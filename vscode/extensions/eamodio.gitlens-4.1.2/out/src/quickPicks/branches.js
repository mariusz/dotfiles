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
class BranchQuickPickItem {
    constructor(branch) {
        this.branch = branch;
        this.label = `${branch.current ? `$(check)${constants_1.GlyphChars.Space}` : constants_1.GlyphChars.Space.repeat(4)} ${branch.name}`;
        this.description = branch.remote ? `${constants_1.GlyphChars.Space.repeat(2)} remote branch` : '';
    }
}
exports.BranchQuickPickItem = BranchQuickPickItem;
class BranchesQuickPick {
    static show(branches, placeHolder, goBackCommand) {
        return __awaiter(this, void 0, void 0, function* () {
            const items = branches.map(_ => new BranchQuickPickItem(_));
            if (goBackCommand) {
                items.splice(0, 0, goBackCommand);
            }
            const pick = yield vscode_1.window.showQuickPick(items, {
                placeHolder: placeHolder,
                ignoreFocusOut: common_1.getQuickPickIgnoreFocusOut()
            });
            if (!pick)
                return undefined;
            return pick;
        });
    }
}
exports.BranchesQuickPick = BranchesQuickPick;
//# sourceMappingURL=branches.js.map