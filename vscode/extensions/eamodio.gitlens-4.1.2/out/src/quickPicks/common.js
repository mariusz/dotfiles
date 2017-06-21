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
const configuration_1 = require("../configuration");
const constants_1 = require("../constants");
const gitService_1 = require("../gitService");
const keyboard_1 = require("../keyboard");
const moment = require("moment");
function getQuickPickIgnoreFocusOut() {
    const cfg = vscode_1.workspace.getConfiguration(configuration_1.ExtensionKey).get('advanced');
    return !cfg.quickPick.closeOnFocusOut;
}
exports.getQuickPickIgnoreFocusOut = getQuickPickIgnoreFocusOut;
function showQuickPickProgress(message, mapping, delay = false) {
    const cancellation = new vscode_1.CancellationTokenSource();
    if (delay) {
        let disposable;
        const timer = setTimeout(() => {
            disposable && disposable.dispose();
            _showQuickPickProgress(message, cancellation, mapping);
        }, 250);
        disposable = cancellation.token.onCancellationRequested(() => clearTimeout(timer));
    }
    else {
        _showQuickPickProgress(message, cancellation, mapping);
    }
    return cancellation;
}
exports.showQuickPickProgress = showQuickPickProgress;
function _showQuickPickProgress(message, cancellation, mapping) {
    return __awaiter(this, void 0, void 0, function* () {
        const scope = mapping && (yield keyboard_1.Keyboard.instance.beginScope(mapping));
        try {
            yield vscode_1.window.showQuickPick(_getInfiniteCancellablePromise(cancellation), {
                placeHolder: message,
                ignoreFocusOut: getQuickPickIgnoreFocusOut()
            }, cancellation.token);
        }
        catch (ex) {
        }
        finally {
            cancellation.cancel();
            scope && scope.dispose();
        }
    });
}
function _getInfiniteCancellablePromise(cancellation) {
    return new Promise((resolve, reject) => {
        const disposable = cancellation.token.onCancellationRequested(() => {
            disposable.dispose();
            resolve([]);
        });
    });
}
class CommandQuickPickItem {
    constructor(item, commandOrArgs, args) {
        if (commandOrArgs === undefined) {
            this.command = undefined;
            this.args = args;
        }
        else if (typeof commandOrArgs === 'string') {
            this.command = commandOrArgs;
            this.args = args;
        }
        else {
            this.command = commandOrArgs[0];
            this.args = commandOrArgs.slice(1);
        }
        Object.assign(this, item);
    }
    execute() {
        if (this.command === undefined)
            return Promise.resolve(undefined);
        return vscode_1.commands.executeCommand(this.command, ...(this.args || []));
    }
    onDidPressKey(key) {
        return this.execute();
    }
}
exports.CommandQuickPickItem = CommandQuickPickItem;
class KeyCommandQuickPickItem extends CommandQuickPickItem {
    constructor(command, args) {
        super({ label: '', description: '' }, command, args);
    }
}
exports.KeyCommandQuickPickItem = KeyCommandQuickPickItem;
class OpenFileCommandQuickPickItem extends CommandQuickPickItem {
    constructor(uri, item) {
        super(item, undefined, undefined);
        this.uri = uri;
    }
    execute(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return commands_1.openEditor(this.uri, options);
        });
    }
    onDidPressKey(key) {
        return this.execute({
            preserveFocus: true,
            preview: false
        });
    }
}
exports.OpenFileCommandQuickPickItem = OpenFileCommandQuickPickItem;
class OpenFilesCommandQuickPickItem extends CommandQuickPickItem {
    constructor(uris, item) {
        super(item, undefined, undefined);
        this.uris = uris;
    }
    execute(options = { preserveFocus: false, preview: false }) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const uri of this.uris) {
                yield commands_1.openEditor(uri, options);
            }
            return undefined;
        });
    }
    onDidPressKey(key) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.execute({
                preserveFocus: true,
                preview: false
            });
        });
    }
}
exports.OpenFilesCommandQuickPickItem = OpenFilesCommandQuickPickItem;
class CommitQuickPickItem {
    constructor(commit) {
        this.commit = commit;
        let message = commit.message;
        const index = message.indexOf('\n');
        if (index !== -1) {
            message = `${message.substring(0, index)}${constants_1.GlyphChars.Space}$(ellipsis)`;
        }
        if (commit instanceof gitService_1.GitStashCommit) {
            this.label = message;
            this.description = '';
            this.detail = `${constants_1.GlyphChars.Space} ${commit.stashName} ${system_1.Strings.pad(constants_1.GlyphChars.Dot, 1, 1)} ${moment(commit.date).fromNow()} ${system_1.Strings.pad(constants_1.GlyphChars.Dot, 1, 1)} ${commit.getDiffStatus()}`;
        }
        else {
            this.label = message;
            this.description = `${system_1.Strings.pad('$(git-commit)', 1, 1)} ${commit.shortSha}`;
            this.detail = `${constants_1.GlyphChars.Space} ${commit.author}, ${moment(commit.date).fromNow()}${(commit.type === 'branch') ? ` ${system_1.Strings.pad(constants_1.GlyphChars.Dot, 1, 1)} ${commit.getDiffStatus()}` : ''}`;
        }
    }
}
exports.CommitQuickPickItem = CommitQuickPickItem;
//# sourceMappingURL=common.js.map