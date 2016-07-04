"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var vscode_1 = require('vscode');
var Motion_1 = require('./Motion');
var MotionLine = (function (_super) {
    __extends(MotionLine, _super);
    function MotionLine() {
        _super.apply(this, arguments);
        this.shouldToFirstNonBlank = false;
    }
    MotionLine.firstNonBlank = function () {
        var obj = new MotionLine();
        obj.shouldToFirstNonBlank = true;
        return obj;
    };
    MotionLine.start = function () {
        var obj = new MotionLine();
        obj.translate(0, -Infinity);
        return obj;
    };
    MotionLine.end = function () {
        var obj = new MotionLine();
        obj.translate(0, +Infinity);
        return obj;
    };
    MotionLine.prototype.apply = function (from) {
        from = _super.prototype.apply.call(this, from);
        var activeTextEditor = vscode_1.window.activeTextEditor;
        if (!activeTextEditor || !this.shouldToFirstNonBlank) {
            return from;
        }
        var document = activeTextEditor.document;
        var matches = document.lineAt(from.line).text.match(/^\s+/);
        var toCharacter = matches ? matches[0].length : 0;
        return from.with(undefined, toCharacter);
    };
    return MotionLine;
}(Motion_1.Motion));
exports.MotionLine = MotionLine;
//# sourceMappingURL=Line.js.map