"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var vscode_1 = require('vscode');
var PrototypeReflect_1 = require('../LanguageExtensions/PrototypeReflect');
var Metadata_1 = require('../Symbols/Metadata');
var Mode_1 = require('./Mode');
var BlockCursor_1 = require('../Actions/BlockCursor');
var MoveCursor_1 = require('../Actions/MoveCursor');
var Page_1 = require('../Actions/Page');
var Insert_1 = require('../Actions/Insert');
var Delete_1 = require('../Actions/Delete');
var Replace_1 = require('../Actions/Replace');
var Register_1 = require('../Actions/Register');
var Reveal_1 = require('../Actions/Reveal');
var Suggestion_1 = require('../Actions/Suggestion');
var JoinLines_1 = require('../Actions/JoinLines');
var Find_1 = require('../Actions/Find');
var Selection_1 = require('../Actions/Selection');
var History_1 = require('../Actions/History');
var Indent_1 = require('../Actions/Indent');
var Mode_2 = require('../Actions/Mode');
var Character_1 = require('../Motions/Character');
var Line_1 = require('../Motions/Line');
var ModeNormal = (function (_super) {
    __extends(ModeNormal, _super);
    function ModeNormal() {
        var _this = this;
        _super.call(this);
        this.id = Mode_1.ModeID.NORMAL;
        this.name = 'NORMAL';
        this.maps = [
            { keys: '{motion}', actions: [MoveCursor_1.ActionMoveCursor.byMotions], args: { noEmptyAtLineEnd: true } },
            { keys: 'ctrl+b', actions: [Page_1.ActionPage.up] },
            { keys: 'ctrl+f', actions: [Page_1.ActionPage.down] },
            { keys: 'i', actions: [Mode_2.ActionMode.toInsert] },
            { keys: 'I', actions: [
                    function () { return MoveCursor_1.ActionMoveCursor.byMotions({ motions: [Line_1.MotionLine.firstNonBlank()] }); },
                    Mode_2.ActionMode.toInsert,
                ] },
            { keys: 'a', actions: [
                    function () { return MoveCursor_1.ActionMoveCursor.byMotions({ motions: [Character_1.MotionCharacter.right()] }); },
                    Mode_2.ActionMode.toInsert,
                ] },
            { keys: 'A', actions: [
                    function () { return MoveCursor_1.ActionMoveCursor.byMotions({ motions: [Line_1.MotionLine.end()] }); },
                    Mode_2.ActionMode.toInsert,
                ] },
            { keys: 'o', actions: [
                    Insert_1.ActionInsert.newLineAfter,
                    Mode_2.ActionMode.toInsert,
                ] },
            { keys: 'O', actions: [
                    Insert_1.ActionInsert.newLineBefore,
                    Mode_2.ActionMode.toInsert,
                ] },
            { keys: 's', actions: [
                    Delete_1.ActionDelete.selectionsOrRight,
                    Mode_2.ActionMode.toInsert,
                ], args: {
                    shouldYank: true
                } },
            { keys: 'X', actions: [Delete_1.ActionDelete.selectionsOrLeft], args: { shouldYank: true } },
            { keys: 'x', actions: [
                    Delete_1.ActionDelete.selectionsOrRight,
                    Selection_1.ActionSelection.validateSelections,
                ], args: {
                    shouldYank: true
                } },
            { keys: 'delete', actions: [
                    Delete_1.ActionDelete.selectionsOrRight,
                    Selection_1.ActionSelection.validateSelections,
                ], args: {
                    shouldYank: true
                } },
            { keys: 'd d', actions: [Delete_1.ActionDelete.line], args: { shouldYank: true } },
            { keys: 'D', actions: [
                    Delete_1.ActionDelete.byMotions,
                    Selection_1.ActionSelection.validateSelections,
                ], args: {
                    motions: [Line_1.MotionLine.end()],
                    shouldYank: true
                } },
            { keys: 'd {motion}', actions: [
                    Delete_1.ActionDelete.byMotions,
                    Selection_1.ActionSelection.validateSelections,
                ], args: {
                    shouldYank: true
                } },
            { keys: 'd {textObject}', actions: [
                    Delete_1.ActionDelete.byTextObject,
                    Selection_1.ActionSelection.validateSelections,
                ], args: {
                    shouldYank: true
                } },
            { keys: 'C', actions: [
                    Delete_1.ActionDelete.byMotions,
                    Mode_2.ActionMode.toInsert,
                ], args: {
                    motions: [Line_1.MotionLine.end()],
                    shouldYank: true
                } },
            { keys: 'c c', actions: [
                    function () { return MoveCursor_1.ActionMoveCursor.byMotions({ motions: [Line_1.MotionLine.firstNonBlank()] }); },
                    Delete_1.ActionDelete.byMotions,
                    Mode_2.ActionMode.toInsert,
                ], args: {
                    motions: [Line_1.MotionLine.end()],
                    shouldYank: true
                } },
            { keys: 'S', actions: [
                    function () { return MoveCursor_1.ActionMoveCursor.byMotions({ motions: [Line_1.MotionLine.firstNonBlank()] }); },
                    Delete_1.ActionDelete.byMotions,
                    Mode_2.ActionMode.toInsert,
                ], args: {
                    motions: [Line_1.MotionLine.end()],
                    shouldYank: true
                } },
            { keys: 'c {motion}', actions: [
                    Delete_1.ActionDelete.byMotions,
                    Mode_2.ActionMode.toInsert,
                ], args: {
                    shouldYank: true,
                    isChangeAction: true,
                } },
            { keys: 'c {textObject}', actions: [
                    Delete_1.ActionDelete.byTextObject,
                    Mode_2.ActionMode.toInsert,
                ], args: {
                    shouldYank: true,
                } },
            { keys: 'J', actions: [JoinLines_1.ActionJoinLines.onSelections] },
            { keys: 'r {char}', actions: [Replace_1.ActionReplace.characters] },
            { keys: 'y y', actions: [Register_1.ActionRegister.yankLines] },
            { keys: 'Y', actions: [Register_1.ActionRegister.yankLines] },
            { keys: 'y {motion}', actions: [Register_1.ActionRegister.yankByMotions] },
            { keys: 'y {textObject}', actions: [Register_1.ActionRegister.yankByTextObject] },
            { keys: 'p', actions: [Register_1.ActionRegister.putAfter] },
            { keys: 'P', actions: [Register_1.ActionRegister.putBefore] },
            { keys: 'n', actions: [Find_1.ActionFind.next] },
            { keys: 'N', actions: [Find_1.ActionFind.prev] },
            { keys: '*', actions: [
                    Find_1.ActionFind.byIndicator,
                    Find_1.ActionFind.next,
                ] },
            { keys: '#', actions: [
                    Find_1.ActionFind.byIndicator,
                    Find_1.ActionFind.prev,
                ] },
            { keys: 'u', actions: [
                    History_1.ActionHistory.undo,
                    Selection_1.ActionSelection.validateSelections,
                ] },
            { keys: 'ctrl+r', actions: [
                    History_1.ActionHistory.redo,
                    Selection_1.ActionSelection.validateSelections,
                ] },
            { keys: '< <', actions: [Indent_1.ActionIndent.decrease] },
            { keys: '> >', actions: [Indent_1.ActionIndent.increase] },
            { keys: '/', actions: [Find_1.ActionFind.focusFindWidget] },
            { keys: 'v', actions: [Mode_2.ActionMode.toVisual] },
            { keys: 'V', actions: [Mode_2.ActionMode.toVisualLine] },
            { keys: 'z .', actions: [Reveal_1.ActionReveal.primaryCursor], args: { revealType: vscode_1.TextEditorRevealType.InCenter } },
            { keys: 'z z', actions: [Reveal_1.ActionReveal.primaryCursor], args: { revealType: vscode_1.TextEditorRevealType.InCenter } },
            { keys: '.', actions: [this.repeatRecordedCommandMaps.bind(this)] },
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
    ModeNormal.prototype.enter = function () {
        _super.prototype.enter.call(this);
        BlockCursor_1.ActionBlockCursor.on();
    };
    ModeNormal.prototype.exit = function () {
        _super.prototype.exit.call(this);
        BlockCursor_1.ActionBlockCursor.off();
    };
    ModeNormal.prototype.onWillCommandMapMakesChanges = function (map) {
        if (map.isRepeating) {
            return;
        }
        var actions = map.actions.filter(function (action) {
            return PrototypeReflect_1.PrototypeReflect.getMetadata(Metadata_1.SymbolMetadata.Action.shouldSkipOnRepeat, action) !== true;
        });
        this.recordedCommandMaps = [
            {
                keys: map.keys,
                actions: actions,
                args: map.args,
                isRepeating: true,
            }
        ];
    };
    ModeNormal.prototype.onDidRecordFinish = function (recordedCommandMaps) {
        if (!recordedCommandMaps || recordedCommandMaps.length === 0) {
            return;
        }
        recordedCommandMaps.forEach(function (map) { return map.isRepeating = true; });
        if (this.recordedCommandMaps === undefined) {
            this.recordedCommandMaps = recordedCommandMaps;
        }
        else {
            this.recordedCommandMaps = this.recordedCommandMaps.concat(recordedCommandMaps);
        }
    };
    ModeNormal.prototype.repeatRecordedCommandMaps = function () {
        var _this = this;
        if (this.recordedCommandMaps === undefined) {
            return Promise.resolve(false);
        }
        // TODO: Replace `args.n` if provided
        this.recordedCommandMaps.forEach(function (map) { return _this.pushCommandMap(map); });
        this.pushCommandMap({
            keys: 'escape',
            actions: [Suggestion_1.ActionSuggestion.hide],
        });
        this.execute();
        return Promise.resolve(true);
    };
    return ModeNormal;
}(Mode_1.Mode));
exports.ModeNormal = ModeNormal;
//# sourceMappingURL=Normal.js.map