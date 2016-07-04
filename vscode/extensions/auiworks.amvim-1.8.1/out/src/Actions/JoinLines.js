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
var Reveal_1 = require('./Reveal');
var Range_1 = require('../Utils/Range');
var ActionJoinLines = (function () {
    function ActionJoinLines() {
    }
    ActionJoinLines.onSelections = function () {
        var activeTextEditor = vscode_1.window.activeTextEditor;
        if (!activeTextEditor) {
            return Promise.resolve(false);
        }
        return activeTextEditor.edit(function (editBuilder) {
            var rangeByLine = function (line) {
                if (line >= activeTextEditor.document.lineCount - 1) {
                    return;
                }
                var thisLine = activeTextEditor.document.lineAt(line).text;
                var nextLine = activeTextEditor.document.lineAt(line + 1).text;
                var thisLineTrimLength = (function () {
                    var matches = thisLine.match(/\s+$/);
                    return matches ? matches[0].length : 0;
                })();
                var nextLineTrimLength = (function () {
                    var matches = nextLine.match(/^\s+/);
                    return matches ? matches[0].length : 0;
                })();
                return new vscode_1.Range(line, thisLine.length - thisLineTrimLength, line + 1, nextLineTrimLength);
            };
            var linesToJoin = [];
            activeTextEditor.selections.forEach(function (selection) {
                if (selection.isSingleLine) {
                    linesToJoin.push(selection.active.line);
                }
                else {
                    for (var line = selection.start.line; line < selection.end.line; line++) {
                        linesToJoin.push(line);
                    }
                }
            });
            var ranges = [];
            linesToJoin.forEach(function (line) {
                var range = rangeByLine(line);
                if (range) {
                    ranges.push(range);
                }
            });
            ranges = Range_1.UtilRange.unionOverlaps(ranges);
            ranges.forEach(function (range) {
                editBuilder.replace(range, ' ');
            });
        })
            .then(function () { return Reveal_1.ActionReveal.primaryCursor(); });
    };
    __decorate([
        PrototypeReflect_1.PrototypeReflect.metadata(Metadata_1.SymbolMetadata.Action.isChange, true)
    ], ActionJoinLines, "onSelections", null);
    return ActionJoinLines;
}());
exports.ActionJoinLines = ActionJoinLines;
//# sourceMappingURL=JoinLines.js.map