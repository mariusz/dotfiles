"use strict";
var vscode_1 = require('vscode');
var ActionHistory = (function () {
    function ActionHistory() {
    }
    // TODO: True vim style undo and redo
    ActionHistory.undo = function () {
        return vscode_1.commands.executeCommand('undo');
    };
    ActionHistory.redo = function () {
        return vscode_1.commands.executeCommand('redo');
    };
    return ActionHistory;
}());
exports.ActionHistory = ActionHistory;
;
//# sourceMappingURL=History.js.map