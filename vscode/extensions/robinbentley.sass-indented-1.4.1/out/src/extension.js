'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
var vscode = require('vscode');
var sassAutocomplete_1 = require('./sassAutocomplete');
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    vscode.languages.setLanguageConfiguration('sass', {
        wordPattern: /(#?-?\d*\.\d\w*%?)|([$@#!.:]?[\w-?]+%?)|[$@#!.]/g
    });
    var sassCompletion = new sassAutocomplete_1.default();
    var sassCompletionRegister = vscode.languages.registerCompletionItemProvider('sass', sassCompletion, '\\.', '@');
    context.subscriptions.push(sassCompletionRegister);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map