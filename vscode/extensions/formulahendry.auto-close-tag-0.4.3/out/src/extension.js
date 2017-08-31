'use strict';
var vscode = require('vscode');
function activate(context) {
    vscode.workspace.onDidChangeTextDocument(function (event) {
        insertAutoCloseTag(event);
    });
    var closeTag = vscode.commands.registerCommand('auto-close-tag.closeTag', function () {
        insertCloseTag();
    });
    context.subscriptions.push(closeTag);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
function insertAutoCloseTag(event) {
    if (!event.contentChanges[0]) {
        return;
    }
    var isRightAngleBracket = CheckRightAngleBracket(event.contentChanges[0]);
    if (!isRightAngleBracket && event.contentChanges[0].text !== "/") {
        return;
    }
    var config = vscode.workspace.getConfiguration('auto-close-tag');
    if (!config.get("enableAutoCloseTag", true)) {
        return;
    }
    var editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }
    var languageId = editor.document.languageId;
    var languages = config.get("activationOnLanguage", ["*"]);
    if (languages.indexOf("*") === -1 && languages.indexOf(languageId) === -1) {
        return;
    }
    var selection = editor.selection;
    var originalPosition = selection.start.translate(0, 1);
    var excludedTags = config.get("excludedTags", []);
    var isSublimeText3Mode = config.get("SublimeText3Mode", false);
    var enableAutoCloseSelfClosingTag = config.get("enableAutoCloseSelfClosingTag", true);
    var isFullMode = config.get("fullMode");
    if ((isSublimeText3Mode || isFullMode) && event.contentChanges[0].text === "/") {
        var text = editor.document.getText(new vscode.Range(new vscode.Position(0, 0), originalPosition));
        var last2chars = "";
        if (text.length > 2) {
            last2chars = text.substr(text.length - 2);
        }
        if (last2chars === "</") {
            var closeTag_1 = getCloseTag(text, excludedTags);
            if (closeTag_1) {
                var nextChar_1 = getNextChar(editor, originalPosition);
                if (nextChar_1 === ">") {
                    closeTag_1 = closeTag_1.substr(0, closeTag_1.length - 1);
                }
                editor.edit(function (editBuilder) {
                    editBuilder.insert(originalPosition, closeTag_1);
                }).then(function () {
                    if (nextChar_1 === ">") {
                        editor.selection = moveSelectionRight(editor.selection, 1);
                    }
                });
            }
        }
    }
    if (((!isSublimeText3Mode || isFullMode) && isRightAngleBracket) ||
        (enableAutoCloseSelfClosingTag && event.contentChanges[0].text === "/")) {
        var textLine = editor.document.lineAt(selection.start);
        var text = textLine.text.substring(0, selection.start.character + 1);
        var result_1 = /<([a-zA-Z][a-zA-Z0-9:\-_.]*)(?:\s+[^<>]*?[^\s/<>=]+?)*?(\s?\/|>)$/.exec(text);
        if (result_1 !== null && ((occurrenceCount(result_1[0], "'") % 2 === 0)
            && (occurrenceCount(result_1[0], "\"") % 2 === 0) && (occurrenceCount(result_1[0], "`") % 2 === 0))) {
            if (result_1[2] === ">") {
                if (excludedTags.indexOf(result_1[1]) === -1) {
                    editor.edit(function (editBuilder) {
                        editBuilder.insert(originalPosition, "</" + result_1[1] + ">");
                    }).then(function () {
                        editor.selection = new vscode.Selection(originalPosition, originalPosition);
                    });
                }
            }
            else {
                editor.edit(function (editBuilder) {
                    editBuilder.insert(originalPosition, ">");
                });
            }
        }
    }
}
function CheckRightAngleBracket(contentChange) {
    return contentChange.text === ">" || CheckRightAngleBracketInVSCode_1_8(contentChange);
}
function CheckRightAngleBracketInVSCode_1_8(contentChange) {
    return contentChange.text.endsWith(">") && contentChange.range.start.character === 0
        && contentChange.range.start.line === contentChange.range.end.line
        && !contentChange.range.end.isEqual(new vscode.Position(0, 0));
}
function insertCloseTag() {
    var editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }
    var selection = editor.selection;
    var originalPosition = selection.start;
    var config = vscode.workspace.getConfiguration('auto-close-tag');
    var excludedTags = config.get("excludedTags", []);
    var text = editor.document.getText(new vscode.Range(new vscode.Position(0, 0), originalPosition));
    if (text.length > 2) {
        var closeTag_2 = getCloseTag(text, excludedTags);
        if (closeTag_2) {
            editor.edit(function (editBuilder) {
                editBuilder.insert(originalPosition, closeTag_2);
            });
        }
    }
}
function getNextChar(editor, position) {
    var nextPosition = position.translate(0, 1);
    var text = editor.document.getText(new vscode.Range(position, nextPosition));
    return text;
}
function getCloseTag(text, excludedTags) {
    var regex = /<(\/?[a-zA-Z][a-zA-Z0-9:\-_.]*)(?:\s+[^<>]*?[^\s/<>=]+?)*?>/g;
    var result = null;
    var stack = [];
    while ((result = regex.exec(text)) !== null) {
        var isStartTag = result[1].substr(0, 1) !== "/";
        var tag = isStartTag ? result[1] : result[1].substr(1);
        if (excludedTags.indexOf(tag) === -1) {
            if (isStartTag) {
                stack.push(tag);
            }
            else if (stack.length > 0) {
                var lastTag = stack[stack.length - 1];
                if (lastTag === tag) {
                    stack.pop();
                }
            }
        }
    }
    if (stack.length > 0) {
        var closeTag = stack[stack.length - 1];
        if (text.substr(text.length - 2) === "</") {
            return closeTag + ">";
        }
        if (text.substr(text.length - 1) === "<") {
            return "/" + closeTag + ">";
        }
        return "</" + closeTag + ">";
    }
    else {
        return null;
    }
}
function moveSelectionRight(selection, shift) {
    var newPosition = selection.active.translate(0, shift);
    var newSelection = new vscode.Selection(newPosition, newPosition);
    return newSelection;
}
function occurrenceCount(source, find) {
    return source.split(find).length - 1;
}
//# sourceMappingURL=extension.js.map