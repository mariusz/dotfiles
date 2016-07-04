"use strict";
var vscode_1 = require('vscode');
var extension_1 = require('../extension');
var Mode_1 = require('../Modes/Mode');
var ActionSelection = (function () {
    function ActionSelection() {
    }
    ActionSelection.validateSelections = function () {
        if (extension_1.currentModeId() !== Mode_1.ModeID.NORMAL) {
            return Promise.resolve(true);
        }
        var activeTextEditor = vscode_1.window.activeTextEditor;
        if (!activeTextEditor) {
            return Promise.resolve(false);
        }
        var document = activeTextEditor.document;
        var isChanged = false;
        var validatedSelections = activeTextEditor.selections.map(function (selection) {
            var position = selection.active;
            var endCharacter = document.lineAt(position).range.end.character;
            var maxCharacter = endCharacter > 0 ? endCharacter - 1 : endCharacter;
            if (position.character > maxCharacter) {
                isChanged = true;
                return new vscode_1.Selection(position.line, maxCharacter, position.line, maxCharacter);
            }
            else {
                return selection;
            }
        });
        if (isChanged) {
            activeTextEditor.selections = validatedSelections;
        }
        return Promise.resolve(true);
    };
    ActionSelection.shrinkAStep = function () {
        var activeTextEditor = vscode_1.window.activeTextEditor;
        if (!activeTextEditor) {
            return Promise.resolve(false);
        }
        if (activeTextEditor.selections.length > 1) {
            activeTextEditor.selections = [activeTextEditor.selection];
        }
        else if (!activeTextEditor.selection.isEmpty) {
            return ActionSelection.shrinkToPrimaryActive();
        }
        else {
            return Promise.resolve(false);
        }
        return Promise.resolve(true);
    };
    ActionSelection.shrinkToPrimaryActive = function () {
        var activeTextEditor = vscode_1.window.activeTextEditor;
        if (!activeTextEditor) {
            return Promise.resolve(false);
        }
        var position = activeTextEditor.selection.active;
        if (!activeTextEditor.selection.isReversed && position.character > 0) {
            position = position.translate(0, -1);
        }
        activeTextEditor.selection = new vscode_1.Selection(position, position);
        return Promise.resolve(true);
    };
    ActionSelection.shrinkToActives = function () {
        var activeTextEditor = vscode_1.window.activeTextEditor;
        if (!activeTextEditor) {
            return Promise.resolve(false);
        }
        activeTextEditor.selections = activeTextEditor.selections.map(function (selection) {
            return new vscode_1.Selection(selection.active, selection.active);
        });
        return Promise.resolve(true);
    };
    ActionSelection.shrinkToStarts = function () {
        var activeTextEditor = vscode_1.window.activeTextEditor;
        if (!activeTextEditor) {
            return Promise.resolve(false);
        }
        activeTextEditor.selections = activeTextEditor.selections.map(function (selection) {
            return new vscode_1.Selection(selection.start, selection.start);
        });
        return Promise.resolve(true);
    };
    ActionSelection.shrinkToEnds = function () {
        var activeTextEditor = vscode_1.window.activeTextEditor;
        if (!activeTextEditor) {
            return Promise.resolve(false);
        }
        activeTextEditor.selections = activeTextEditor.selections.map(function (selection) {
            return new vscode_1.Selection(selection.end, selection.end);
        });
        return Promise.resolve(true);
    };
    ActionSelection.expandToOne = function () {
        var activeTextEditor = vscode_1.window.activeTextEditor;
        if (!activeTextEditor) {
            return Promise.resolve(false);
        }
        activeTextEditor.selections = activeTextEditor.selections.map(function (selection) {
            return selection.isEmpty
                ? new vscode_1.Selection(selection.anchor, selection.anchor.translate(0, +1))
                : selection;
        });
        return Promise.resolve(true);
    };
    ActionSelection.expandToLine = function () {
        var activeTextEditor = vscode_1.window.activeTextEditor;
        if (!activeTextEditor) {
            return Promise.resolve(false);
        }
        activeTextEditor.selections = activeTextEditor.selections.map(function (selection) {
            var start = selection.start.with(undefined, 0);
            var end = selection.end.with(undefined, activeTextEditor.document.lineAt(selection.end.line).text.length);
            return selection.isReversed
                ? new vscode_1.Selection(end, start)
                : new vscode_1.Selection(start, end);
        });
        return Promise.resolve(true);
    };
    return ActionSelection;
}());
exports.ActionSelection = ActionSelection;
;
//# sourceMappingURL=Selection.js.map