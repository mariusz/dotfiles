"use strict";
var vscode_1 = require('vscode');
var ActionSuggestion = (function () {
    function ActionSuggestion() {
    }
    ActionSuggestion.hide = function () {
        return vscode_1.commands.executeCommand('hideSuggestWidget');
    };
    return ActionSuggestion;
}());
exports.ActionSuggestion = ActionSuggestion;
//# sourceMappingURL=Suggestion.js.map