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
const annotationController_1 = require("./annotationController");
const annotations_1 = require("./annotations");
const blameAnnotationProvider_1 = require("./blameAnnotationProvider");
const moment = require("moment");
class HoverBlameAnnotationProvider extends blameAnnotationProvider_1.BlameAnnotationProviderBase {
    provideAnnotation(shaOrLine) {
        return __awaiter(this, void 0, void 0, function* () {
            this.annotationType = annotationController_1.FileAnnotationType.Hover;
            const blame = yield this.getBlame(this._config.annotations.file.hover.heatmap.enabled);
            if (blame === undefined)
                return false;
            const cfg = this._config.annotations.file.hover;
            const now = moment();
            const offset = this.uri.offset;
            const renderOptions = annotations_1.Annotations.hoverRenderOptions(this._config.theme, cfg.heatmap);
            const dateFormat = this._config.defaultDateFormat;
            const decorations = [];
            const document = this.document;
            let commit;
            let hover;
            for (const l of blame.lines) {
                commit = blame.commits.get(l.sha);
                if (commit === undefined)
                    continue;
                const line = l.line + offset;
                hover = annotations_1.Annotations.hover(commit, renderOptions, cfg.heatmap.enabled, dateFormat);
                if (cfg.wholeLine) {
                    hover.range = document.validateRange(new vscode_1.Range(line, 0, line, annotations_1.endOfLineIndex));
                }
                else {
                    const endIndex = document.lineAt(line).firstNonWhitespaceCharacterIndex;
                    hover.range = new vscode_1.Range(line, 0, line, endIndex);
                }
                if (cfg.heatmap.enabled) {
                    annotations_1.Annotations.applyHeatmap(hover, commit.date, now);
                }
                decorations.push(hover);
            }
            if (decorations.length) {
                this.editor.setDecorations(this.decoration, decorations);
            }
            this.selection(shaOrLine, blame);
            return true;
        });
    }
}
exports.HoverBlameAnnotationProvider = HoverBlameAnnotationProvider;
//# sourceMappingURL=hoverBlameAnnotationProvider.js.map