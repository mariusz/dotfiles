/// <reference path="../typings/tsd.d.ts" />
var vscode_1 = require('vscode');
var fs = require('fs');
var path = require('path');
var Q = require('q');
var mkdirp = require('mkdirp');
function activate(context) {
    console.log('Your extension "vscode-new-file" is now active!');
    var disposable = vscode_1.commands.registerCommand('extension.createNewFile', function () {
        var File = new FileController();
        File.showFileNameDialog()
            .then(File.determineFullPath)
            .then(File.createFile)
            .then(File.openFileInEditor)
            .catch(function (err) {
            if (err) {
                vscode_1.window.showErrorMessage(err);
            }
        });
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
var FileController = (function () {
    function FileController() {
    }
    FileController.prototype.showFileNameDialog = function () {
        var currentFileName = vscode_1.window.activeTextEditor ? vscode_1.window.activeTextEditor.document.fileName : '';
        var ext = path.extname(currentFileName) || '.ts';
        var deferred = Q.defer();
        vscode_1.window.showInputBox({
            prompt: 'What\'s the path and name of the new file? (Relative to current file)',
            value: "newFile" + ext
        }).then(function (relativeFilePath) {
            if (relativeFilePath) {
                deferred.resolve(relativeFilePath);
            }
        });
        return deferred.promise;
    };
    FileController.prototype.createFile = function (newFileName) {
        var deferred = Q.defer();
        var dirname = path.dirname(newFileName);
        var fileExists = fs.existsSync(newFileName);
        if (!fileExists) {
            mkdirp.sync(dirname);
            fs.appendFile(newFileName, '', function (err) {
                if (err) {
                    deferred.reject(err.message);
                    return;
                }
                deferred.resolve(newFileName);
            });
        }
        else {
            deferred.resolve(newFileName);
        }
        return deferred.promise;
    };
    FileController.prototype.openFileInEditor = function (fileName) {
        var deferred = Q.defer();
        vscode_1.workspace.openTextDocument(fileName).then(function (textDocument) {
            if (!textDocument) {
                deferred.reject('Could not open file!');
                return;
            }
            vscode_1.window.showTextDocument(textDocument).then(function (editor) {
                if (!editor) {
                    deferred.reject('Could not show document!');
                    return;
                }
                deferred.resolve(editor);
            });
        });
        return deferred.promise;
    };
    FileController.prototype.determineFullPath = function (filePath) {
        var deferred = Q.defer();
        var root = vscode_1.window.activeTextEditor.document.fileName;
        var isUntitled = vscode_1.window.activeTextEditor.document.isUntitled;
        if (filePath.indexOf('/') === '/') {
            if (root) {
                deferred.resolve(path.join(root, filePath));
            }
            else {
                deferred.resolve(filePath);
            }
            return deferred.promise;
        }
        if (root && !isUntitled) {
            deferred.resolve(path.join(root, '..', filePath));
            return deferred.promise;
        }
        var homePath = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
        var suggestedPath = path.join(homePath, filePath);
        var options = {
            matchOnDescription: true,
            placeHolder: "You don't have a file open. Should we use your home path?"
        };
        var choices = [
            { label: 'Yes', description: "Use " + suggestedPath + "." },
            { label: 'No', description: 'Let me declare the absolute path.' }
        ];
        vscode_1.window.showQuickPick(choices, options).then(function (choice) {
            if (!choice) {
                deferred.reject(null);
                return;
            }
            if (choice.label === 'Yes') {
                deferred.resolve(suggestedPath);
                return;
            }
            vscode_1.window.showInputBox({
                prompt: "What should be the base path for '" + filePath + "'",
                value: homePath
            }).then(function (basePath) {
                if (!basePath) {
                    deferred.reject(null);
                    return;
                }
                deferred.resolve(path.join(basePath, filePath));
            });
        });
        return deferred.promise;
    };
    return FileController;
})();
exports.FileController = FileController;
//# sourceMappingURL=extension.js.map