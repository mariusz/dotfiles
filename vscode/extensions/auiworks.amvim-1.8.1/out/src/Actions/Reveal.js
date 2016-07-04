"use strict";
var vscode_1 = require('vscode');
var ActionReveal = (function () {
    function ActionReveal() {
    }
    ActionReveal.primaryCursor = function (args) {
        if (args === void 0) { args = {}; }
        args.revealType = args.revealType === undefined ? vscode_1.TextEditorRevealType.Default : args.revealType;
        var activeTextEditor = vscode_1.window.activeTextEditor;
        if (!activeTextEditor) {
            return Promise.resolve(false);
        }
        var activePosition = activeTextEditor.selection.active;
        activeTextEditor.revealRange(new vscode_1.Range(activePosition, activePosition), args.revealType);
        return Promise.resolve(true);
    };
    return ActionReveal;
}());
exports.ActionReveal = ActionReveal;
//# sourceMappingURL=Reveal.js.map