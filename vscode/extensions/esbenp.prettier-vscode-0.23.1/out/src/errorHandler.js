"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const utils_1 = require("./utils");
let statusBarItem;
let outputChannel;
let outputChannelOpen = false;
function toggleStatusBarItem(editor) {
    if (editor !== undefined) {
        if (['debug', 'output'].some(part => editor.document.uri.scheme === part)) {
            return;
        }
        const score = vscode_1.languages.match(utils_1.allEnabledLanguages(), editor.document);
        if (score > 0) {
            statusBarItem.show();
        }
        else {
            statusBarItem.hide();
        }
    }
}
function registerDisposables() {
    return [
        utils_1.onWorkspaceRootChange(() => {
            outputChannelOpen = false;
        }),
        vscode_1.window.onDidChangeActiveTextEditor(editor => {
            if (statusBarItem !== undefined) {
                toggleStatusBarItem(editor);
            }
        }),
    ];
}
exports.registerDisposables = registerDisposables;
function updateStatusBar(message) {
    statusBarItem.text = message;
    statusBarItem.show();
}
function addFilePath(msg, fileName) {
    const lines = msg.split('\n');
    if (lines.length > 0) {
        lines[0] = lines[0].replace(/(\d*):(\d*)/g, `${fileName}:$1:$2`);
        return lines.join('\n');
    }
    return msg;
}
function addToOutput(message) {
    const title = `${new Date().toLocaleString()}:`;
    outputChannel.appendLine(title);
    outputChannel.appendLine('-'.repeat(title.length));
    outputChannel.appendLine(`${message}\n`);
    if (outputChannelOpen === false) {
        outputChannel.show(true);
        outputChannelOpen = true;
    }
}
exports.addToOutput = addToOutput;
function safeExecution(cb, defaultText, fileName) {
    try {
        const returnValue = cb();
        updateStatusBar('Prettier: $(check)');
        return returnValue;
    }
    catch (err) {
        addToOutput(addFilePath(err.message, fileName));
        updateStatusBar('Prettier: $(x)');
        return defaultText;
    }
}
exports.safeExecution = safeExecution;
function setupErrorHandler() {
    statusBarItem = vscode_1.window.createStatusBarItem(vscode_1.StatusBarAlignment.Right, -1);
    statusBarItem.text = 'Prettier';
    statusBarItem.command = 'prettier.open-output';
    toggleStatusBarItem(vscode_1.window.activeTextEditor);
    outputChannel = vscode_1.window.createOutputChannel('Prettier');
    return vscode_1.commands.registerCommand('prettier.open-output', () => {
        outputChannel.show();
    });
}
exports.setupErrorHandler = setupErrorHandler;
//# sourceMappingURL=errorHandler.js.map