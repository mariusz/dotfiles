"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var vscode_1 = require('vscode');
var TextObject_1 = require('./TextObject');
var TextObjectQuotedString = (function (_super) {
    __extends(TextObjectQuotedString, _super);
    function TextObjectQuotedString() {
        _super.apply(this, arguments);
    }
    TextObjectQuotedString.bySingle = function (args) {
        var obj = new TextObjectQuotedString();
        obj.isInclusive = args.isInclusive;
        obj.quoteCharacter = '\'';
        return obj;
    };
    TextObjectQuotedString.byDouble = function (args) {
        var obj = new TextObjectQuotedString();
        obj.isInclusive = args.isInclusive;
        obj.quoteCharacter = '"';
        return obj;
    };
    TextObjectQuotedString.byBackward = function (args) {
        var obj = new TextObjectQuotedString();
        obj.isInclusive = args.isInclusive;
        obj.quoteCharacter = '`';
        return obj;
    };
    TextObjectQuotedString.prototype.findStartRange = function (document, anchor) {
        var lineIndex = anchor.line;
        var lineText = document.lineAt(lineIndex).text;
        var characterIndex = anchor.character - 1;
        while (characterIndex >= 0) {
            var characterEscaped = lineText[characterIndex - 1] === TextObjectQuotedString.escapeCharacter;
            if (lineText[characterIndex] === this.quoteCharacter && !characterEscaped) {
                this.adjustedAnchor = new vscode_1.Position(lineIndex, anchor.character);
                return new vscode_1.Range(lineIndex, characterIndex, lineIndex, characterIndex + 1);
            }
            characterIndex--;
        }
        characterIndex = anchor.character;
        while (characterIndex < lineText.length) {
            var characterEscaped = lineText[characterIndex - 1] === TextObjectQuotedString.escapeCharacter;
            if (lineText[characterIndex] === this.quoteCharacter && !characterEscaped) {
                this.adjustedAnchor = new vscode_1.Position(lineIndex, characterIndex + 1);
                return new vscode_1.Range(lineIndex, characterIndex, lineIndex, characterIndex + 1);
            }
            characterIndex++;
        }
        return null;
    };
    TextObjectQuotedString.prototype.findEndRange = function (document, anchor) {
        if (this.adjustedAnchor !== undefined) {
            anchor = this.adjustedAnchor;
        }
        var lineIndex = anchor.line;
        var lineText = document.lineAt(lineIndex).text;
        var characterIndex = anchor.character;
        while (characterIndex < lineText.length) {
            var characterEscaped = lineText[characterIndex - 1] === TextObjectQuotedString.escapeCharacter;
            if (lineText[characterIndex] === this.quoteCharacter && !characterEscaped) {
                return new vscode_1.Range(lineIndex, characterIndex, lineIndex, characterIndex + 1);
            }
            characterIndex++;
        }
        return null;
    };
    TextObjectQuotedString.escapeCharacter = '\\';
    return TextObjectQuotedString;
}(TextObject_1.TextObject));
exports.TextObjectQuotedString = TextObjectQuotedString;
//# sourceMappingURL=QuotedString.js.map