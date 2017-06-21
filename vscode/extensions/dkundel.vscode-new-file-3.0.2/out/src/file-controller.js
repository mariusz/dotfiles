"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const fs = require("fs");
const path = require("path");
const Q = require("q");
const mkdirp = require("mkdirp");
const Debug = require("debug");
const debug = Debug('vscode-new-file');
class FileController {
    readSettings() {
        let config = vscode_1.workspace.getConfiguration('newFile');
        this.settings = {
            showPathRelativeTo: config.get('showPathRelativeTo', 'root'),
            relativeTo: config.get('relativeTo', 'file'),
            rootDirectory: config.get('rootDirectory', this.homedir()),
            defaultFileExtension: config.get('defaultFileExtension', '.ts'),
            defaultBaseFileName: config.get('defaultBaseFileName', 'newFile')
        };
        const showFullPath = config.get('showFullPath');
        if (showFullPath) {
            vscode_1.window.showInformationMessage('You are using a deprecated option "showFullPath". Switch instead to "showFullPathRelativeTo"');
            this.settings.showPathRelativeTo = 'root';
        }
        return this;
    }
    getRootFromExplorerPath(filePath) {
        let dir = path.dirname(filePath);
        const stats = fs.statSync(dir);
        if (!stats.isDirectory()) {
            dir = path.resolve(dir, '..');
        }
        this.rootPath = dir;
        return Q(dir);
    }
    determineRoot() {
        let root;
        if (this.settings.relativeTo === 'project') {
            root = vscode_1.workspace.rootPath;
        }
        else if (this.settings.relativeTo === 'file') {
            if (vscode_1.window.activeTextEditor) {
                root = path.dirname(vscode_1.window.activeTextEditor.document.fileName);
            }
            else if (vscode_1.workspace.rootPath) {
                root = vscode_1.workspace.rootPath;
            }
        }
        if (!root) {
            root = this.settings.rootDirectory;
            if (root.indexOf('~') === 0) {
                root = path.join(this.homedir(), root.substr(1));
            }
        }
        this.rootPath = root;
        return Q(root);
    }
    getDefaultFileValue(root) {
        const newFileName = this.settings.defaultBaseFileName;
        const defaultExtension = this.settings.defaultFileExtension;
        const currentFileName = vscode_1.window.activeTextEditor ? vscode_1.window.activeTextEditor.document.fileName : '';
        const ext = path.extname(currentFileName) || defaultExtension;
        if (this.settings.showPathRelativeTo !== 'none') {
            const fullPath = path.join(root, `${newFileName}${ext}`);
            if (this.settings.showPathRelativeTo === 'project') {
                return Q(fullPath.replace(vscode_1.workspace.rootPath + path.sep, ''));
            }
            return Q(fullPath);
        }
        else {
            return Q(`${newFileName}${ext}`);
        }
    }
    showFileNameDialog(defaultFileValue, fromExplorer = false) {
        const deferred = Q.defer();
        let question = `What's the path and name of the new file?`;
        if (fromExplorer) {
            question += ' (Relative to selected file)';
        }
        else if (this.settings.showPathRelativeTo === 'none') {
            if (this.settings.relativeTo === 'project') {
                question += ' (Relative to project root)';
            }
            else if (this.settings.relativeTo === 'file') {
                question += ' (Relative to current file)';
            }
        }
        else if (this.settings.showPathRelativeTo === 'project') {
            question += ' (Relative to project root)';
        }
        vscode_1.window.showInputBox({
            prompt: question,
            value: defaultFileValue
        }).then(selectedFilePath => {
            if (selectedFilePath === null || typeof selectedFilePath === 'undefined') {
                deferred.reject(undefined);
                return;
            }
            selectedFilePath = selectedFilePath || defaultFileValue;
            if (selectedFilePath) {
                if (selectedFilePath.startsWith('./')) {
                    deferred.resolve(this.normalizeDotPath(selectedFilePath));
                }
                else {
                    if (this.settings.showPathRelativeTo !== 'none') {
                        if (this.settings.showPathRelativeTo === 'project') {
                            selectedFilePath = path.resolve(vscode_1.workspace.rootPath, selectedFilePath);
                        }
                        deferred.resolve(selectedFilePath);
                    }
                    else {
                        deferred.resolve(this.getFullPath(this.rootPath, selectedFilePath));
                    }
                }
            }
        });
        return deferred.promise;
    }
    createFile(newFileName) {
        const deferred = Q.defer();
        let dirname = path.dirname(newFileName);
        let fileExists = fs.existsSync(newFileName);
        if (!fileExists) {
            mkdirp.sync(dirname);
            fs.appendFile(newFileName, '', (err) => {
                if (err) {
                    deferred.reject(err);
                    return;
                }
                deferred.resolve(newFileName);
            });
        }
        else {
            deferred.resolve(newFileName);
        }
        return deferred.promise;
    }
    openFileInEditor(fileName) {
        const deferred = Q.defer();
        const stats = fs.statSync(fileName);
        if (stats.isDirectory()) {
            vscode_1.window.showInformationMessage('This file is already a directory. Try a different name.');
            deferred.resolve();
            return deferred.promise;
        }
        vscode_1.workspace.openTextDocument(fileName).then((textDocument) => {
            if (!textDocument) {
                deferred.reject(new Error('Could not open file!'));
                return;
            }
            vscode_1.window.showTextDocument(textDocument).then((editor) => {
                if (!editor) {
                    deferred.reject(new Error('Could not show document!'));
                    return;
                }
                deferred.resolve(editor);
            });
        });
        return deferred.promise;
    }
    normalizeDotPath(filePath) {
        const currentFileName = vscode_1.window.activeTextEditor ? vscode_1.window.activeTextEditor.document.fileName : '';
        const directory = currentFileName.length > 0 ? path.dirname(currentFileName) : vscode_1.workspace.rootPath;
        return path.resolve(directory, filePath);
    }
    getFullPath(root, filePath) {
        if (filePath.indexOf('/') === 0) {
            return filePath;
        }
        if (filePath.indexOf('~') === 0) {
            return path.join(this.homedir(), filePath.substr(1));
        }
        return path.resolve(root, filePath);
    }
    homedir() {
        return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
    }
}
exports.FileController = FileController;
//# sourceMappingURL=file-controller.js.map