"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var vscode_1 = require('vscode');
var Motion_1 = require('./Motion');
var MotionMatchDirection;
(function (MotionMatchDirection) {
    MotionMatchDirection[MotionMatchDirection["NEXT"] = 0] = "NEXT";
    MotionMatchDirection[MotionMatchDirection["PREV"] = 1] = "PREV";
})(MotionMatchDirection || (MotionMatchDirection = {}));
;
var MotionMatch = (function (_super) {
    __extends(MotionMatch, _super);
    function MotionMatch() {
        _super.apply(this, arguments);
    }
    MotionMatch.next = function (args) {
        args.isTill = args.isTill === undefined ? false : args.isTill;
        var obj = new MotionMatch();
        obj.character = args.character;
        obj.direction = MotionMatchDirection.NEXT;
        obj.isTill = args.isTill;
        return obj;
    };
    MotionMatch.prev = function (args) {
        args.isTill = args.isTill === undefined ? false : args.isTill;
        var obj = new MotionMatch();
        obj.character = args.character;
        obj.direction = MotionMatchDirection.PREV;
        obj.isTill = args.isTill;
        return obj;
    };
    MotionMatch.prototype.apply = function (from, option) {
        if (option === void 0) { option = {}; }
        option.isInclusive = option.isInclusive === undefined ? false : option.isInclusive;
        from = _super.prototype.apply.call(this, from);
        var activeTextEditor = vscode_1.window.activeTextEditor;
        if (!activeTextEditor || this.direction === undefined || !this.character) {
            return from;
        }
        var document = activeTextEditor.document;
        var toLine = from.line;
        var toCharacter = from.character;
        var targetText = document.lineAt(toLine).text;
        if (this.direction === MotionMatchDirection.NEXT) {
            targetText = targetText.substr(toCharacter + 1);
            var offset = targetText.indexOf(this.character);
            if (!!~offset) {
                toCharacter += offset + 1;
                if (option.isInclusive) {
                    toCharacter += 1;
                }
                if (this.isTill) {
                    toCharacter -= 1;
                }
            }
        }
        else if (this.direction === MotionMatchDirection.PREV) {
            targetText = targetText
                .substr(0, toCharacter)
                .split('').reverse().join('');
            var offset = targetText.indexOf(this.character);
            if (!!~offset) {
                toCharacter -= offset + 1;
                if (this.isTill) {
                    toCharacter += 1;
                }
            }
        }
        return new vscode_1.Position(toLine, toCharacter);
    };
    return MotionMatch;
}(Motion_1.Motion));
exports.MotionMatch = MotionMatch;
//# sourceMappingURL=Match.js.map