"use strict";
var vscode_1 = require('vscode');
var PrototypeReflect_1 = require('../LanguageExtensions/PrototypeReflect');
var Metadata_1 = require('../Symbols/Metadata');
var Generic_1 = require('../Mappers/Generic');
var Command_1 = require('../Mappers/Command');
(function (ModeID) {
    ModeID[ModeID["NORMAL"] = 0] = "NORMAL";
    ModeID[ModeID["VISUAL"] = 1] = "VISUAL";
    ModeID[ModeID["VISUAL_LINE"] = 2] = "VISUAL_LINE";
    ModeID[ModeID["INSERT"] = 3] = "INSERT";
})(exports.ModeID || (exports.ModeID = {}));
var ModeID = exports.ModeID;
;
var Mode = (function () {
    function Mode() {
        this.pendings = [];
        this.executing = false;
        this.inputs = [];
        this.mapper = new Command_1.CommandMapper();
    }
    Mode.prototype.enter = function () {
        this.updateStatusBar();
    };
    Mode.prototype.updateStatusBar = function (message) {
        var status = "-- " + this.name + " --";
        if (message) {
            status += " " + message;
        }
        vscode_1.window.setStatusBarMessage(status);
    };
    Mode.prototype.exit = function () {
        this.clearInputs();
        this.clearPendings();
    };
    Mode.prototype.dispose = function () {
        this.exit();
    };
    Mode.prototype.clearInputs = function () {
        this.inputs = [];
    };
    Mode.prototype.clearPendings = function () {
        this.pendings = [];
    };
    Mode.prototype.input = function (key, args) {
        if (args === void 0) { args = {}; }
        var inputs;
        if (key === 'escape') {
            inputs = [key];
        }
        else {
            this.inputs.push(key);
            inputs = this.inputs;
        }
        var _a = this.mapper.match(inputs), kind = _a.kind, map = _a.map;
        if (kind === Generic_1.MatchResultKind.FAILED) {
            this.updateStatusBar();
            this.clearInputs();
        }
        else if (kind === Generic_1.MatchResultKind.FOUND) {
            this.updateStatusBar();
            this.clearInputs();
            this.pushCommandMap(map);
            this.execute();
        }
        else if (kind === Generic_1.MatchResultKind.WAITING) {
            this.updateStatusBar(this.inputs.join(' ') + " and...");
        }
        return kind;
    };
    Mode.prototype.pushCommandMap = function (map) {
        this.pendings.push(map);
    };
    /**
     * Override this to do something before command map makes changes.
     */
    Mode.prototype.onWillCommandMapMakesChanges = function (map) { };
    /**
     * Override this to do something after recording ends.
     */
    Mode.prototype.onDidRecordFinish = function (recordedCommandMaps) { };
    Mode.prototype.execute = function () {
        var _this = this;
        if (this.executing) {
            return;
        }
        this.executing = true;
        var one = function () {
            var map = _this.pendings.shift();
            if (!map) {
                _this.executing = false;
                return;
            }
            var isAnyActionIsChange = map.actions.some(function (action) {
                return PrototypeReflect_1.PrototypeReflect.getMetadata(Metadata_1.SymbolMetadata.Action.isChange, action);
            });
            if (isAnyActionIsChange) {
                _this.onWillCommandMapMakesChanges(map);
            }
            var promise = Promise.resolve(true);
            map.actions.forEach(function (action) {
                promise = promise.then(function () { return action(map.args); });
            });
            promise.then(one.bind(_this), function () {
                _this.clearPendings();
                _this.executing = false;
            });
        };
        one();
    };
    return Mode;
}());
exports.Mode = Mode;
//# sourceMappingURL=Mode.js.map