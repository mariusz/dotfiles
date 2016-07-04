"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var vscode_1 = require('vscode');
var Motion_1 = require('./Motion');
var Block_1 = require('../TextObjects/Block');
var MotionMatchPair = (function (_super) {
    __extends(MotionMatchPair, _super);
    function MotionMatchPair() {
        _super.apply(this, arguments);
    }
    MotionMatchPair.matchPair = function () {
        return new MotionMatchPair();
    };
    MotionMatchPair.prototype.apply = function (from, option) {
        from = _super.prototype.apply.call(this, from);
        var activeTextEditor = vscode_1.window.activeTextEditor;
        if (!activeTextEditor) {
            return from;
        }
        var document = activeTextEditor.document;
        var targetText = document.lineAt(from.line).text;
        for (var character = from.character; character < targetText.length; character++) {
            var currentCharacterString = targetText[character];
            if (MotionMatchPair.matchCharacters.indexOf(currentCharacterString) < 0) {
                continue;
            }
            var textObject = MotionMatchPair.characterMap[currentCharacterString]({});
            if (MotionMatchPair.openingCharacters.indexOf(currentCharacterString) < 0) {
                var startRange = textObject.findStartRange(document, new vscode_1.Position(from.line, character));
                if (startRange !== null) {
                    return startRange.start;
                }
            }
            else {
                var endRange = textObject.findEndRange(document, new vscode_1.Position(from.line, character));
                if (endRange !== null) {
                    return endRange.start;
                }
            }
            return from;
        }
    };
    // TODO: C-style comments (/* */) and C preprocessor conditionals are not supported for now
    MotionMatchPair.openingCharacterMap = {
        '(': Block_1.TextObjectBlock.byParentheses,
        '{': Block_1.TextObjectBlock.byBraces,
        '[': Block_1.TextObjectBlock.byBrackets,
    };
    MotionMatchPair.openingCharacters = Object.keys(MotionMatchPair.openingCharacterMap);
    MotionMatchPair.closingCharacterMap = {
        ')': Block_1.TextObjectBlock.byParentheses,
        '}': Block_1.TextObjectBlock.byBraces,
        ']': Block_1.TextObjectBlock.byBrackets,
    };
    MotionMatchPair.characterMap = Object.assign({}, MotionMatchPair.openingCharacterMap, MotionMatchPair.closingCharacterMap);
    MotionMatchPair.matchCharacters = Object.keys(MotionMatchPair.characterMap);
    return MotionMatchPair;
}(Motion_1.Motion));
exports.MotionMatchPair = MotionMatchPair;
//# sourceMappingURL=MatchPair.js.map