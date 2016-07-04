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
var Register_1 = require('./Register');
var Reveal_1 = require('./Reveal');
var Range_1 = require('../Utils/Range');
var ActionDelete = (function () {
    function ActionDelete() {
    }
    ActionDelete.byMotions = function (args) {
        args.isChangeAction = args.isChangeAction === undefined ? false : args.isChangeAction;
        args.shouldYank = args.shouldYank === undefined ? false : args.shouldYank;
        var activeTextEditor = vscode_1.window.activeTextEditor;
        if (!activeTextEditor) {
            return Promise.resolve(false);
        }
        var document = activeTextEditor.document;
        var ranges = activeTextEditor.selections.map(function (selection) {
            var start = selection.active;
            var end = args.motions.reduce(function (position, motion) {
                return motion.apply(position, { isInclusive: true, isChangeAction: args.isChangeAction });
            }, start);
            return new vscode_1.Range(start, end);
        });
        ranges = ranges.map(function (range) {
            return Range_1.UtilRange.fitIntoDocument(document, range.isSingleLine ? range : Range_1.UtilRange.toLinewise(range));
        });
        ranges = Range_1.UtilRange.unionOverlaps(ranges);
        // TODO: Move cursor to first non-space if needed
        return (args.shouldYank ? Register_1.ActionRegister.yankRanges(ranges) : Promise.resolve(true))
            .then(function () {
            return activeTextEditor.edit(function (editBuilder) {
                ranges.forEach(function (range) { return editBuilder.delete(range); });
            });
        })
            .then(function () { return Reveal_1.ActionReveal.primaryCursor(); });
    };
    ActionDelete.byTextObject = function (args) {
        args.shouldYank = args.shouldYank === undefined ? false : args.shouldYank;
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
        if (ranges.length === 0) {
            return Promise.reject(false);
        }
        else {
            // Selections will be adjust to matched ranges' start.
            activeTextEditor.selections = ranges.map(function (range) { return new vscode_1.Selection(range.start, range.start); });
        }
        return (args.shouldYank ? Register_1.ActionRegister.yankRanges(ranges) : Promise.resolve(true))
            .then(function () {
            return activeTextEditor.edit(function (editBuilder) {
                ranges.forEach(function (range) { return editBuilder.delete(range); });
            });
        })
            .then(function () { return Reveal_1.ActionReveal.primaryCursor(); });
    };
    ActionDelete.selectionsOrLeft = function (args) {
        if (args === void 0) { args = {}; }
        args.isMultiLine = args.isMultiLine === undefined ? false : args.isMultiLine;
        args.shouldYank = args.shouldYank === undefined ? false : args.shouldYank;
        var activeTextEditor = vscode_1.window.activeTextEditor;
        if (!activeTextEditor) {
            return Promise.resolve(false);
        }
        var document = activeTextEditor.document;
        var ranges;
        if (args.isMultiLine) {
            ranges = activeTextEditor.selections.map(function (selection) {
                if (!selection.isEmpty) {
                    return selection;
                }
                var position = selection.active;
                if (position.character === 0) {
                    if (position.line === 0) {
                        return selection;
                    }
                    else {
                        var lineLength = document.lineAt(position.line - 1).text.length;
                        return new vscode_1.Range(position.translate(-1, lineLength), position);
                    }
                }
                else {
                    return new vscode_1.Range(selection.active, selection.active.translate(0, -1));
                }
            });
        }
        else {
            ranges = activeTextEditor.selections.map(function (selection) {
                return selection.isEmpty && selection.active.character !== 0
                    ? new vscode_1.Range(selection.active, selection.active.translate(0, -1))
                    : selection;
            });
        }
        ranges = Range_1.UtilRange.unionOverlaps(ranges);
        return (args.shouldYank ? Register_1.ActionRegister.yankRanges(ranges) : Promise.resolve(true))
            .then(function () {
            return activeTextEditor.edit(function (editBuilder) {
                ranges.forEach(function (range) { return editBuilder.delete(range); });
            });
        })
            .then(function () { return Reveal_1.ActionReveal.primaryCursor(); });
    };
    ActionDelete.selectionsOrRight = function (args) {
        if (args === void 0) { args = {}; }
        args.isMultiLine = args.isMultiLine === undefined ? false : args.isMultiLine;
        args.shouldYank = args.shouldYank === undefined ? false : args.shouldYank;
        var activeTextEditor = vscode_1.window.activeTextEditor;
        if (!activeTextEditor) {
            return Promise.resolve(false);
        }
        var document = activeTextEditor.document;
        var ranges;
        if (args.isMultiLine) {
            ranges = activeTextEditor.selections.map(function (selection) {
                if (!selection.isEmpty) {
                    return selection;
                }
                var position = selection.active;
                var lineLength = document.lineAt(position.line).text.length;
                if (position.character === lineLength) {
                    if (position.line === document.lineCount - 1) {
                        return selection;
                    }
                    else {
                        return new vscode_1.Range(position.line, position.character, position.line + 1, 0);
                    }
                }
                else {
                    return new vscode_1.Range(selection.active, selection.active.translate(0, +1));
                }
            });
        }
        else {
            ranges = activeTextEditor.selections.map(function (selection) {
                return selection.isEmpty
                    ? new vscode_1.Range(selection.active, selection.active.translate(0, +1))
                    : selection;
            });
        }
        ranges = Range_1.UtilRange.unionOverlaps(ranges);
        return (args.shouldYank ? Register_1.ActionRegister.yankRanges(ranges) : Promise.resolve(true))
            .then(function () {
            return activeTextEditor.edit(function (editBuilder) {
                ranges.forEach(function (range) { return editBuilder.delete(range); });
            });
        })
            .then(function () { return Reveal_1.ActionReveal.primaryCursor(); });
    };
    ActionDelete.line = function (args) {
        args.shouldYank = args.shouldYank === undefined ? false : args.shouldYank;
        var activeTextEditor = vscode_1.window.activeTextEditor;
        if (!activeTextEditor) {
            return Promise.resolve(false);
        }
        var document = activeTextEditor.document;
        var ranges = activeTextEditor.selections.map(function (selection) {
            return Range_1.UtilRange.fitIntoDocument(document, new vscode_1.Range(selection.start.line, 0, selection.end.line + 1, 0));
        });
        ranges = Range_1.UtilRange.unionOverlaps(ranges);
        return (args.shouldYank ? Register_1.ActionRegister.yankRanges(ranges) : Promise.resolve(true))
            .then(function () {
            return activeTextEditor.edit(function (editBuilder) {
                ranges.forEach(function (range) { return editBuilder.delete(range); });
            });
        })
            .then(function () { return Reveal_1.ActionReveal.primaryCursor(); });
    };
    __decorate([
        PrototypeReflect_1.PrototypeReflect.metadata(Metadata_1.SymbolMetadata.Action.isChange, true)
    ], ActionDelete, "byMotions", null);
    __decorate([
        PrototypeReflect_1.PrototypeReflect.metadata(Metadata_1.SymbolMetadata.Action.isChange, true)
    ], ActionDelete, "byTextObject", null);
    __decorate([
        PrototypeReflect_1.PrototypeReflect.metadata(Metadata_1.SymbolMetadata.Action.isChange, true)
    ], ActionDelete, "selectionsOrLeft", null);
    __decorate([
        PrototypeReflect_1.PrototypeReflect.metadata(Metadata_1.SymbolMetadata.Action.isChange, true)
    ], ActionDelete, "selectionsOrRight", null);
    __decorate([
        PrototypeReflect_1.PrototypeReflect.metadata(Metadata_1.SymbolMetadata.Action.isChange, true)
    ], ActionDelete, "line", null);
    return ActionDelete;
}());
exports.ActionDelete = ActionDelete;
;
//# sourceMappingURL=Delete.js.map