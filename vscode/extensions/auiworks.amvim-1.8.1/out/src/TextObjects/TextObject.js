"use strict";
var vscode_1 = require('vscode');
var TextObject = (function () {
    function TextObject() {
    }
    /**
     * Override this to return start range of text object or null if not found.
     */
    TextObject.prototype.findStartRange = function (document, anchor) {
        throw new Error('findStartPosition is not implemented.');
    };
    /**
     * Override this to return end range of text object or null if not found.
     */
    TextObject.prototype.findEndRange = function (document, anchor) {
        throw new Error('findEndPosition is not implemented.');
    };
    TextObject.prototype.apply = function (anchor) {
        if (this.isInclusive === undefined) {
            throw new Error('isInclusive is not set.');
        }
        var activeTextEditor = vscode_1.window.activeTextEditor;
        if (!activeTextEditor) {
            return null;
        }
        var document = activeTextEditor.document;
        var startRange = this.findStartRange(document, anchor);
        if (startRange === null) {
            return null;
        }
        var endRange = this.findEndRange(document, anchor);
        if (endRange === null) {
            return null;
        }
        return this.isInclusive
            ? new vscode_1.Range(startRange.start, endRange.end)
            : new vscode_1.Range(startRange.end, endRange.start);
    };
    return TextObject;
}());
exports.TextObject = TextObject;
//# sourceMappingURL=TextObject.js.map