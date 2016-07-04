"use strict";
var vscode_1 = require('vscode');
var ActionBlockCursor = (function () {
    function ActionBlockCursor() {
    }
    ActionBlockCursor.on = function () {
        var activeTextEditor = vscode_1.window.activeTextEditor;
        if (!activeTextEditor) {
            return Promise.resolve(false);
        }
        var opt = vscode_1.window.activeTextEditor.options;
        opt.cursorStyle = vscode_1.TextEditorCursorStyle.Block;
        vscode_1.window.activeTextEditor.options = opt;
        return Promise.resolve(true);
    };
    ActionBlockCursor.off = function () {
        var activeTextEditor = vscode_1.window.activeTextEditor;
        if (!activeTextEditor) {
            return Promise.resolve(false);
        }
        var opt = vscode_1.window.activeTextEditor.options;
        opt.cursorStyle = vscode_1.TextEditorCursorStyle.Line;
        vscode_1.window.activeTextEditor.options = opt;
        return Promise.resolve(true);
    };
    return ActionBlockCursor;
}());
exports.ActionBlockCursor = ActionBlockCursor;
//# sourceMappingURL=BlockCursor.js.map