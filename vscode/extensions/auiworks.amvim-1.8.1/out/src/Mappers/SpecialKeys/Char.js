"use strict";
var Generic_1 = require('../Generic');
var SpecialKeyChar = (function () {
    function SpecialKeyChar() {
        this.indicator = '{char}';
    }
    SpecialKeyChar.prototype.unmapConflicts = function (node, keyToMap) {
        delete node[this.indicator];
        if (keyToMap === this.indicator) {
            node = {};
        }
    };
    SpecialKeyChar.prototype.matchSpecial = function (inputs) {
        var character = inputs[0];
        if (character === 'space') {
            character = ' ';
        }
        return {
            specialKey: this,
            kind: Generic_1.MatchResultKind.FOUND,
            matchedCount: 1,
            additionalArgs: { character: character }
        };
    };
    return SpecialKeyChar;
}());
exports.SpecialKeyChar = SpecialKeyChar;
//# sourceMappingURL=Char.js.map