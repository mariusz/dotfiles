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
const annotationProvider_1 = require("./annotationProvider");
class BlameAnnotationProviderBase extends annotationProvider_1.AnnotationProviderBase {
    constructor(context, editor, decoration, highlightDecoration, whitespaceController, git, uri) {
        super(context, editor, decoration, highlightDecoration, whitespaceController);
        this.git = git;
        this.uri = uri;
        this._blame = this.git.getBlameForFile(this.uri);
    }
    selection(shaOrLine, blame) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.highlightDecoration)
                return;
            if (blame === undefined) {
                blame = yield this._blame;
                if (!blame || !blame.lines.length)
                    return;
            }
            const offset = this.uri.offset;
            let sha = undefined;
            if (typeof shaOrLine === 'string') {
                sha = shaOrLine;
            }
            else if (typeof shaOrLine === 'number') {
                const line = shaOrLine - offset;
                if (line >= 0) {
                    const commitLine = blame.lines[line];
                    sha = commitLine && commitLine.sha;
                }
            }
            else {
                sha = system_1.Iterables.first(blame.commits.values()).sha;
            }
            if (!sha) {
                this.editor.setDecorations(this.highlightDecoration, []);
                return;
            }
            const highlightDecorationRanges = blame.lines
                .filter(l => l.sha === sha)
                .map(l => this.editor.document.validateRange(new vscode_1.Range(l.line + offset, 0, l.line + offset, 1000000)));
            this.editor.setDecorations(this.highlightDecoration, highlightDecorationRanges);
        });
    }
    validate() {
        return __awaiter(this, void 0, void 0, function* () {
            const blame = yield this._blame;
            return blame !== undefined && blame.lines.length !== 0;
        });
    }
    getBlame(requiresWhitespaceHack) {
        return __awaiter(this, void 0, void 0, function* () {
            let whitespacePromise;
            if (requiresWhitespaceHack) {
                whitespacePromise = this.whitespaceController && this.whitespaceController.override();
            }
            let blame;
            if (whitespacePromise) {
                [blame] = yield Promise.all([this._blame, whitespacePromise]);
            }
            else {
                blame = yield this._blame;
            }
            if (blame === undefined || !blame.lines.length) {
                this.whitespaceController && (yield this.whitespaceController.restore());
                return undefined;
            }
            return blame;
        });
    }
}
exports.BlameAnnotationProviderBase = BlameAnnotationProviderBase;
//# sourceMappingURL=blameAnnotationProvider.js.map