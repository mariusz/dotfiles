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
var ActionIndent = (function () {
    function ActionIndent() {
    }
    ActionIndent.increase = function () {
        return vscode_1.commands.executeCommand('editor.action.indentLines');
    };
    ActionIndent.decrease = function () {
        return vscode_1.commands.executeCommand('editor.action.outdentLines');
    };
    __decorate([
        PrototypeReflect_1.PrototypeReflect.metadata(Metadata_1.SymbolMetadata.Action.isChange, true)
    ], ActionIndent, "increase", null);
    __decorate([
        PrototypeReflect_1.PrototypeReflect.metadata(Metadata_1.SymbolMetadata.Action.isChange, true)
    ], ActionIndent, "decrease", null);
    return ActionIndent;
}());
exports.ActionIndent = ActionIndent;
;
//# sourceMappingURL=Indent.js.map