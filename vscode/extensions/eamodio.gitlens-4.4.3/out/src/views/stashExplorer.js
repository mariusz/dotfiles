'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const commands_1 = require("../commands");
const explorerNodes_1 = require("./explorerNodes");
const gitService_1 = require("../gitService");
__export(require("./explorerNodes"));
class StashExplorer {
    constructor(context, git) {
        this.context = context;
        this.git = git;
        this._onDidChangeTreeData = new vscode_1.EventEmitter();
        vscode_1.commands.registerCommand('gitlens.stashExplorer.refresh', this.refresh, this);
        vscode_1.commands.registerCommand('gitlens.stashExplorer.openChanges', this.openChanges, this);
        vscode_1.commands.registerCommand('gitlens.stashExplorer.openFile', this.openFile, this);
        vscode_1.commands.registerCommand('gitlens.stashExplorer.openStashedFile', this.openStashedFile, this);
        vscode_1.commands.registerCommand('gitlens.stashExplorer.openFileInRemote', this.openFileInRemote, this);
        context.subscriptions.push(this.git.onDidChangeRepo(reasons => {
            if (!reasons.includes('stash'))
                return;
            this.refresh();
        }, this));
        const uri = new gitService_1.GitUri(vscode_1.Uri.file(git.repoPath), { repoPath: git.repoPath, fileName: git.repoPath });
        this._node = new explorerNodes_1.StashNode(uri, this.context, this.git);
    }
    get onDidChangeTreeData() {
        return this._onDidChangeTreeData.event;
    }
    getTreeItem(node) {
        return __awaiter(this, void 0, void 0, function* () {
            return node.getTreeItem();
        });
    }
    getChildren(node) {
        return __awaiter(this, void 0, void 0, function* () {
            if (node === undefined)
                return this._node.getChildren();
            return node.getChildren();
        });
    }
    refresh() {
        this._onDidChangeTreeData.fire();
    }
    openChanges(node) {
        const command = node.getCommand();
        if (command === undefined || command.arguments === undefined)
            return;
        const [uri, args] = command.arguments;
        args.showOptions.preview = false;
        return vscode_1.commands.executeCommand(command.command, uri, args);
    }
    openFile(node) {
        return commands_1.openEditor(node.uri, { preserveFocus: true, preview: false });
    }
    openStashedFile(node) {
        return commands_1.openEditor(gitService_1.GitService.toGitContentUri(node.uri), { preserveFocus: true, preview: false });
    }
    openFileInRemote(node) {
        return vscode_1.commands.executeCommand(commands_1.Commands.OpenFileInRemote, node.commit.previousUri);
    }
}
exports.StashExplorer = StashExplorer;
//# sourceMappingURL=stashExplorer.js.map