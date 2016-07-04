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
var Mode_1 = require('../Modes/Mode');
var Selection_1 = require('../Actions/Selection');
var ActionMode = (function () {
    function ActionMode() {
    }
    ActionMode.toNormal = function () {
        return vscode_1.commands.executeCommand("amVim.mode." + Mode_1.ModeID.NORMAL)
            .then(function () { return Selection_1.ActionSelection.validateSelections(); });
    };
    ActionMode.toVisual = function () {
        return vscode_1.commands.executeCommand("amVim.mode." + Mode_1.ModeID.VISUAL);
    };
    ActionMode.toVisualLine = function () {
        return vscode_1.commands.executeCommand("amVim.mode." + Mode_1.ModeID.VISUAL_LINE);
    };
    ActionMode.toInsert = function () {
        return vscode_1.commands.executeCommand("amVim.mode." + Mode_1.ModeID.INSERT);
    };
    ActionMode.switchByActiveSelections = function (currentMode) {
        var activeTextEditor = vscode_1.window.activeTextEditor;
        if (!activeTextEditor) {
            return Promise.resolve(false);
        }
        var selections = activeTextEditor.selections;
        var mode;
        if (currentMode === Mode_1.ModeID.INSERT) {
            return Promise.resolve(true);
        }
        if (selections.every(function (selection) { return selection.isEmpty; })) {
            mode = Mode_1.ModeID.NORMAL;
        }
        else {
            mode = Mode_1.ModeID.VISUAL;
        }
        if (mode === currentMode) {
            return Promise.resolve(true);
        }
        else if (mode === Mode_1.ModeID.VISUAL && currentMode === Mode_1.ModeID.VISUAL_LINE) {
            return Promise.resolve(true);
        }
        else {
            return vscode_1.commands.executeCommand("amVim.mode." + mode);
        }
    };
    __decorate([
        PrototypeReflect_1.PrototypeReflect.metadata(Metadata_1.SymbolMetadata.Action.shouldSkipOnRepeat, true)
    ], ActionMode, "toNormal", null);
    __decorate([
        PrototypeReflect_1.PrototypeReflect.metadata(Metadata_1.SymbolMetadata.Action.shouldSkipOnRepeat, true)
    ], ActionMode, "toVisual", null);
    __decorate([
        PrototypeReflect_1.PrototypeReflect.metadata(Metadata_1.SymbolMetadata.Action.shouldSkipOnRepeat, true)
    ], ActionMode, "toVisualLine", null);
    __decorate([
        PrototypeReflect_1.PrototypeReflect.metadata(Metadata_1.SymbolMetadata.Action.isChange, true),
        PrototypeReflect_1.PrototypeReflect.metadata(Metadata_1.SymbolMetadata.Action.shouldSkipOnRepeat, true)
    ], ActionMode, "toInsert", null);
    return ActionMode;
}());
exports.ActionMode = ActionMode;
;
//# sourceMappingURL=Mode.js.map