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
var ActionReplace = (function () {
    function ActionReplace() {
    }
    ActionReplace.selections = function (args) {
        var activeTextEditor = vscode_1.window.activeTextEditor;
        if (!activeTextEditor) {
            return Promise.resolve(false);
        }
        return activeTextEditor.edit(function (editBuilder) {
            activeTextEditor.selections.forEach(function (selection) {
                var text = activeTextEditor.document.getText(selection);
                editBuilder.replace(selection, text.replace(/[^\n]/g, args.character));
            });
        })
            .then(function () { return Reveal_1.ActionReveal.primaryCursor(); });
    };
    ActionReplace.characters = function (args) {
        args.n = args.n === undefined ? 1 : args.n;
        var activeTextEditor = vscode_1.window.activeTextEditor;
        if (!activeTextEditor) {
            return Promise.resolve(false);
        }
        var ranges = activeTextEditor.selections.map(function (selection) {
            return new vscode_1.Range(selection.active, selection.active.translate(0, args.n));
        });
        ranges = Range_1.UtilRange.unionOverlaps(ranges);
        return activeTextEditor.edit(function (editBuilder) {
            ranges.forEach(function (range) {
                var text = activeTextEditor.document.getText(range);
                editBuilder.replace(range, text.replace(/[^\n]/g, args.character));
            });
        })
            .then(function () { return Reveal_1.ActionReveal.primaryCursor(); });
    };
    __decorate([
        PrototypeReflect_1.PrototypeReflect.metadata(Metadata_1.SymbolMetadata.Action.isChange, true)
    ], ActionReplace, "selections", null);
    __decorate([
        PrototypeReflect_1.PrototypeReflect.metadata(Metadata_1.SymbolMetadata.Action.isChange, true)
    ], ActionReplace, "characters", null);
    return ActionReplace;
}());
exports.ActionReplace = ActionReplace;
;
//# sourceMappingURL=Replace.js.map