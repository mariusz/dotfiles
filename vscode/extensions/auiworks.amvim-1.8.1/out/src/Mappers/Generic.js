"use strict";
(function (MatchResultKind) {
    MatchResultKind[MatchResultKind["FAILED"] = 0] = "FAILED";
    MatchResultKind[MatchResultKind["WAITING"] = 1] = "WAITING";
    MatchResultKind[MatchResultKind["FOUND"] = 2] = "FOUND";
})(exports.MatchResultKind || (exports.MatchResultKind = {}));
var MatchResultKind = exports.MatchResultKind;
;
var GenericMapper = (function () {
    function GenericMapper(specialKeys) {
        if (specialKeys === void 0) { specialKeys = []; }
        this.root = {};
        this.specialKeys = specialKeys;
    }
    GenericMapper.isMapLeaf = function (node) {
        return node && typeof node.keys === 'string';
    };
    GenericMapper.prototype.map = function (joinedKeys, args) {
        var _this = this;
        var map = {
            keys: joinedKeys,
            args: args || undefined,
        };
        var node = this.root;
        var keys = joinedKeys.split(GenericMapper.separator);
        keys.forEach(function (key, index) {
            _this.specialKeys.forEach(function (specialKey) {
                specialKey.unmapConflicts(node, key);
            });
            if (GenericMapper.isMapLeaf(node[key])) {
                delete node[key];
            }
            if (index === keys.length - 1) {
                node[key] = map;
            }
            else {
                node[key] = node[key] || {};
                node = node[key];
            }
        });
        return map;
    };
    GenericMapper.prototype.match = function (inputs) {
        var node = this.root;
        var matched = true;
        var additionalArgs = {};
        var _loop_1 = function(index) {
            var input = inputs[index];
            if (node[input]) {
                node = node[input];
                return out_index_1 = index, "continue";
            }
            var match;
            this_1.specialKeys.some(function (specialKey) {
                if (!node[specialKey.indicator]) {
                    return false;
                }
                match = specialKey.matchSpecial(inputs.slice(index));
                return match ? true : false;
            });
            if (match) {
                if (match.kind === MatchResultKind.FOUND) {
                    node = node[match.specialKey.indicator];
                    Object.getOwnPropertyNames(match.additionalArgs).forEach(function (key) {
                        additionalArgs[key] = match.additionalArgs[key];
                    });
                    index += match.matchedCount - 1;
                    return out_index_1 = index, "continue";
                }
                else if (match.kind === MatchResultKind.WAITING) {
                    return out_index_1 = index, "break";
                }
            }
            matched = false;
            return out_index_1 = index, "break";
            out_index_1 = index;
        };
        var out_index_1;
        var this_1 = this;
        for (var index = 0; index < inputs.length; index++) {
            var state_1 = _loop_1(index);
            index = out_index_1;
            if (state_1 === "break") break;
            if (state_1 === "continue") continue;
        }
        if (!matched) {
            return { kind: MatchResultKind.FAILED };
        }
        else if (GenericMapper.isMapLeaf(node)) {
            var map_1 = node;
            Object.getOwnPropertyNames(additionalArgs).forEach(function (name) {
                map_1.args = map_1.args || {};
                map_1.args[name] = additionalArgs[name];
            });
            return { kind: MatchResultKind.FOUND, map: map_1 };
        }
        else {
            return { kind: MatchResultKind.WAITING };
        }
    };
    GenericMapper.separator = ' ';
    return GenericMapper;
}());
exports.GenericMapper = GenericMapper;
//# sourceMappingURL=Generic.js.map