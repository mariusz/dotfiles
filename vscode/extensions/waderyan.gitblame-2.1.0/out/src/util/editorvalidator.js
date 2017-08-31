"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
function validEditor(editor) {
    const doc = editor && editor.document;
    return doc && !doc.isUntitled;
}
exports.validEditor = validEditor;
function isActiveEditorValid() {
    return validEditor(vscode_1.window.activeTextEditor);
}
exports.isActiveEditorValid = isActiveEditorValid;
//# sourceMappingURL=editorvalidator.js.map