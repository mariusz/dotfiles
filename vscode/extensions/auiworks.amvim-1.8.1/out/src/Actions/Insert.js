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
var ActionInsert = (function () {
    function ActionInsert() {
    }
    ActionInsert.characterAtSelections = function (args) {
        return vscode_1.commands.executeCommand('default:type', { text: args.character });
    };
    ActionInsert.newLineBefore = function () {
        return vscode_1.commands.executeCommand('editor.action.insertLineBefore');
    };
    ActionInsert.newLineAfter = function () {
        return vscode_1.commands.executeCommand('editor.action.insertLineAfter');
    };
    __decorate([
        PrototypeReflect_1.PrototypeReflect.metadata(Metadata_1.SymbolMetadata.Action.isChange, true)
    ], ActionInsert, "characterAtSelections", null);
    __decorate([
        PrototypeReflect_1.PrototypeReflect.metadata(Metadata_1.SymbolMetadata.Action.isChange, true)
    ], ActionInsert, "newLineBefore", null);
    __decorate([
        PrototypeReflect_1.PrototypeReflect.metadata(Metadata_1.SymbolMetadata.Action.isChange, true)
    ], ActionInsert, "newLineAfter", null);
    return ActionInsert;
}());
exports.ActionInsert = ActionInsert;
//# sourceMappingURL=Insert.js.map