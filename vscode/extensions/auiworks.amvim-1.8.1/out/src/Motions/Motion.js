"use strict";
var vscode_1 = require('vscode');
var Position_1 = require('../Utils/Position');
var Motion = (function () {
    function Motion() {
        this.isCharacterUpdated = true;
        this.lineDelta = 0;
        this.characterDelta = 0;
    }
    Motion.prototype.translate = function (lineDelta, characterDelta) {
        this.lineDelta += lineDelta;
        this.characterDelta += characterDelta;
    };
    Motion.prototype.apply = function (from, option) {
        var activeTextEditor = vscode_1.window.activeTextEditor;
        if (!activeTextEditor) {
            return from;
        }
        var document = activeTextEditor.document;
        var toLine = from.line + this.lineDelta;
        var toCharacter = from.character + this.characterDelta;
        if (toLine < 0) {
            toLine = 0;
            toCharacter = 0;
        }
        else if (toLine > document.lineCount - 1) {
            toLine = document.lineCount - 1;
            toCharacter = Infinity;
        }
        if (toCharacter === Infinity) {
            toCharacter = document.lineAt(toLine).text.length;
        }
        if (from.line !== toLine) {
            var fromLineTabCount = document.getText(new vscode_1.Range(from.line, 0, from.line, from.character)).split("\t").length - 1;
            var tabSize = activeTextEditor.options.tabSize;
            var toVisibleColumn = toCharacter + fromLineTabCount * (tabSize - 1);
            var toLineText = document.lineAt(toLine).text;
            var lastVisibleColumn = -1;
            var thisVisibleColumn = 0;
            var i = void 0;
            for (i = 0; i < toLineText.length && thisVisibleColumn <= toVisibleColumn; i++) {
                lastVisibleColumn = thisVisibleColumn;
                thisVisibleColumn += (toLineText.charAt(i) === "\t") ? tabSize : 1;
            }
            // Choose the closest
            thisVisibleColumn = Math.abs(toVisibleColumn - thisVisibleColumn);
            lastVisibleColumn = Math.abs(toVisibleColumn - lastVisibleColumn);
            if (thisVisibleColumn < lastVisibleColumn) {
                toCharacter = i;
            }
            else {
                toCharacter = i - 1;
            }
        }
        toCharacter = Math.max(toCharacter, 0);
        return Position_1.UtilPosition.fitIntoDocument(activeTextEditor.document, new vscode_1.Position(toLine, toCharacter));
    };
    return Motion;
}());
exports.Motion = Motion;
//# sourceMappingURL=Motion.js.map