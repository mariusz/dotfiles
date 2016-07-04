"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var vscode_1 = require('vscode');
var TextObject_1 = require('./TextObject');
var TextObjectBlock = (function (_super) {
    __extends(TextObjectBlock, _super);
    function TextObjectBlock() {
        _super.apply(this, arguments);
    }
    TextObjectBlock.byParentheses = function (args) {
        var obj = new TextObjectBlock();
        obj.isInclusive = args.isInclusive;
        obj.openingCharacter = '(';
        obj.closingCharacter = ')';
        return obj;
    };
    TextObjectBlock.byBrackets = function (args) {
        var obj = new TextObjectBlock();
        obj.isInclusive = args.isInclusive;
        obj.openingCharacter = '[';
        obj.closingCharacter = ']';
        return obj;
    };
    TextObjectBlock.byBraces = function (args) {
        var obj = new TextObjectBlock();
        obj.isInclusive = args.isInclusive;
        obj.openingCharacter = '{';
        obj.closingCharacter = '}';
        return obj;
    };
    TextObjectBlock.byChevrons = function (args) {
        var obj = new TextObjectBlock();
        obj.isInclusive = args.isInclusive;
        obj.openingCharacter = '<';
        obj.closingCharacter = '>';
        return obj;
    };
    TextObjectBlock.prototype.findStartRange = function (document, anchor) {
        var matchingCount = 0;
        var lineIndex = anchor.line;
        do {
            var lineText = document.lineAt(lineIndex).text;
            var characterIndex = lineIndex === anchor.line ? anchor.character : lineText.length - 1;
            while (characterIndex >= 0) {
                if (lineText[characterIndex] === this.closingCharacter) {
                    // Don't count closing character on anchor.
                    if (!anchor.isEqual(new vscode_1.Position(lineIndex, characterIndex))) {
                        matchingCount++;
                    }
                }
                else if (lineText[characterIndex] === this.openingCharacter) {
                    if (matchingCount === 0) {
                        return new vscode_1.Range(lineIndex, characterIndex, lineIndex, characterIndex + 1);
                    }
                    else {
                        matchingCount--;
                    }
                }
                characterIndex--;
            }
            lineIndex--;
        } while (lineIndex >= 0);
        return null;
    };
    TextObjectBlock.prototype.findEndRange = function (document, anchor) {
        var matchingCount = 0;
        var lineIndex = anchor.line;
        do {
            var lineText = document.lineAt(lineIndex).text;
            var characterIndex = lineIndex === anchor.line ? anchor.character : 0;
            while (characterIndex < lineText.length) {
                if (lineText[characterIndex] === this.openingCharacter) {
                    // Don't count opening character on anchor.
                    if (!anchor.isEqual(new vscode_1.Position(lineIndex, characterIndex))) {
                        matchingCount++;
                    }
                }
                else if (lineText[characterIndex] === this.closingCharacter) {
                    if (matchingCount === 0) {
                        return new vscode_1.Range(lineIndex, characterIndex, lineIndex, characterIndex + 1);
                    }
                    else {
                        matchingCount--;
                    }
                }
                characterIndex++;
            }
            lineIndex++;
        } while (lineIndex < document.lineCount);
        return null;
    };
    return TextObjectBlock;
}(TextObject_1.TextObject));
exports.TextObjectBlock = TextObjectBlock;
//# sourceMappingURL=Block.js.map