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
const comparers_1 = require("../comparers");
const explorerNodes_1 = require("./explorerNodes");
const gitService_1 = require("../gitService");
__export(require("./explorerNodes"));
class GitExplorer {
    constructor(context, git) {
        this.context = context;
        this.git = git;
        this._onDidChangeTreeData = new vscode_1.EventEmitter();
        this._roots = [];
        vscode_1.commands.registerCommand('gitlens.gitExplorer.refresh', () => this.refresh());
        const uri = new gitService_1.GitUri(vscode_1.Uri.file(git.repoPath), { repoPath: git.repoPath, fileName: git.repoPath });
        this._roots.push(new explorerNodes_1.RepositoryNode(uri, context, git));
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
            if (this._roots.length === 0)
                return [];
            if (node === undefined)
                return this._roots;
            return node.getChildren();
        });
    }
    addHistory(uri) {
        this._add(uri, explorerNodes_1.FileHistoryNode);
    }
    addStash(uri) {
        this._add(uri, explorerNodes_1.StashNode);
    }
    _add(uri, type) {
        if (!this._roots.some(_ => _.resourceType === type.rootType && comparers_1.UriComparer.equals(uri, _.uri))) {
            this._roots.push(new type(uri, this.context, this.git));
        }
        this.refresh();
    }
    clear() {
        this._roots = [];
        this.refresh();
    }
    refresh() {
        this._onDidChangeTreeData.fire();
    }
}
exports.GitExplorer = GitExplorer;
//# sourceMappingURL=gitExplorer.js.map