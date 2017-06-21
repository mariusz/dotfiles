"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const Motion_1 = require("./Motion");
var MotionMatchDirection;
(function (MotionMatchDirection) {
    MotionMatchDirection[MotionMatchDirection["NEXT"] = 0] = "NEXT";
    MotionMatchDirection[MotionMatchDirection["PREV"] = 1] = "PREV";
})(MotionMatchDirection || (MotionMatchDirection = {}));
class MotionMatch extends Motion_1.Motion {
    static next(args) {
        args.isTill = args.isTill === undefined ? false : args.isTill;
        const obj = new MotionMatch();
        obj.character = args.character;
        obj.direction = MotionMatchDirection.NEXT;
        obj.isTill = args.isTill;
        return obj;
    }
    static prev(args) {
        args.isTill = args.isTill === undefined ? false : args.isTill;
        const obj = new MotionMatch();
        obj.character = args.character;
        obj.direction = MotionMatchDirection.PREV;
        obj.isTill = args.isTill;
        return obj;
    }
    apply(from, option = {}) {
        option.isInclusive = option.isInclusive === undefined ? false : option.isInclusive;
        from = super.apply(from);
        const activeTextEditor = vscode_1.window.activeTextEditor;
        if (!activeTextEditor || this.direction === undefined || !this.character) {
            return from;
        }
        const document = activeTextEditor.document;
        let toLine = from.line;
        let toCharacter = from.character;
        let targetText = document.lineAt(toLine).text;
        if (this.direction === MotionMatchDirection.NEXT) {
            targetText = targetText.substr(toCharacter + 1);
            const offset = targetText.indexOf(this.character);
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
            const offset = targetText.indexOf(this.character);
            if (!!~offset) {
                toCharacter -= offset + 1;
                if (this.isTill) {
                    toCharacter += 1;
                }
            }
        }
        return new vscode_1.Position(toLine, toCharacter);
    }
}
exports.MotionMatch = MotionMatch;
//# sourceMappingURL=Match.js.map