"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Generic_1 = require('../Generic');
var N_1 = require('./N');
var Char_1 = require('./Char');
var Character_1 = require('../../Motions/Character');
var Word_1 = require('../../Motions/Word');
var Match_1 = require('../../Motions/Match');
var MatchPair_1 = require('../../Motions/MatchPair');
var Line_1 = require('../../Motions/Line');
var Document_1 = require('../../Motions/Document');
var SpecialKeyMotion = (function (_super) {
    __extends(SpecialKeyMotion, _super);
    function SpecialKeyMotion() {
        var _this = this;
        _super.call(this, [
            new N_1.SpecialKeyN(),
            new Char_1.SpecialKeyChar(),
        ]);
        this.indicator = '{motion}';
        this.conflictRegExp = /^[1-9]|\{N\}|\{char\}$/;
        this.maps = [
            { keys: 'h', motionGenerators: [Character_1.MotionCharacter.left] },
            { keys: '{N} h', motionGenerators: [Character_1.MotionCharacter.left] },
            { keys: 'left', motionGenerators: [Character_1.MotionCharacter.left] },
            { keys: '{N} left', motionGenerators: [Character_1.MotionCharacter.left] },
            { keys: 'l', motionGenerators: [Character_1.MotionCharacter.right] },
            { keys: '{N} l', motionGenerators: [Character_1.MotionCharacter.right] },
            { keys: 'right', motionGenerators: [Character_1.MotionCharacter.right] },
            { keys: '{N} right', motionGenerators: [Character_1.MotionCharacter.right] },
            { keys: 'k', motionGenerators: [Character_1.MotionCharacter.up] },
            { keys: '{N} k', motionGenerators: [Character_1.MotionCharacter.up] },
            { keys: 'up', motionGenerators: [Character_1.MotionCharacter.up] },
            { keys: '{N} up', motionGenerators: [Character_1.MotionCharacter.up] },
            { keys: 'j', motionGenerators: [Character_1.MotionCharacter.down] },
            { keys: '{N} j', motionGenerators: [Character_1.MotionCharacter.down] },
            { keys: 'down', motionGenerators: [Character_1.MotionCharacter.down] },
            { keys: '{N} down', motionGenerators: [Character_1.MotionCharacter.down] },
            { keys: 'w', motionGenerators: [Word_1.MotionWord.nextStart] },
            { keys: 'W', motionGenerators: [Word_1.MotionWord.nextStart], args: { useBlankSeparatedStyle: true } },
            { keys: 'e', motionGenerators: [Word_1.MotionWord.nextEnd] },
            { keys: 'E', motionGenerators: [Word_1.MotionWord.nextEnd], args: { useBlankSeparatedStyle: true } },
            { keys: 'b', motionGenerators: [Word_1.MotionWord.prevStart] },
            { keys: 'B', motionGenerators: [Word_1.MotionWord.prevStart], args: { useBlankSeparatedStyle: true } },
            { keys: 'f {char}', motionGenerators: [Match_1.MotionMatch.next] },
            { keys: 'F {char}', motionGenerators: [Match_1.MotionMatch.prev] },
            { keys: 't {char}', motionGenerators: [Match_1.MotionMatch.next], args: { isTill: true } },
            { keys: 'T {char}', motionGenerators: [Match_1.MotionMatch.prev], args: { isTill: true } },
            { keys: '%', motionGenerators: [MatchPair_1.MotionMatchPair.matchPair] },
            { keys: '^', motionGenerators: [Line_1.MotionLine.firstNonBlank] },
            { keys: '0', motionGenerators: [Line_1.MotionLine.start] },
            { keys: '$', motionGenerators: [Line_1.MotionLine.end] },
            { keys: '-', motionGenerators: [Character_1.MotionCharacter.up, Line_1.MotionLine.firstNonBlank] },
            { keys: '{N} -', motionGenerators: [Character_1.MotionCharacter.up, Line_1.MotionLine.firstNonBlank] },
            { keys: '+', motionGenerators: [Character_1.MotionCharacter.down, Line_1.MotionLine.firstNonBlank] },
            { keys: '{N} +', motionGenerators: [Character_1.MotionCharacter.down, Line_1.MotionLine.firstNonBlank] },
            { keys: 'g g', motionGenerators: [Document_1.MotionDocument.toLine, Line_1.MotionLine.firstNonBlank], args: { n: 1 } },
            { keys: '{N} g g', motionGenerators: [Document_1.MotionDocument.toLine, Line_1.MotionLine.firstNonBlank] },
            { keys: 'G', motionGenerators: [Document_1.MotionDocument.toLine, Line_1.MotionLine.firstNonBlank], args: { n: +Infinity } },
            { keys: '{N} G', motionGenerators: [Document_1.MotionDocument.toLine, Line_1.MotionLine.firstNonBlank] },
        ];
        this.maps.forEach(function (map) {
            _this.map(map.keys, map.motionGenerators, map.args);
        });
    }
    SpecialKeyMotion.prototype.map = function (joinedKeys, motionGenerators, args) {
        var map = _super.prototype.map.call(this, joinedKeys, args);
        map.motionGenerators = motionGenerators;
    };
    SpecialKeyMotion.prototype.unmapConflicts = function (node, keyToMap) {
        var _this = this;
        if (keyToMap === this.indicator) {
            Object.getOwnPropertyNames(node).forEach(function (key) {
                _this.conflictRegExp.test(key) && delete node[key];
            });
        }
        if (this.conflictRegExp.test(keyToMap)) {
            delete node[this.indicator];
        }
        // This class has lower priority than other keys.
    };
    SpecialKeyMotion.prototype.matchSpecial = function (inputs) {
        var _a = this.match(inputs), kind = _a.kind, map = _a.map;
        if (kind === Generic_1.MatchResultKind.FAILED) {
            return null;
        }
        var additionalArgs = {};
        if (map) {
            additionalArgs.motions = map.motionGenerators.map(function (generator) { return generator(map.args); });
        }
        return {
            specialKey: this,
            kind: kind,
            matchedCount: inputs.length,
            additionalArgs: additionalArgs
        };
    };
    return SpecialKeyMotion;
}(Generic_1.GenericMapper));
exports.SpecialKeyMotion = SpecialKeyMotion;
//# sourceMappingURL=Motion.js.map