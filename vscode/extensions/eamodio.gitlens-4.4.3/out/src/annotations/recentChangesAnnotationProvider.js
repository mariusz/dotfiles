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
const vscode_1 = require("vscode");
const annotations_1 = require("./annotations");
const annotationController_1 = require("./annotationController");
const annotationProvider_1 = require("./annotationProvider");
class RecentChangesAnnotationProvider extends annotationProvider_1.AnnotationProviderBase {
    constructor(context, editor, decoration, highlightDecoration, git, uri) {
        super(context, editor, decoration, highlightDecoration, undefined);
        this.git = git;
        this.uri = uri;
    }
    provideAnnotation(shaOrLine) {
        return __awaiter(this, void 0, void 0, function* () {
            this.annotationType = annotationController_1.FileAnnotationType.RecentChanges;
            const commit = yield this.git.getLogCommit(this.uri.repoPath, this.uri.fsPath, { previous: true });
            if (commit === undefined)
                return false;
            const diff = yield this.git.getDiffForFile(this.uri, commit.previousSha);
            if (diff === undefined)
                return false;
            const cfg = this._config.annotations.file.recentChanges;
            const dateFormat = this._config.defaultDateFormat;
            const decorators = [];
            for (const chunk of diff.chunks) {
                let count = chunk.currentPosition.start - 2;
                for (const line of chunk.lines) {
                    if (line.line === undefined)
                        continue;
                    count++;
                    if (line.state === 'unchanged')
                        continue;
                    let endingIndex = 0;
                    if (cfg.hover.details || cfg.hover.changes) {
                        endingIndex = cfg.hover.wholeLine ? annotations_1.endOfLineIndex : this.editor.document.lineAt(count).firstNonWhitespaceCharacterIndex;
                    }
                    const range = this.editor.document.validateRange(new vscode_1.Range(new vscode_1.Position(count, 0), new vscode_1.Position(count, endingIndex)));
                    if (cfg.hover.details) {
                        decorators.push({
                            hoverMessage: annotations_1.Annotations.getHoverMessage(commit, dateFormat),
                            range: range
                        });
                    }
                    let message = undefined;
                    if (cfg.hover.changes) {
                        message = annotations_1.Annotations.getHoverDiffMessage(commit, line);
                    }
                    decorators.push({
                        hoverMessage: message,
                        range: range
                    });
                }
            }
            this.editor.setDecorations(this.highlightDecoration, decorators);
            return true;
        });
    }
    selection(shaOrLine) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    validate() {
        return __awaiter(this, void 0, void 0, function* () {
            return true;
        });
    }
}
exports.RecentChangesAnnotationProvider = RecentChangesAnnotationProvider;
//# sourceMappingURL=recentChangesAnnotationProvider.js.map