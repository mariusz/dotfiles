'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const system_1 = require("../system");
const vscode_1 = require("vscode");
const comparers_1 = require("../comparers");
const configuration_1 = require("../configuration");
class AnnotationProviderBase extends vscode_1.Disposable {
    constructor(context, editor, decoration, highlightDecoration, whitespaceController) {
        super(() => this.dispose());
        this.editor = editor;
        this.decoration = decoration;
        this.highlightDecoration = highlightDecoration;
        this.whitespaceController = whitespaceController;
        this.document = this.editor.document;
        this._config = vscode_1.workspace.getConfiguration().get(configuration_1.ExtensionKey);
        const subscriptions = [];
        subscriptions.push(vscode_1.window.onDidChangeTextEditorSelection(this._onTextEditorSelectionChanged, this));
        this._disposable = vscode_1.Disposable.from(...subscriptions);
    }
    dispose() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.clear();
            this._disposable && this._disposable.dispose();
        });
    }
    _onTextEditorSelectionChanged(e) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!comparers_1.TextDocumentComparer.equals(this.document, e.textEditor && e.textEditor.document))
                return;
            return this.selection(e.selections[0].active.line);
        });
    }
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.editor !== undefined) {
                try {
                    if (this.decoration !== undefined) {
                        this.editor.setDecorations(this.decoration, []);
                    }
                    if (this.highlightDecoration !== undefined) {
                        this.editor.setDecorations(this.highlightDecoration, []);
                        yield system_1.Functions.wait(1);
                        if (this.highlightDecoration === undefined)
                            return;
                        this.editor.setDecorations(this.highlightDecoration, []);
                    }
                }
                catch (ex) { }
            }
            this.whitespaceController && (yield this.whitespaceController.restore());
        });
    }
    reset(decoration, highlightDecoration, whitespaceController) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.clear();
            this._config = vscode_1.workspace.getConfiguration().get(configuration_1.ExtensionKey);
            this.decoration = decoration;
            this.highlightDecoration = highlightDecoration;
            this.whitespaceController = whitespaceController;
            yield this.provideAnnotation(this.editor === undefined ? undefined : this.editor.selection.active.line);
        });
    }
}
exports.AnnotationProviderBase = AnnotationProviderBase;
//# sourceMappingURL=annotationProvider.js.map