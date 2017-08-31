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
const explorerNodes_1 = require("../views/explorerNodes");
const logger_1 = require("../logger");
const telemetry_1 = require("../telemetry");
exports.Commands = {
    ClearFileAnnotations: 'gitlens.clearFileAnnotations',
    CloseUnchangedFiles: 'gitlens.closeUnchangedFiles',
    CopyMessageToClipboard: 'gitlens.copyMessageToClipboard',
    CopyShaToClipboard: 'gitlens.copyShaToClipboard',
    DiffDirectory: 'gitlens.diffDirectory',
    DiffWithBranch: 'gitlens.diffWithBranch',
    DiffWithNext: 'gitlens.diffWithNext',
    DiffWithPrevious: 'gitlens.diffWithPrevious',
    DiffLineWithPrevious: 'gitlens.diffLineWithPrevious',
    DiffWithRevision: 'gitlens.diffWithRevision',
    DiffWithWorking: 'gitlens.diffWithWorking',
    DiffLineWithWorking: 'gitlens.diffLineWithWorking',
    OpenChangedFiles: 'gitlens.openChangedFiles',
    OpenBranchInRemote: 'gitlens.openBranchInRemote',
    OpenCommitInRemote: 'gitlens.openCommitInRemote',
    OpenFileInRemote: 'gitlens.openFileInRemote',
    OpenInRemote: 'gitlens.openInRemote',
    OpenRepoInRemote: 'gitlens.openRepoInRemote',
    ResetSuppressedWarnings: 'gitlens.resetSuppressedWarnings',
    ShowBlameHistory: 'gitlens.showBlameHistory',
    ShowCommitSearch: 'gitlens.showCommitSearch',
    ShowFileBlame: 'gitlens.showFileBlame',
    ShowFileHistory: 'gitlens.showFileHistory',
    ShowLastQuickPick: 'gitlens.showLastQuickPick',
    ShowLineBlame: 'gitlens.showLineBlame',
    ShowQuickCommitDetails: 'gitlens.showQuickCommitDetails',
    ShowQuickCommitFileDetails: 'gitlens.showQuickCommitFileDetails',
    ShowQuickFileHistory: 'gitlens.showQuickFileHistory',
    ShowQuickBranchHistory: 'gitlens.showQuickBranchHistory',
    ShowQuickCurrentBranchHistory: 'gitlens.showQuickRepoHistory',
    ShowQuickRepoStatus: 'gitlens.showQuickRepoStatus',
    ShowQuickStashList: 'gitlens.showQuickStashList',
    StashApply: 'gitlens.stashApply',
    StashDelete: 'gitlens.stashDelete',
    StashSave: 'gitlens.stashSave',
    ToggleCodeLens: 'gitlens.toggleCodeLens',
    ToggleFileBlame: 'gitlens.toggleFileBlame',
    ToggleFileRecentChanges: 'gitlens.toggleFileRecentChanges',
    ToggleLineBlame: 'gitlens.toggleLineBlame'
};
function getCommandUri(uri, editor) {
    if (uri instanceof vscode_1.Uri)
        return uri;
    if (editor === undefined || editor.document === undefined)
        return undefined;
    return editor.document.uri;
}
exports.getCommandUri = getCommandUri;
function isScmResourceGroup(group) {
    if (group === undefined)
        return false;
    return group.id !== undefined && (group.handle !== undefined || group.label !== undefined || group.resourceStates !== undefined);
}
function isScmResourceState(state) {
    if (state === undefined)
        return false;
    return state.resourceUri !== undefined;
}
function isTextEditor(editor) {
    if (editor === undefined)
        return false;
    return editor.id !== undefined && (editor.edit !== undefined || editor.document !== undefined);
}
class Command extends vscode_1.Disposable {
    constructor(command) {
        super(() => this.dispose());
        this.command = command;
        this.contextParsingOptions = { editor: false, uri: false };
        this._disposable = vscode_1.commands.registerCommand(command, this._execute, this);
    }
    dispose() {
        this._disposable && this._disposable.dispose();
    }
    preExecute(context, ...args) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.execute(...args);
        });
    }
    _execute(...args) {
        telemetry_1.Telemetry.trackEvent(this.command);
        const [context, rest] = Command._parseContext(this.contextParsingOptions, ...args);
        return this.preExecute(context, ...rest);
    }
    static _parseContext(options, ...args) {
        let editor = undefined;
        let firstArg = args[0];
        if (options.editor && (firstArg === undefined || isTextEditor(firstArg))) {
            editor = firstArg;
            args = args.slice(1);
            firstArg = args[0];
        }
        if (options.uri && (firstArg === undefined || firstArg instanceof vscode_1.Uri)) {
            const [uri, ...rest] = args;
            return [{ type: 'uri', editor: editor, uri: uri }, rest];
        }
        if (firstArg instanceof explorerNodes_1.ExplorerNode) {
            const [node, ...rest] = args;
            return [{ type: 'view', node: node, uri: node.uri }, rest];
        }
        if (isScmResourceState(firstArg)) {
            const states = [];
            let count = 0;
            for (const arg of args) {
                if (!isScmResourceState(arg))
                    break;
                count++;
                states.push(arg);
            }
            return [{ type: 'scm-states', scmResourceStates: states, uri: states[0].resourceUri }, args.slice(count)];
        }
        if (isScmResourceGroup(firstArg)) {
            const groups = [];
            let count = 0;
            for (const arg of args) {
                if (!isScmResourceGroup(arg))
                    break;
                count++;
                groups.push(arg);
            }
            return [{ type: 'scm-groups', scmResourceGroups: groups }, args.slice(count)];
        }
        return [{ type: 'unknown', editor: editor }, args];
    }
}
exports.Command = Command;
class ActiveEditorCommand extends Command {
    constructor(command) {
        super(command);
        this.command = command;
        this.contextParsingOptions = { editor: true, uri: true };
    }
    preExecute(context, ...args) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.execute(context.editor, context.uri, ...args);
        });
    }
    _execute(...args) {
        return super._execute(vscode_1.window.activeTextEditor, ...args);
    }
}
exports.ActiveEditorCommand = ActiveEditorCommand;
let lastCommand = undefined;
function getLastCommand() {
    return lastCommand;
}
exports.getLastCommand = getLastCommand;
class ActiveEditorCachedCommand extends ActiveEditorCommand {
    constructor(command) {
        super(command);
        this.command = command;
    }
    _execute(...args) {
        lastCommand = {
            command: this.command,
            args: args
        };
        return super._execute(...args);
    }
}
exports.ActiveEditorCachedCommand = ActiveEditorCachedCommand;
class EditorCommand extends vscode_1.Disposable {
    constructor(command) {
        super(() => this.dispose());
        this.command = command;
        this._disposable = vscode_1.commands.registerTextEditorCommand(command, this._execute, this);
    }
    dispose() {
        this._disposable && this._disposable.dispose();
    }
    _execute(editor, edit, ...args) {
        telemetry_1.Telemetry.trackEvent(this.command);
        return this.execute(editor, edit, ...args);
    }
}
exports.EditorCommand = EditorCommand;
function openEditor(uri, options) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const defaults = {
                preserveFocus: false,
                preview: true,
                viewColumn: (vscode_1.window.activeTextEditor && vscode_1.window.activeTextEditor.viewColumn) || 1
            };
            const document = yield vscode_1.workspace.openTextDocument(uri);
            return vscode_1.window.showTextDocument(document, Object.assign({}, defaults, (options || {})));
        }
        catch (ex) {
            logger_1.Logger.error(ex, 'openEditor');
            return undefined;
        }
    });
}
exports.openEditor = openEditor;
//# sourceMappingURL=common.js.map