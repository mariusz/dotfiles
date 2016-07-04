"use strict";
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
var vscode = require('vscode');
var os_1 = require('os');
var jsbeautify = require('js-beautify');
var languageSelectors = ['css', 'sass', 'less'];
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    context.subscriptions.push(vscode.languages.registerDocumentFormattingEditProvider(languageSelectors, {
        provideDocumentFormattingEdits: function (document, options, token) {
            return format(context, document, null, options);
        }
    }));
    context.subscriptions.push(vscode.languages.registerDocumentRangeFormattingEditProvider(languageSelectors, {
        provideDocumentRangeFormattingEdits: function (document, range, options, token) {
            // var start = new vscode.Position(0, 0);
            // var end = new vscode.Position(document.lineCount - 1, document.lineAt(document.lineCount - 1).text.length);
            return format(context, document, range, options);
        }
    }));
}
exports.activate = activate;
function format(context, document, range, options) {
    if (range === null) {
        var start = new vscode.Position(0, 0);
        var end = new vscode.Position(document.lineCount - 1, document.lineAt(document.lineCount - 1).text.length);
        range = new vscode.Range(start, end);
    }
    var result = [];
    var content = document.getText(range);
    if (!options) {
        options = { insertSpaces: true, tabSize: 4 };
    }
    var beutifyOptions = {
        indent_char: options.insertSpaces ? ' ' : '\t',
        indent_size: options.insertSpaces ? options.tabSize : 1,
        selector_separator_newline: false
    };
    var formatted = jsbeautify.css_beautify(content, beutifyOptions);
    if (formatted) {
        //formatted = formatSassLessStatements(formatted);
        result.push(new vscode.TextEdit(range, formatted));
    }
    return result;
}
exports.format = format;
;
function formatSassLessStatements(sheet) {
    return sheet.replace(/^@.*;/gm, function (s) { return s + os_1.EOL; });
}
//# sourceMappingURL=extension.js.map