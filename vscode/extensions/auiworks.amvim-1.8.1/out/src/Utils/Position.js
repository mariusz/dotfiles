"use strict";
var vscode_1 = require('vscode');
var UtilPosition = (function () {
    function UtilPosition() {
    }
    // The official TextDocument.validatePosition is buggy (https://github.com/Microsoft/vscode/issues/5704).
    UtilPosition.fitIntoDocument = function (document, from) {
        var lineCount = document.lineCount;
        var line = from.line, character = from.character;
        var maxLine = document.lineCount - 1;
        if (line < 0) {
            line = 0;
            character = 0;
        }
        else if (line > maxLine) {
            line = maxLine;
            character = Infinity;
        }
        var maxCharacter = document.lineAt(line).text.length;
        if (character < 0) {
            character = 0;
        }
        else if (character > maxCharacter) {
            character = maxCharacter;
        }
        return new vscode_1.Position(line, character);
    };
    return UtilPosition;
}());
exports.UtilPosition = UtilPosition;
//# sourceMappingURL=Position.js.map