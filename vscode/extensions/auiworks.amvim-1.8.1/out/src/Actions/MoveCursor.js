"use strict";
var vscode_1 = require('vscode');
var Reveal_1 = require('./Reveal');
var ActionMoveCursor = (function () {
    function ActionMoveCursor() {
    }
    ActionMoveCursor.blockUpdatePreferedCharacter = function () {
        if (ActionMoveCursor.preferedCharacterBlockTimer) {
            clearTimeout(ActionMoveCursor.preferedCharacterBlockTimer);
        }
        ActionMoveCursor.isUpdatePreferedCharacterBlocked = true;
        ActionMoveCursor.preferedCharacterBlockTimer = setTimeout(function () {
            ActionMoveCursor.isUpdatePreferedCharacterBlocked = false;
            ActionMoveCursor.preferedCharacterBlockTimer = null;
        }, 100);
    };
    ActionMoveCursor.updatePreferedCharacter = function () {
        if (ActionMoveCursor.isUpdatePreferedCharacterBlocked) {
            return Promise.resolve(false);
        }
        var activeTextEditor = vscode_1.window.activeTextEditor;
        if (!activeTextEditor) {
            return Promise.resolve(false);
        }
        ActionMoveCursor.preferedCharacterBySelectionIndex =
            activeTextEditor.selections.map(function (selection) { return selection.active.character; });
        return Promise.resolve(true);
    };
    ActionMoveCursor.byMotions = function (args) {
        args.isVisualMode = args.isVisualMode === undefined ? false : args.isVisualMode;
        args.isVisualLineMode = args.isVisualLineMode === undefined ? false : args.isVisualLineMode;
        args.noEmptyAtLineEnd = args.noEmptyAtLineEnd === undefined ? false : args.noEmptyAtLineEnd;
        var activeTextEditor = vscode_1.window.activeTextEditor;
        if (!activeTextEditor) {
            return Promise.resolve(false);
        }
        // Prevent prefered character update if no motion updates character.
        if (args.motions.every(function (motion) { return !motion.isCharacterUpdated; })) {
            ActionMoveCursor.blockUpdatePreferedCharacter();
        }
        var document = activeTextEditor.document;
        activeTextEditor.selections = activeTextEditor.selections.map(function (selection, i) {
            var anchor;
            var active = args.motions.reduce(function (position, motion) {
                return motion.apply(position, {
                    isInclusive: args.isVisualMode,
                    preferedCharacter: ActionMoveCursor.preferedCharacterBySelectionIndex[i]
                });
            }, selection.active);
            if (args.isVisualMode) {
                anchor = selection.anchor;
                if (anchor.isEqual(active)) {
                    if (active.isBefore(selection.active)) {
                        anchor = anchor.translate(0, +1);
                        if (active.character > 0) {
                            active = active.translate(0, -1);
                        }
                    }
                    else {
                        if (anchor.character > 0) {
                            anchor = anchor.translate(0, -1);
                        }
                        active = active.translate(0, +1);
                    }
                }
            }
            else if (args.isVisualLineMode) {
                anchor = selection.anchor;
                if (anchor.isBefore(active)) {
                    anchor = anchor.with(undefined, 0);
                    active = active.with(undefined, activeTextEditor.document.lineAt(active.line).text.length);
                }
                else {
                    anchor = anchor.with(undefined, activeTextEditor.document.lineAt(anchor.line).text.length);
                    active = active.with(undefined, 0);
                }
            }
            else {
                if (args.noEmptyAtLineEnd) {
                    var lineEndCharacter = document.lineAt(active.line).text.length;
                    if (lineEndCharacter !== 0 && active.character === lineEndCharacter) {
                        active = active.translate(0, -1);
                    }
                }
                anchor = active;
            }
            return new vscode_1.Selection(anchor, active);
        });
        return Reveal_1.ActionReveal.primaryCursor();
    };
    ActionMoveCursor.preferedCharacterBySelectionIndex = [];
    ActionMoveCursor.isUpdatePreferedCharacterBlocked = false;
    return ActionMoveCursor;
}());
exports.ActionMoveCursor = ActionMoveCursor;
//# sourceMappingURL=MoveCursor.js.map