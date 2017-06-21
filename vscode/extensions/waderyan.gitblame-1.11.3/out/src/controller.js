"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const errorhandler_1 = require("./errorhandler");
const vscode_1 = require("vscode");
const editorvalidator_1 = require("./editorvalidator");
const textdecorator_1 = require("../src/textdecorator");
class GitBlameController {
    constructor(gitBlame, view) {
        this.gitBlame = gitBlame;
        this.view = view;
        const self = this;
        const disposables = [];
        vscode_1.window.onDidChangeActiveTextEditor(self.onTextEditorMove, self, disposables);
        vscode_1.window.onDidChangeTextEditorSelection(self.onTextEditorSelectionChange, self, disposables);
        this.onTextEditorMove(vscode_1.window.activeTextEditor);
        this.disposable = vscode_1.Disposable.from(...disposables);
    }
    onTextEditorMove(editor) {
        return __awaiter(this, void 0, void 0, function* () {
            if (editorvalidator_1.validEditor(editor)) {
                try {
                    const lineInfo = yield this.gitBlame.getLineInfo(editor.document.fileName, editor.selection.active.line);
                    this.show(lineInfo);
                }
                catch (err) {
                    errorhandler_1.handleErrorToLog(err);
                    this.clear();
                }
            }
            else {
                this.clear();
            }
        });
    }
    onTextEditorSelectionChange(textEditorSelectionChangeEvent) {
        this.onTextEditorMove(textEditorSelectionChangeEvent.textEditor);
    }
    clear() {
        this.view.refresh('', false);
    }
    show(commitInfo) {
        if (commitInfo) {
            const clickable = commitInfo.hash !== '0000000000000000000000000000000000000000';
            this.view.refresh(textdecorator_1.TextDecorator.toTextView(commitInfo), clickable);
        }
        else {
            this.clear();
        }
    }
    dispose() {
        this.disposable.dispose();
    }
}
exports.GitBlameController = GitBlameController;
//# sourceMappingURL=controller.js.map