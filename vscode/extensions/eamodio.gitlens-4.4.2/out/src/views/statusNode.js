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
const system_1 = require("../system");
const vscode_1 = require("vscode");
const constants_1 = require("../constants");
const explorerNode_1 = require("./explorerNode");
class StatusNode extends explorerNode_1.ExplorerNode {
    constructor(uri, context, git) {
        super(uri, context, git);
        this.resourceType = 'status';
    }
    getChildren() {
        return __awaiter(this, void 0, void 0, function* () {
            return [];
        });
    }
    getTreeItem() {
        return __awaiter(this, void 0, void 0, function* () {
            const status = yield this.git.getStatusForRepo(this.uri.repoPath);
            let suffix = '';
            if (status !== undefined) {
                suffix = ` ${constants_1.GlyphChars.Dash} ${constants_1.GlyphChars.ArrowUp} ${status.state.ahead} ${constants_1.GlyphChars.ArrowDown} ${status.state.behind} ${system_1.Strings.pad(constants_1.GlyphChars.Dot, 1, 1)} ${status.branch} ${constants_1.GlyphChars.ArrowLeftRight} ${status.upstream}`;
            }
            const item = new vscode_1.TreeItem(`Status${suffix}`, vscode_1.TreeItemCollapsibleState.Collapsed);
            item.contextValue = this.resourceType;
            return item;
        });
    }
}
exports.StatusNode = StatusNode;
//# sourceMappingURL=statusNode.js.map