"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Generic_1 = require('../Generic');
var Block_1 = require('../../TextObjects/Block');
var QuotedString_1 = require('../../TextObjects/QuotedString');
var SpecialKeyTextObject = (function (_super) {
    __extends(SpecialKeyTextObject, _super);
    function SpecialKeyTextObject() {
        var _this = this;
        _super.call(this);
        this.indicator = '{textObject}';
        this.conflictRegExp = /^[1-9]|\{N\}|\{char\}$/;
        this.mapInfos = [
            {
                characters: ['b', '(', ')'],
                method: Block_1.TextObjectBlock.byParentheses,
            },
            {
                characters: ['[', ']'],
                method: Block_1.TextObjectBlock.byBrackets,
            },
            {
                characters: ['B', '{', '}'],
                method: Block_1.TextObjectBlock.byBraces,
            },
            {
                characters: ['<', '>'],
                method: Block_1.TextObjectBlock.byChevrons,
            },
            {
                characters: ['\''],
                method: QuotedString_1.TextObjectQuotedString.bySingle,
            },
            {
                characters: ['"'],
                method: QuotedString_1.TextObjectQuotedString.byDouble,
            },
            {
                characters: ['`'],
                method: QuotedString_1.TextObjectQuotedString.byBackward,
            },
        ];
        this.maps = [];
        this.mapInfos.forEach(function (mapInfo) {
            mapInfo.characters.forEach(function (character) {
                _this.map("a " + character, mapInfo.method, { isInclusive: true });
                _this.map("i " + character, mapInfo.method, { isInclusive: false });
            });
        });
        this.maps.forEach(function (map) {
            _this.map(map.keys, map.textObjectGenerator, map.args);
        });
    }
    SpecialKeyTextObject.prototype.map = function (joinedKeys, textObjectGenerator, args) {
        var map = _super.prototype.map.call(this, joinedKeys, args);
        map.textObjectGenerator = textObjectGenerator;
    };
    SpecialKeyTextObject.prototype.unmapConflicts = function (node, keyToMap) {
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
    SpecialKeyTextObject.prototype.matchSpecial = function (inputs) {
        var _a = this.match(inputs), kind = _a.kind, map = _a.map;
        if (kind === Generic_1.MatchResultKind.FAILED) {
            return null;
        }
        var additionalArgs = {};
        if (map) {
            additionalArgs.textObject = map.textObjectGenerator(map.args);
        }
        return {
            specialKey: this,
            kind: kind,
            matchedCount: inputs.length,
            additionalArgs: additionalArgs
        };
    };
    return SpecialKeyTextObject;
}(Generic_1.GenericMapper));
exports.SpecialKeyTextObject = SpecialKeyTextObject;
//# sourceMappingURL=TextObject.js.map