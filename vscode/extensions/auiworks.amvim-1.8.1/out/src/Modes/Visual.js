"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Mode_1 = require('./Mode');
var MoveCursor_1 = require('../Actions/MoveCursor');
var Page_1 = require('../Actions/Page');
var Selection_1 = require('../Actions/Selection');
var Suggestion_1 = require('../Actions/Suggestion');
var Register_1 = require('../Actions/Register');
var Delete_1 = require('../Actions/Delete');
var Insert_1 = require('../Actions/Insert');
var Replace_1 = require('../Actions/Replace');
var Indent_1 = require('../Actions/Indent');
var JoinLines_1 = require('../Actions/JoinLines');
var Find_1 = require('../Actions/Find');
var Mode_2 = require('../Actions/Mode');
var ModeVisual = (function (_super) {
    __extends(ModeVisual, _super);
    function ModeVisual() {
        var _this = this;
        _super.call(this);
        this.id = Mode_1.ModeID.VISUAL;
        this.name = 'VISUAL';
        this.maps = [
            { keys: '{motion}', actions: [MoveCursor_1.ActionMoveCursor.byMotions], args: { isVisualMode: true } },
            { keys: 'ctrl+b', actions: [Page_1.ActionPage.up], args: { moveType: Page_1.PageMoveType.Select } },
            { keys: 'ctrl+f', actions: [Page_1.ActionPage.down], args: { moveType: Page_1.PageMoveType.Select } },
            { keys: 'I', actions: [
                    Selection_1.ActionSelection.shrinkToStarts,
                    Mode_2.ActionMode.toInsert,
                ] },
            { keys: 'A', actions: [
                    Selection_1.ActionSelection.shrinkToEnds,
                    Mode_2.ActionMode.toInsert,
                ] },
            { keys: 'backspace', actions: [Delete_1.ActionDelete.selectionsOrRight], args: { shouldYank: true } },
            { keys: 'delete', actions: [Delete_1.ActionDelete.selectionsOrRight], args: { shouldYank: true } },
            { keys: 'x', actions: [Delete_1.ActionDelete.selectionsOrRight], args: { shouldYank: true } },
            { keys: 'X', actions: [Delete_1.ActionDelete.line], args: { shouldYank: true } },
            { keys: 'd', actions: [Delete_1.ActionDelete.selectionsOrRight], args: { shouldYank: true } },
            { keys: 'D', actions: [Delete_1.ActionDelete.line], args: { shouldYank: true } },
            { keys: 'c', actions: [
                    Delete_1.ActionDelete.selectionsOrRight,
                    Mode_2.ActionMode.toInsert,
                ], args: { shouldYank: true } },
            { keys: 'C', actions: [
                    Delete_1.ActionDelete.line,
                    Insert_1.ActionInsert.newLineBefore,
                    Mode_2.ActionMode.toInsert,
                ], args: { shouldYank: true } },
            { keys: 's', actions: [
                    Delete_1.ActionDelete.selectionsOrRight,
                    Mode_2.ActionMode.toInsert,
                ], args: { shouldYank: true } },
            { keys: 'S', actions: [
                    Delete_1.ActionDelete.line,
                    Insert_1.ActionInsert.newLineBefore,
                    Mode_2.ActionMode.toInsert,
                ], args: { shouldYank: true } },
            { keys: 'y', actions: [
                    Register_1.ActionRegister.yankSelections,
                    Selection_1.ActionSelection.shrinkToStarts,
                ] },
            { keys: 'J', actions: [
                    JoinLines_1.ActionJoinLines.onSelections,
                    Selection_1.ActionSelection.shrinkToActives,
                ] },
            { keys: 'r {char}', actions: [Replace_1.ActionReplace.selections] },
            { keys: '<', actions: [Indent_1.ActionIndent.decrease] },
            { keys: '>', actions: [Indent_1.ActionIndent.increase] },
            { keys: '/', actions: [Find_1.ActionFind.focusFindWidget] },
            { keys: 'V', actions: [Mode_2.ActionMode.toVisualLine] },
            { keys: 'v', actions: [Selection_1.ActionSelection.shrinkToPrimaryActive] },
            { keys: 'ctrl+c', actions: [
                    Suggestion_1.ActionSuggestion.hide,
                    Selection_1.ActionSelection.shrinkToPrimaryActive,
                ] },
            { keys: 'ctrl+[', actions: [
                    Suggestion_1.ActionSuggestion.hide,
                    Selection_1.ActionSelection.shrinkToPrimaryActive,
                ] },
            { keys: 'escape', actions: [
                    Suggestion_1.ActionSuggestion.hide,
                    Selection_1.ActionSelection.shrinkToPrimaryActive,
                ] },
        ];
        this.maps.forEach(function (map) {
            _this.mapper.map(map.keys, map.actions, map.args);
        });
    }
    ModeVisual.prototype.enter = function () {
        _super.prototype.enter.call(this);
        Selection_1.ActionSelection.expandToOne();
    };
    return ModeVisual;
}(Mode_1.Mode));
exports.ModeVisual = ModeVisual;
//# sourceMappingURL=Visual.js.map