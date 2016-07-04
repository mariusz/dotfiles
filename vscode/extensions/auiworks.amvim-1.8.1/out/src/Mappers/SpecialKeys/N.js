"use strict";
var Generic_1 = require('../Generic');
var SpecialKeyN = (function () {
    function SpecialKeyN() {
        this.indicator = '{N}';
        this.conflictRegExp = /^[1-9]|\{motion\}|\{textObject\}|\{char\}$/;
    }
    SpecialKeyN.prototype.unmapConflicts = function (node, keyToMap) {
        var _this = this;
        if (keyToMap === this.indicator) {
            Object.getOwnPropertyNames(node).forEach(function (key) {
                _this.conflictRegExp.test(key) && delete node[key];
            });
        }
        if (this.conflictRegExp.test(keyToMap)) {
            delete node[this.indicator];
        }
    };
    SpecialKeyN.prototype.matchSpecial = function (inputs) {
        if (!/[1-9]/.test(inputs[0])) {
            return null;
        }
        var n = [inputs[0]];
        inputs.slice(1).every(function (input) {
            if (/[0-9]/.test(input)) {
                n.push(input);
                return true;
            }
            return false;
        });
        return {
            specialKey: this,
            kind: Generic_1.MatchResultKind.FOUND,
            matchedCount: n.length,
            additionalArgs: { n: parseInt(n.join(''), 10) }
        };
    };
    return SpecialKeyN;
}());
exports.SpecialKeyN = SpecialKeyN;
//# sourceMappingURL=N.js.map