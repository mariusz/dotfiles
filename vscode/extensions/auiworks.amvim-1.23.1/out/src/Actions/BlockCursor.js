"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
class ActionBlockCursor {
    static on() {
        return new Promise((resovle) => {
            setTimeout(() => {
                const activeTextEditor = vscode_1.window.activeTextEditor;
                if (!activeTextEditor) {
                    return Promise.resolve(false);
                }
                // Workaround for VSCode API's bug: https://github.com/Microsoft/vscode/issues/17513
                // TODO: Remove next line when the bug is fixed.
                activeTextEditor.options.cursorStyle = vscode_1.TextEditorCursorStyle.Line;
                activeTextEditor.options.cursorStyle = vscode_1.TextEditorCursorStyle.Block;
                resovle(true);
            }, 0);
        });
    }
    static off() {
        return new Promise((resovle) => {
            setTimeout(() => {
                const activeTextEditor = vscode_1.window.activeTextEditor;
                if (!activeTextEditor) {
                    return Promise.resolve(false);
                }
                // Workaround for VSCode API's bug: https://github.com/Microsoft/vscode/issues/17513
                // TODO: Remove next line when the bug is fixed.
                activeTextEditor.options.cursorStyle = vscode_1.TextEditorCursorStyle.Underline;
                activeTextEditor.options.cursorStyle = vscode_1.TextEditorCursorStyle.Line;
                resovle(true);
            }, 0);
        });
    }
}
exports.ActionBlockCursor = ActionBlockCursor;
//# sourceMappingURL=BlockCursor.js.map