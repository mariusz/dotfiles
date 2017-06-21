'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var Arrays;
(function (Arrays) {
    function uniqueBy(array, accessor, predicate) {
        const uniqueValues = Object.create(null);
        return array.filter(_ => {
            const value = accessor(_);
            if (uniqueValues[value])
                return false;
            uniqueValues[value] = accessor;
            return predicate ? predicate(_) : true;
        });
    }
    Arrays.uniqueBy = uniqueBy;
})(Arrays = exports.Arrays || (exports.Arrays = {}));
//# sourceMappingURL=array.js.map