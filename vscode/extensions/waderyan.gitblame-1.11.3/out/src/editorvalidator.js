"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function validEditor(editor) {
    if (!editor)
        return false;
    const doc = editor.document;
    if (!doc)
        return false;
    if (doc.isUntitled)
        return false; // Document hasn't been saved and is not in git.
    return true;
}
exports.validEditor = validEditor;
//# sourceMappingURL=editorvalidator.js.map