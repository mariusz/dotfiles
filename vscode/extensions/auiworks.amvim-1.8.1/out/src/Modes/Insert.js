"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Mode_1 = require('./Mode');
var Generic_1 = require('../Mappers/Generic');
var Insert_1 = require('../Actions/Insert');
var Replace_1 = require('../Actions/Replace');
var Delete_1 = require('../Actions/Delete');
var Suggestion_1 = require('../Actions/Suggestion');
var Selection_1 = require('../Actions/Selection');
var Mode_2 = require('../Actions/Mode');
var Word_1 = require('../Motions/Word');
var Line_1 = require('../Motions/Line');
var ModeInsert = (function (_super) {
    __extends(ModeInsert, _super);
    function ModeInsert() {
        var _this = this;
        _super.call(this);
        this.id = Mode_1.ModeID.INSERT;
        this.name = 'INSERT';
        this.maps = [
            { keys: 'ctrl+w', actions: [function () { return Delete_1.ActionDelete.byMotions({ motions: [Word_1.MotionWord.prevStart()] }); }] },
            { keys: 'ctrl+u', actions: [function () { return Delete_1.ActionDelete.byMotions({ motions: [Line_1.MotionLine.firstNonBlank()] }); }] },
            { keys: 'ctrl+c', actions: [
                    Suggestion_1.ActionSuggestion.hide,
                    function () { return Selection_1.ActionSelection.shrinkAStep()
                        .then(function (isShrinked) { return isShrinked ? Promise.resolve(true) : Mode_2.ActionMode.toNormal(); }); },
                ] },
            { keys: 'ctrl+[', actions: [
                    Suggestion_1.ActionSuggestion.hide,
                    function () { return Selection_1.ActionSelection.shrinkAStep()
                        .then(function (isShrinked) { return isShrinked ? Promise.resolve(true) : Mode_2.ActionMode.toNormal(); }); },
                ] },
            { keys: 'escape', actions: [
                    Suggestion_1.ActionSuggestion.hide,
                    function () { return Selection_1.ActionSelection.shrinkAStep()
                        .then(function (isShrinked) { return isShrinked ? Promise.resolve(true) : Mode_2.ActionMode.toNormal(); }); },
                ] },
        ];
        this.shouldRecord = false;
        this.maps.forEach(function (map) {
            _this.mapper.map(map.keys, map.actions, map.args);
        });
    }
    ModeInsert.prototype.enter = function () {
        _super.prototype.enter.call(this);
        this.startRecord();
    };
    ModeInsert.prototype.exit = function () {
        _super.prototype.exit.call(this);
        this.stopRecord();
    };
    ModeInsert.prototype.input = function (key, args) {
        if (args === void 0) { args = {}; }
        var matchResultKind = _super.prototype.input.call(this, key);
        // Pass key to built-in command if match failed.
        if (matchResultKind !== Generic_1.MatchResultKind.FAILED) {
            return matchResultKind;
        }
        if (args.replaceCharCnt && args.replaceCharCnt > 0) {
            this.pushCommandMap({
                keys: key,
                actions: [Replace_1.ActionReplace.characters],
                args: {
                    character: key,
                    n: -args.replaceCharCnt
                }
            });
        }
        else {
            this.pushCommandMap({
                keys: key,
                actions: [Insert_1.ActionInsert.characterAtSelections],
                args: {
                    character: key
                }
            });
        }
        this.execute();
        return Generic_1.MatchResultKind.FOUND;
    };
    Object.defineProperty(ModeInsert.prototype, "recordedCommandMaps", {
        get: function () { return this._recordedCommandMaps; },
        enumerable: true,
        configurable: true
    });
    ModeInsert.prototype.startRecord = function () {
        this.shouldRecord = true;
        this._recordedCommandMaps = [];
    };
    ModeInsert.prototype.stopRecord = function () {
        this.shouldRecord = false;
    };
    // TODO: Deletion and autocomplete is not tracked now.
    ModeInsert.prototype.onWillCommandMapMakesChanges = function (map) {
        if (this.shouldRecord) {
            this._recordedCommandMaps.push(map);
        }
    };
    return ModeInsert;
}(Mode_1.Mode));
exports.ModeInsert = ModeInsert;
//# sourceMappingURL=Insert.js.map