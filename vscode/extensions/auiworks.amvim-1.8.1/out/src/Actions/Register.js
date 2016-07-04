"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var vscode_1 = require('vscode');
var PrototypeReflect_1 = require('../LanguageExtensions/PrototypeReflect');
var Metadata_1 = require('../Symbols/Metadata');
var MoveCursor_1 = require('./MoveCursor');
var Selection_1 = require('./Selection');
var Character_1 = require('../Motions/Character');
var Line_1 = require('../Motions/Line');
var Range_1 = require('../Utils/Range');
var PutDirection;
(function (PutDirection) {
    PutDirection[PutDirection["Before"] = 0] = "Before";
    PutDirection[PutDirection["After"] = 1] = "After";
})(PutDirection || (PutDirection = {}));
;
var ActionRegister = (function () {
    function ActionRegister() {
    }
    ActionRegister.yankRanges = function (ranges) {
        var activeTextEditor = vscode_1.window.activeTextEditor;
        if (!activeTextEditor) {
            return Promise.resolve(false);
        }
        var document = activeTextEditor.document;
        ActionRegister.stash = ranges.map(function (range) {
            return document.getText(Range_1.UtilRange.fitIntoDocument(document, range));
        }).join('');
        return Promise.resolve(true);
    };
    ActionRegister.yankByMotions = function (args) {
        var activeTextEditor = vscode_1.window.activeTextEditor;
        if (!activeTextEditor) {
            return Promise.resolve(false);
        }
        var document = activeTextEditor.document;
        var ranges = activeTextEditor.selections.map(function (selection) {
            var start = selection.active;
            var end = args.motions.reduce(function (position, motion) {
                return motion.apply(position, { isInclusive: true });
            }, start);
            return new vscode_1.Range(start, end);
        });
        ranges = ranges.map(function (range) {
            return Range_1.UtilRange.fitIntoDocument(document, range.isSingleLine ? range : Range_1.UtilRange.toLinewise(range));
        });
        ranges = Range_1.UtilRange.unionOverlaps(ranges);
        return ActionRegister.yankRanges(ranges);
    };
    ActionRegister.yankByTextObject = function (args) {
        var activeTextEditor = vscode_1.window.activeTextEditor;
        if (!activeTextEditor) {
            return Promise.resolve(false);
        }
        var ranges = [];
        activeTextEditor.selections.forEach(function (selection) {
            var match = args.textObject.apply(selection.active);
            if (match) {
                ranges.push(match);
            }
        });
        ranges = Range_1.UtilRange.unionOverlaps(ranges);
        return ActionRegister.yankRanges(ranges);
    };
    ActionRegister.yankSelections = function () {
        var activeTextEditor = vscode_1.window.activeTextEditor;
        if (!activeTextEditor) {
            return Promise.resolve(false);
        }
        return ActionRegister.yankRanges(activeTextEditor.selections);
    };
    ActionRegister.yankLines = function () {
        var activeTextEditor = vscode_1.window.activeTextEditor;
        if (!activeTextEditor) {
            return Promise.resolve(false);
        }
        var ranges = activeTextEditor.selections.map(function (selection) {
            return Range_1.UtilRange.toLinewise(selection);
        });
        ranges = Range_1.UtilRange.unionOverlaps(ranges);
        return ActionRegister.yankRanges(ranges);
    };
    ActionRegister.putAfter = function () {
        var activeTextEditor = vscode_1.window.activeTextEditor;
        if (!activeTextEditor) {
            return Promise.resolve(false);
        }
        var characters = ActionRegister.stash.length;
        var lines = ActionRegister.stash.split(/\n/).length;
        var putPositions = activeTextEditor.selections.map(function (selection) {
            return lines === 1
                ? selection.active.translate(0, +1)
                : new vscode_1.Position(selection.active.line + 1, 0);
        });
        return Selection_1.ActionSelection.shrinkToActives()
            .then(function () {
            return activeTextEditor.edit(function (editBuilder) {
                putPositions.forEach(function (position) {
                    editBuilder.insert(position, ActionRegister.stash);
                });
            });
        })
            .then(function () {
            if (lines === 1) {
                return MoveCursor_1.ActionMoveCursor.byMotions({ motions: [
                        Character_1.MotionCharacter.right({ n: characters }),
                    ] });
            }
            else {
                return MoveCursor_1.ActionMoveCursor.byMotions({ motions: [
                        Character_1.MotionCharacter.down({ n: lines - 1 }),
                        Line_1.MotionLine.firstNonBlank(),
                    ] });
            }
        });
    };
    ActionRegister.putBefore = function () {
        var activeTextEditor = vscode_1.window.activeTextEditor;
        if (!activeTextEditor) {
            return Promise.resolve(false);
        }
        var characters = ActionRegister.stash.length;
        var lines = ActionRegister.stash.split(/\n/).length;
        var putPositions = activeTextEditor.selections.map(function (selection) {
            return lines === 1
                ? selection.active
                : selection.active.with(undefined, 0);
        });
        return Selection_1.ActionSelection.shrinkToActives()
            .then(function () {
            return activeTextEditor.edit(function (editBuilder) {
                putPositions.forEach(function (position) {
                    editBuilder.insert(position, ActionRegister.stash);
                });
            });
        })
            .then(function () {
            if (lines === 1) {
                return MoveCursor_1.ActionMoveCursor.byMotions({ motions: [
                        Character_1.MotionCharacter.left(),
                    ] });
            }
            else {
                return MoveCursor_1.ActionMoveCursor.byMotions({ motions: [
                        Character_1.MotionCharacter.up(),
                        Line_1.MotionLine.firstNonBlank(),
                    ] });
            }
        });
    };
    ActionRegister.stash = '';
    __decorate([
        PrototypeReflect_1.PrototypeReflect.metadata(Metadata_1.SymbolMetadata.Action.isChange, true)
    ], ActionRegister, "putAfter", null);
    __decorate([
        PrototypeReflect_1.PrototypeReflect.metadata(Metadata_1.SymbolMetadata.Action.isChange, true)
    ], ActionRegister, "putBefore", null);
    return ActionRegister;
}());
exports.ActionRegister = ActionRegister;
;
//# sourceMappingURL=Register.js.map