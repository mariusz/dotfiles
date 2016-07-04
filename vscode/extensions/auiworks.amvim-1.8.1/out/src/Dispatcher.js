"use strict";
var vscode_1 = require('vscode');
var Keys = require('./Keys');
var Mode_1 = require('./Modes/Mode');
var Normal_1 = require('./Modes/Normal');
var Visual_1 = require('./Modes/Visual');
var VisualLine_1 = require('./Modes/VisualLine');
var Insert_1 = require('./Modes/Insert');
var Mode_2 = require('./Actions/Mode');
var MoveCursor_1 = require('./Actions/MoveCursor');
var Dispatcher = (function () {
    function Dispatcher(context) {
        var _this = this;
        this.modes = (_a = {},
            _a[Mode_1.ModeID.NORMAL] = new Normal_1.ModeNormal(),
            _a[Mode_1.ModeID.VISUAL] = new Visual_1.ModeVisual(),
            _a[Mode_1.ModeID.VISUAL_LINE] = new VisualLine_1.ModeVisualLine(),
            _a[Mode_1.ModeID.INSERT] = new Insert_1.ModeInsert(),
            _a
        );
        this.disposables = [];
        Object.keys(this.modes).forEach(function (key) {
            var mode = _this.modes[key];
            context.subscriptions.push(vscode_1.commands.registerCommand("amVim.mode." + mode.id, function () {
                _this.switchMode(mode.id);
            }));
        });
        context.subscriptions.push(vscode_1.commands.registerCommand('type', function (args) {
            _this.inputHandler(args.text)();
        }));
        context.subscriptions.push(vscode_1.commands.registerCommand('replacePreviousChar', function (args) {
            _this.inputHandler(args.text, { replaceCharCnt: args.replaceCharCnt })();
        }));
        Keys.raws.forEach(function (key) {
            context.subscriptions.push(vscode_1.commands.registerCommand("amVim." + key, _this.inputHandler(key)));
        });
        MoveCursor_1.ActionMoveCursor.updatePreferedCharacter();
        this.switchMode(Mode_1.ModeID.NORMAL);
        this.disposables.push(vscode_1.window.onDidChangeTextEditorSelection(function () {
            Mode_2.ActionMode.switchByActiveSelections(_this.currentMode.id);
            MoveCursor_1.ActionMoveCursor.updatePreferedCharacter();
        }), vscode_1.window.onDidChangeActiveTextEditor(function () {
            Mode_2.ActionMode.switchByActiveSelections(_this.currentMode.id);
            MoveCursor_1.ActionMoveCursor.updatePreferedCharacter();
        }));
        var _a;
    }
    Object.defineProperty(Dispatcher.prototype, "currentModeId", {
        get: function () {
            return this.currentMode ? this.currentMode.id : null;
        },
        enumerable: true,
        configurable: true
    });
    Dispatcher.prototype.inputHandler = function (key, args) {
        var _this = this;
        if (args === void 0) { args = {}; }
        return function () {
            _this.currentMode.input(key, args);
        };
    };
    Dispatcher.prototype.switchMode = function (id) {
        if (this.currentMode === this.modes[id]) {
            return;
        }
        var previousMode = this.currentMode;
        if (previousMode) {
            previousMode.exit();
        }
        this.currentMode = this.modes[id];
        this.currentMode.enter();
        vscode_1.commands.executeCommand('setContext', 'amVim.mode', this.currentMode.name);
        // For use in repeat command
        if (previousMode && previousMode.id === Mode_1.ModeID.INSERT) {
            var recordedCommandMaps = previousMode.recordedCommandMaps;
            this.currentMode.onDidRecordFinish(recordedCommandMaps);
        }
    };
    Dispatcher.prototype.dispose = function () {
        var _this = this;
        vscode_1.Disposable.from.apply(vscode_1.Disposable, this.disposables).dispose();
        Object.keys(this.modes).forEach(function (id) {
            _this.modes[id].dispose();
        });
    };
    return Dispatcher;
}());
exports.Dispatcher = Dispatcher;
//# sourceMappingURL=Dispatcher.js.map