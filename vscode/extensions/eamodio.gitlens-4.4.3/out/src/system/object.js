'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const _isEqual = require('lodash.isequal');
var Objects;
(function (Objects) {
    function areEquivalent(first, second) {
        return _isEqual(first, second);
    }
    Objects.areEquivalent = areEquivalent;
    function* entries(o) {
        for (const key in o) {
            yield [key, o[key]];
        }
    }
    Objects.entries = entries;
    function flatten(o, prefix = '', stringify = false) {
        const flattened = Object.create(null);
        _flatten(flattened, prefix, o, stringify);
        return flattened;
    }
    Objects.flatten = flatten;
    function _flatten(flattened, key, value, stringify = false) {
        if (Object(value) !== value) {
            if (stringify) {
                if (value == null) {
                    flattened[key] = null;
                }
                else if (typeof value === 'string') {
                    flattened[key] = value;
                }
                else {
                    flattened[key] = JSON.stringify(value);
                }
            }
            else {
                flattened[key] = value;
            }
        }
        else if (Array.isArray(value)) {
            const len = value.length;
            for (let i = 0; i < len; i++) {
                _flatten(flattened, `${key}[${i}]`, value[i], stringify);
            }
            if (len === 0) {
                flattened[key] = null;
            }
        }
        else {
            let isEmpty = true;
            for (const p in value) {
                isEmpty = false;
                _flatten(flattened, key ? `${key}.${p}` : p, value[p], stringify);
            }
            if (isEmpty && key) {
                flattened[key] = null;
            }
        }
    }
    function* values(o) {
        for (const key in o) {
            yield o[key];
        }
    }
    Objects.values = values;
})(Objects = exports.Objects || (exports.Objects = {}));
//# sourceMappingURL=object.js.map