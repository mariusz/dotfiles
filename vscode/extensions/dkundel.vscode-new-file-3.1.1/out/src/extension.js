"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const Debug = require("debug");
const file_controller_1 = require("./file-controller");
const debug = Debug('vscode-new-file');
function activate(context) {
    debug('Your extension "vscode-new-file" is now active!');
    let disposable = vscode_1.commands.registerCommand('newFile.createNewFile', () => {
        const File = new file_controller_1.FileController().readSettings();
        File.determineRoot()
            .then(root => File.getDefaultFileValue(root))
            .then(fileName => File.showFileNameDialog(fileName))
            .then((fileName) => File.createFiles(fileName))
            .then(File.openFilesInEditor)
            .catch((err) => {
            if (err.message) {
                vscode_1.window.showErrorMessage(err.message);
            }
        });
    });
    context.subscriptions.push(disposable);
    let disposableDeprecated = vscode_1.commands.registerCommand('extension.createNewFile', () => {
        vscode_1.window.showWarningMessage('You are using a deprecated event. Please switch your keyboard shortcut to use "newFile.createNewFile"');
        const File = new file_controller_1.FileController().readSettings();
        File.determineRoot()
            .then(root => File.getDefaultFileValue(root))
            .then(fileName => File.showFileNameDialog(fileName))
            .then((fileName) => File.createFiles(fileName))
            .then(File.openFilesInEditor)
            .catch((err) => {
            if (err.message) {
                vscode_1.window.showErrorMessage(err.message);
            }
        });
    });
    context.subscriptions.push(disposableDeprecated);
    let disposableExplorerEntry = vscode_1.commands.registerCommand('newFile.createFromExplorer', (file) => {
        if (!file || !file.path) {
            return;
        }
        const File = new file_controller_1.FileController().readSettings();
        File.getRootFromExplorerPath(file.path)
            .then(root => File.getDefaultFileValue(root))
            .then(fileName => File.showFileNameDialog(fileName, true))
            .then(File.createFile)
            .then((fileName) => File.createFiles(fileName))
            .catch((err) => {
            if (err.message) {
                vscode_1.window.showErrorMessage(err.message);
            }
        });
    });
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map