"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var vscode_1 = require('vscode');
var Motion_1 = require('./Motion');
var MotionWordDirection;
(function (MotionWordDirection) {
    MotionWordDirection[MotionWordDirection["Previous"] = 0] = "Previous";
    MotionWordDirection[MotionWordDirection["Next"] = 1] = "Next";
})(MotionWordDirection || (MotionWordDirection = {}));
;
var MotionWordMatchKind;
(function (MotionWordMatchKind) {
    MotionWordMatchKind[MotionWordMatchKind["Start"] = 0] = "Start";
    MotionWordMatchKind[MotionWordMatchKind["End"] = 1] = "End";
    MotionWordMatchKind[MotionWordMatchKind["Both"] = 2] = "Both";
})(MotionWordMatchKind || (MotionWordMatchKind = {}));
;
var MotionWordCharacterKind;
(function (MotionWordCharacterKind) {
    MotionWordCharacterKind[MotionWordCharacterKind["Regular"] = 0] = "Regular";
    MotionWordCharacterKind[MotionWordCharacterKind["Separator"] = 1] = "Separator";
    MotionWordCharacterKind[MotionWordCharacterKind["Blank"] = 2] = "Blank";
})(MotionWordCharacterKind || (MotionWordCharacterKind = {}));
var MotionWord = (function (_super) {
    __extends(MotionWord, _super);
    function MotionWord(args) {
        if (args === void 0) { args = {}; }
        _super.call(this);
        args = Object.assign({ useBlankSeparatedStyle: false }, args);
        this.useBlankSeparatedStyle = args.useBlankSeparatedStyle;
    }
    MotionWord.updateCharacterKindCache = function (wordSeparators) {
        this.characterKindCache = {};
        for (var i = 0; i < this.blankSeparators.length; i++) {
            this.characterKindCache[this.blankSeparators.charCodeAt(i)] = MotionWordCharacterKind.Blank;
        }
        for (var i = 0, len = wordSeparators.length; i < len; i++) {
            this.characterKindCache[wordSeparators.charCodeAt(i)] = MotionWordCharacterKind.Separator;
        }
    };
    MotionWord.nextStart = function (args) {
        if (args === void 0) { args = {}; }
        var obj = new MotionWord(args);
        obj.direction = MotionWordDirection.Next;
        obj.matchKind = MotionWordMatchKind.Start;
        return obj;
    };
    MotionWord.nextEnd = function (args) {
        if (args === void 0) { args = {}; }
        var obj = new MotionWord(args);
        obj.direction = MotionWordDirection.Next;
        obj.matchKind = MotionWordMatchKind.End;
        return obj;
    };
    MotionWord.prevStart = function (args) {
        if (args === void 0) { args = {}; }
        var obj = new MotionWord(args);
        obj.direction = MotionWordDirection.Previous;
        obj.matchKind = MotionWordMatchKind.Start;
        return obj;
    };
    MotionWord.prevEnd = function (args) {
        if (args === void 0) { args = {}; }
        var obj = new MotionWord(args);
        obj.direction = MotionWordDirection.Previous;
        obj.matchKind = MotionWordMatchKind.End;
        return obj;
    };
    MotionWord.prototype.getCharacterKind = function (charCode, useBlankSeparatedStyle) {
        var characterKind = MotionWord.characterKindCache[charCode];
        if (characterKind === undefined) {
            characterKind = MotionWordCharacterKind.Regular;
        }
        if (useBlankSeparatedStyle) {
            // Treat separator as regular character.
            if (characterKind === MotionWordCharacterKind.Separator) {
                characterKind = MotionWordCharacterKind.Regular;
            }
        }
        return characterKind;
    };
    MotionWord.prototype.apply = function (from, option) {
        if (option === void 0) { option = {}; }
        option.isInclusive = option.isInclusive === undefined ? false : option.isInclusive;
        option.isChangeAction = option.isChangeAction === undefined ? false : option.isChangeAction;
        // Match both start and end if used in change action.
        if (option.isChangeAction && this.matchKind === MotionWordMatchKind.Start) {
            this.matchKind = MotionWordMatchKind.Both;
        }
        from = _super.prototype.apply.call(this, from);
        var activeTextEditor = vscode_1.window.activeTextEditor;
        if (!activeTextEditor) {
            return from;
        }
        var document = activeTextEditor.document;
        var line = from.line;
        var previousPosition = null;
        var previousCharacterKind = null;
        if (this.direction === MotionWordDirection.Next) {
            while (line < document.lineCount) {
                var text = document.lineAt(line).text + '\n';
                var character = line === from.line ? from.character : 0;
                while (character < text.length) {
                    var currentCharacterKind = this.getCharacterKind(text.charCodeAt(character), this.useBlankSeparatedStyle);
                    if (previousCharacterKind !== null && previousCharacterKind !== currentCharacterKind) {
                        var startPosition = void 0;
                        var endPosition = void 0;
                        if (currentCharacterKind !== MotionWordCharacterKind.Blank) {
                            startPosition = new vscode_1.Position(line, character);
                        }
                        if (previousCharacterKind !== MotionWordCharacterKind.Blank) {
                            endPosition = previousPosition;
                            if (endPosition.isEqual(from)) {
                                endPosition = undefined;
                            }
                            else {
                                if (option.isInclusive) {
                                    endPosition = endPosition.translate(0, +1);
                                }
                            }
                        }
                        if (this.matchKind === MotionWordMatchKind.Start) {
                            if (startPosition !== undefined) {
                                return startPosition;
                            }
                        }
                        else if (this.matchKind === MotionWordMatchKind.End) {
                            if (endPosition !== undefined) {
                                return endPosition;
                            }
                        }
                        else if (this.matchKind === MotionWordMatchKind.Both) {
                            if (endPosition !== undefined) {
                                return endPosition;
                            }
                            else if (startPosition !== undefined) {
                                return startPosition;
                            }
                        }
                    }
                    previousPosition = new vscode_1.Position(line, character);
                    previousCharacterKind = currentCharacterKind;
                    character++;
                }
                line++;
            }
            // Return end position if matching failed.
            return document.lineAt(document.lineCount - 1).range.end;
        }
        else if (this.direction === MotionWordDirection.Previous) {
            while (line >= 0) {
                var text = document.lineAt(line).text + '\n';
                var character = line === from.line ? from.character : text.length - 1;
                while (character >= 0) {
                    var currentCharacterKind = this.getCharacterKind(text.charCodeAt(character), this.useBlankSeparatedStyle);
                    if (previousCharacterKind !== null && previousCharacterKind !== currentCharacterKind) {
                        var startPosition = void 0;
                        var endPosition = void 0;
                        if (previousCharacterKind !== MotionWordCharacterKind.Blank) {
                            startPosition = previousPosition;
                            if (startPosition.isEqual(from)) {
                                startPosition = undefined;
                            }
                        }
                        if (currentCharacterKind !== MotionWordCharacterKind.Blank) {
                            endPosition = new vscode_1.Position(line, character);
                        }
                        if (this.matchKind === MotionWordMatchKind.Start) {
                            if (startPosition !== undefined) {
                                return startPosition;
                            }
                        }
                        else if (this.matchKind === MotionWordMatchKind.End) {
                            if (endPosition !== undefined) {
                                return endPosition;
                            }
                        }
                        else if (this.matchKind === MotionWordMatchKind.Both) {
                            if (endPosition !== undefined) {
                                return endPosition;
                            }
                            else if (startPosition !== undefined) {
                                return startPosition;
                            }
                        }
                    }
                    previousPosition = new vscode_1.Position(line, character);
                    previousCharacterKind = currentCharacterKind;
                    character--;
                }
                line--;
            }
            // Return start position if matching failed.
            return new vscode_1.Position(0, 0);
        }
        else {
            throw new Error("Direction is invalid: " + this.direction);
        }
    };
    MotionWord.blankSeparators = ' \f\n\r\t\v​\u00a0\u1680​\u180e\u2000​\u2001​\u2002​\u2003​\u2004\u2005​\u2006​\u2007​\u2008\u2009​\u200a​\u2028\u2029\u202f\u205f​\u3000\ufeff';
    return MotionWord;
}(Motion_1.Motion));
exports.MotionWord = MotionWord;
//# sourceMappingURL=Word.js.map