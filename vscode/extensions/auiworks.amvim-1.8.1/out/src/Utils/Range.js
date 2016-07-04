"use strict";
var vscode_1 = require('vscode');
var Position_1 = require('./Position');
var UtilRange = (function () {
    function UtilRange() {
    }
    UtilRange.unionOverlaps = function (from) {
        var to = [];
        while (from.length !== 0) {
            var a = from.shift();
            for (var i = 0; i < from.length; i++) {
                var b = from[i];
                if (a.intersection(b) !== undefined) {
                    a = a.union(b);
                    from.splice(i, 1);
                    i--;
                }
            }
            to.push(a);
        }
        return to;
    };
    UtilRange.toLinewise = function (from) {
        return new vscode_1.Range(from.start.line, 0, from.end.line + 1, 0);
    };
    UtilRange.fitIntoDocument = function (document, from) {
        return new vscode_1.Range(Position_1.UtilPosition.fitIntoDocument(document, from.start), Position_1.UtilPosition.fitIntoDocument(document, from.end));
    };
    return UtilRange;
}());
exports.UtilRange = UtilRange;
//# sourceMappingURL=Range.js.map