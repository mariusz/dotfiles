/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
'use strict';
var path = require('path');
var vscode_1 = require('vscode');
var vscode_languageclient_1 = require('vscode-languageclient');
var AllFixesRequest;
(function (AllFixesRequest) {
    AllFixesRequest.type = { get method() { return 'textDocument/eslint/allFixes'; } };
})(AllFixesRequest || (AllFixesRequest = {}));
function activate(context) {
    // We need to go one level up since an extension compile the js code into
    // the output folder.
    var serverModule = path.join(__dirname, '..', 'server', 'server.js');
    var debugOptions = { execArgv: ["--nolazy", "--debug=6004"] };
    var serverOptions = {
        run: { module: serverModule, transport: vscode_languageclient_1.TransportKind.ipc },
        debug: { module: serverModule, transport: vscode_languageclient_1.TransportKind.ipc, options: debugOptions }
    };
    var clientOptions = {
        documentSelector: ['javascript', 'javascriptreact'],
        synchronize: {
            configurationSection: 'eslint',
            fileEvents: vscode_1.workspace.createFileSystemWatcher('**/.eslintr{c.js,c.yaml,c.yml,c,c.json}')
        }
    };
    var client = new vscode_languageclient_1.LanguageClient('ESLint', serverOptions, clientOptions);
    function applyTextEdits(uri, documentVersion, edits) {
        var textEditor = vscode_1.window.activeTextEditor;
        if (textEditor && textEditor.document.uri.toString() === uri) {
            if (textEditor.document.version !== documentVersion) {
                vscode_1.window.showInformationMessage("ESLint fixes are outdated and can't be applied to the document.");
            }
            textEditor.edit(function (mutator) {
                for (var _i = 0, edits_1 = edits; _i < edits_1.length; _i++) {
                    var edit = edits_1[_i];
                    mutator.replace(vscode_languageclient_1.Protocol2Code.asRange(edit.range), edit.newText);
                }
            }).then(function (success) {
                if (!success) {
                    vscode_1.window.showErrorMessage('Failed to apply ESLint fixes to the document. Please consider opening an issue with steps to reproduce.');
                }
            });
        }
    }
    function fixAllProblems() {
        var textEditor = vscode_1.window.activeTextEditor;
        if (!textEditor) {
            return;
        }
        var uri = textEditor.document.uri.toString();
        client.sendRequest(AllFixesRequest.type, { textDocument: { uri: uri } }).then(function (result) {
            if (result) {
                applyTextEdits(uri, result.documentVersion, result.edits);
            }
        }, function (error) {
            vscode_1.window.showErrorMessage('Failed to apply ESLint fixes to the document. Please consider opening an issue with steps to reproduce.');
        });
    }
    context.subscriptions.push(new vscode_languageclient_1.SettingMonitor(client, 'eslint.enable').start(), vscode_1.commands.registerCommand('eslint.applySingleFix', applyTextEdits), vscode_1.commands.registerCommand('eslint.applySameFixes', applyTextEdits), vscode_1.commands.registerCommand('eslint.applyAllFixes', applyTextEdits), vscode_1.commands.registerCommand('eslint.fixAllProblems', fixAllProblems));
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map