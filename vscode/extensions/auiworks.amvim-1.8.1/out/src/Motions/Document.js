"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var vscode_1 = require('vscode');
var Motion_1 = require('./Motion');
var MotionDocument = (function (_super) {
    __extends(MotionDocument, _super);
    function MotionDocument() {
        _super.apply(this, arguments);
    }
    MotionDocument.toLine = function (args) {
        var obj = new MotionDocument();
        obj.line = args.n - 1;
        return obj;
    };
    MotionDocument.prototype.apply = function (from) {
        from = _super.prototype.apply.call(this, from);
        var activeTextEditor = vscode_1.window.activeTextEditor;
        if (!activeTextEditor || this.line === undefined) {
            return from;
        }
        var document = activeTextEditor.document;
        var line = this.line;
        line = Math.max(0, this.line);
        line = Math.min(document.lineCount, this.line);
        return from.with(line);
    };
    return MotionDocument;
}(Motion_1.Motion));
exports.MotionDocument = MotionDocument;
//# sourceMappingURL=Document.js.map