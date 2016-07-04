"use strict";
var vscode_1 = require('vscode');
var Word_1 = require('./Motions/Word');
var Configuration = (function () {
    function Configuration() {
    }
    Configuration.init = function () {
        var _this = this;
        if (this.isReady) {
            return;
        }
        this.isReady = true;
        this.onDidChangeConfiguration();
        this.disposables.push(vscode_1.workspace.onDidChangeConfiguration(function () { return _this.onDidChangeConfiguration(); }));
    };
    Configuration.onDidChangeConfiguration = function () {
        this.updateCache();
        this.updateKeybindingContexts();
        Word_1.MotionWord.updateCharacterKindCache(this.getEditorSetting('wordSeparators'));
    };
    Configuration.updateCache = function () {
        this.extensionNamespace = vscode_1.workspace.getConfiguration('amVim');
        this.editorNamespace = vscode_1.workspace.getConfiguration('editor');
    };
    Configuration.updateKeybindingContexts = function () {
        vscode_1.commands.executeCommand('setContext', 'amVim.configuration.shouldBindCtrlCommands', this.getExtensionSetting('bindCtrlCommands'));
    };
    Configuration.getExtensionSetting = function (section, defaultValue) {
        return this.extensionNamespace.get(section, defaultValue);
    };
    Configuration.getEditorSetting = function (section, defaultValue) {
        return this.editorNamespace.get(section, defaultValue);
    };
    Configuration.dispose = function () {
        vscode_1.Disposable.from.apply(vscode_1.Disposable, this.disposables).dispose();
    };
    Configuration.isReady = false;
    Configuration.disposables = [];
    return Configuration;
}());
exports.Configuration = Configuration;
//# sourceMappingURL=Configuration.js.map