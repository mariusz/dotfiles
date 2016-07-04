"use strict";
var vscode_1 = require('vscode');
var ActionFind = (function () {
    function ActionFind() {
    }
    ActionFind.focusFindWidget = function () {
        return vscode_1.commands.executeCommand('actions.find');
    };
    // TODO: Implement independent find function to avoid incorrect cursor position after `next()`
    ActionFind.byIndicator = function () {
        var activeTextEditor = vscode_1.window.activeTextEditor;
        if (!activeTextEditor) {
            return Promise.resolve(false);
        }
        activeTextEditor.selection = new vscode_1.Selection(activeTextEditor.selection.active, activeTextEditor.selection.active);
        return vscode_1.commands.executeCommand('editor.action.addSelectionToNextFindMatch');
    };
    ActionFind.next = function () {
        var activeTextEditor = vscode_1.window.activeTextEditor;
        if (!activeTextEditor) {
            return Promise.resolve(false);
        }
        return vscode_1.commands.executeCommand('editor.action.nextMatchFindAction')
            .then(function () {
            vscode_1.window.showTextDocument(activeTextEditor.document, activeTextEditor.viewColumn);
            activeTextEditor.selection = new vscode_1.Selection(activeTextEditor.selection.end, activeTextEditor.selection.end);
            return Promise.resolve(true);
        });
    };
    ActionFind.prev = function () {
        var activeTextEditor = vscode_1.window.activeTextEditor;
        if (!activeTextEditor) {
            return Promise.resolve(false);
        }
        return vscode_1.commands.executeCommand('editor.action.previousMatchFindAction')
            .then(function () {
            vscode_1.window.showTextDocument(activeTextEditor.document, activeTextEditor.viewColumn);
            activeTextEditor.selection = new vscode_1.Selection(activeTextEditor.selection.start, activeTextEditor.selection.start);
            return Promise.resolve(true);
        });
    };
    return ActionFind;
}());
exports.ActionFind = ActionFind;
;
//# sourceMappingURL=Find.js.map