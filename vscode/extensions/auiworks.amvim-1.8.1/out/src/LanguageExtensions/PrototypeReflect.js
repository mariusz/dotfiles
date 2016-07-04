"use strict";
function isObject(x) {
    return typeof x === 'object' ? x !== null : typeof x === 'function';
}
function isUndefined(x) {
    return x === undefined;
}
function isConstructor(x) {
    return typeof x === 'function';
}
function isPrototypeExists(x) {
    return x !== null
        && x !== undefined
        && x.prototype !== null
        && x.prototype !== undefined;
}
/**
 * Prototype version of https://github.com/rbuckton/ReflectDecorators/ (Partial)
 * Save metadata in prototype so we can get it without context.
 */
var PrototypeReflect = (function () {
    function PrototypeReflect() {
    }
    /**
      * A default metadata decorator factory that can be used on a class, class member, or parameter.
      * @param metadataKey The key for the metadata entry.
      * @param metadataValue The value for the metadata entry.
      * @returns A decorator function.
      * @remarks
      * If `metadataKey` is already defined for the target and target key, the
      * metadataValue for that key will be overwritten.
      * @example
      *
      *     // constructor
      *     @PrototypeReflect.metadata(key, value)
      *     class C {
      *     }
      *
      *     // property (on constructor)
      *     class C {
      *         @PrototypeReflect.metadata(key, value)
      *         static staticProperty;
      *     }
      *
      *     // property (on prototype)
      *     class C {
      *         @PrototypeReflect.metadata(key, value)
      *         property;
      *     }
      *
      *     // method (on constructor)
      *     class C {
      *         @PrototypeReflect.metadata(key, value)
      *         static staticMethod() { }
      *     }
      *
      *     // method (on prototype)
      *     class C {
      *         @PrototypeReflect.metadata(key, value)
      *         method() { }
      *     }
      */
    PrototypeReflect.metadata = function (key, value) {
        function decorator(targetObject, targetKey) {
            if (!isUndefined(targetKey)) {
                if (!isObject(targetObject)) {
                    throw new TypeError();
                }
                PrototypeReflect.defineMetadata(key, value, targetObject[targetKey]);
            }
            else {
                if (!isConstructor(targetObject)) {
                    throw new TypeError();
                }
                PrototypeReflect.defineMetadata(key, value, targetObject);
            }
        }
        ;
        return decorator;
    };
    PrototypeReflect.defineMetadata = function (key, value, target) {
        if (!isPrototypeExists(target)) {
            throw new TypeError();
        }
        if (target.prototype[PrototypeReflect.metadataKey] === undefined) {
            target.prototype[PrototypeReflect.metadataKey] = {};
        }
        target.prototype[PrototypeReflect.metadataKey][key] = value;
    };
    PrototypeReflect.getMetadata = function (key, target) {
        if (!isPrototypeExists(target)) {
            return undefined;
        }
        return (target.prototype[PrototypeReflect.metadataKey] === undefined)
            ? undefined
            : target.prototype[PrototypeReflect.metadataKey][key];
    };
    PrototypeReflect.metadataKey = Symbol('ReflectMetadata');
    return PrototypeReflect;
}());
exports.PrototypeReflect = PrototypeReflect;
//# sourceMappingURL=PrototypeReflect.js.map