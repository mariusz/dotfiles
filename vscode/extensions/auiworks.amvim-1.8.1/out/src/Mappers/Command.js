"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Generic_1 = require('./Generic');
var N_1 = require('./SpecialKeys/N');
var Char_1 = require('./SpecialKeys/Char');
var Motion_1 = require('./SpecialKeys/Motion');
var TextObject_1 = require('./SpecialKeys/TextObject');
var CommandMapper = (function (_super) {
    __extends(CommandMapper, _super);
    function CommandMapper() {
        _super.call(this, [
            new N_1.SpecialKeyN(),
            new Motion_1.SpecialKeyMotion(),
            new TextObject_1.SpecialKeyTextObject(),
            new Char_1.SpecialKeyChar(),
        ]);
    }
    CommandMapper.prototype.map = function (joinedKeys, actions, args) {
        var map = _super.prototype.map.call(this, joinedKeys, args);
        map.actions = actions;
    };
    CommandMapper.prototype.match = function (inputs) {
        var _a = _super.prototype.match.call(this, inputs), kind = _a.kind, map = _a.map;
        return {
            kind: kind,
            map: map ? map : null
        };
    };
    return CommandMapper;
}(Generic_1.GenericMapper));
exports.CommandMapper = CommandMapper;
//# sourceMappingURL=Command.js.map