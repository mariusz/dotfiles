"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Motion_1 = require('./Motion');
var MotionCharacter = (function (_super) {
    __extends(MotionCharacter, _super);
    function MotionCharacter() {
        _super.apply(this, arguments);
    }
    MotionCharacter.left = function (args) {
        if (args === void 0) { args = {}; }
        args.n = args.n === undefined ? 1 : args.n;
        var obj = new MotionCharacter();
        obj.translate(0, -args.n);
        return obj;
    };
    MotionCharacter.right = function (args) {
        if (args === void 0) { args = {}; }
        args.n = args.n === undefined ? 1 : args.n;
        var obj = new MotionCharacter();
        obj.translate(0, +args.n);
        return obj;
    };
    MotionCharacter.up = function (args) {
        if (args === void 0) { args = {}; }
        args.n = args.n === undefined ? 1 : args.n;
        var obj = new MotionCharacter();
        obj.translate(-args.n, 0);
        obj.isCharacterUpdated = false;
        return obj;
    };
    MotionCharacter.down = function (args) {
        if (args === void 0) { args = {}; }
        args.n = args.n === undefined ? 1 : args.n;
        var obj = new MotionCharacter();
        obj.translate(+args.n, 0);
        obj.isCharacterUpdated = false;
        return obj;
    };
    MotionCharacter.prototype.apply = function (from, option) {
        if (option === void 0) { option = {}; }
        if (!this.isCharacterUpdated && option.preferedCharacter !== undefined) {
            from = from.with(undefined, option.preferedCharacter);
        }
        return _super.prototype.apply.call(this, from);
    };
    return MotionCharacter;
}(Motion_1.Motion));
exports.MotionCharacter = MotionCharacter;
//# sourceMappingURL=Character.js.map