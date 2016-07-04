"use strict";
var vscode_1 = require('vscode');
var Selection_1 = require('./Selection');
(function (PageMoveType) {
    PageMoveType[PageMoveType["Normal"] = 0] = "Normal";
    PageMoveType[PageMoveType["Select"] = 1] = "Select";
    PageMoveType[PageMoveType["SelectLine"] = 2] = "SelectLine";
})(exports.PageMoveType || (exports.PageMoveType = {}));
var PageMoveType = exports.PageMoveType;
;
var ActionPage = (function () {
    function ActionPage() {
    }
    ActionPage.up = function (args) {
        if (args === void 0) { args = {}; }
        args.moveType = args.moveType === undefined ? PageMoveType.Normal : args.moveType;
        if (args.moveType === PageMoveType.Normal) {
            return vscode_1.commands.executeCommand('cursorPageUp');
        }
        else {
            var thenable = vscode_1.commands.executeCommand('cursorPageUpSelect');
            if (args.moveType === PageMoveType.SelectLine) {
                thenable.then(function () { return Selection_1.ActionSelection.expandToLine(); });
            }
            return thenable;
        }
    };
    ActionPage.down = function (args) {
        if (args === void 0) { args = {}; }
        args.moveType = args.moveType === undefined ? PageMoveType.Normal : args.moveType;
        if (args.moveType === PageMoveType.Normal) {
            return vscode_1.commands.executeCommand('cursorPageDown');
        }
        else {
            var thenable = vscode_1.commands.executeCommand('cursorPageDownSelect');
            if (args.moveType === PageMoveType.SelectLine) {
                thenable.then(function () { return Selection_1.ActionSelection.expandToLine(); });
            }
            return thenable;
        }
    };
    return ActionPage;
}());
exports.ActionPage = ActionPage;
;
//# sourceMappingURL=Page.js.map