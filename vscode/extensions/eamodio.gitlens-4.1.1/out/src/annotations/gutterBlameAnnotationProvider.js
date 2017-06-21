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
const annotationController_1 = require("./annotationController");
const blameAnnotationProvider_1 = require("./blameAnnotationProvider");
const annotations_1 = require("./annotations");
const moment = require("moment");
class GutterBlameAnnotationProvider extends blameAnnotationProvider_1.BlameAnnotationProviderBase {
    provideAnnotation(shaOrLine, type) {
        return __awaiter(this, void 0, void 0, function* () {
            this.annotationType = annotationController_1.FileAnnotationType.Gutter;
            const blame = yield this.getBlame(true);
            if (blame === undefined)
                return false;
            const cfg = this._config.annotations.file.gutter;
            const tokenOptions = system_1.Strings.getTokensFromTemplate(cfg.format)
                .reduce((map, token) => {
                map[token.key] = token.options;
                return map;
            }, {});
            const options = {
                dateFormat: cfg.dateFormat === null ? this._config.defaultDateFormat : cfg.dateFormat,
                tokenOptions: tokenOptions
            };
            const now = moment();
            const offset = this.uri.offset;
            let previousLine = undefined;
            const renderOptions = annotations_1.Annotations.gutterRenderOptions(this._config.theme, cfg.heatmap);
            const dateFormat = this._config.defaultDateFormat;
            const decorations = [];
            for (const l of blame.lines) {
                const commit = blame.commits.get(l.sha);
                if (commit === undefined)
                    continue;
                const line = l.line + offset;
                const gutter = annotations_1.Annotations.gutter(commit, cfg.format, options, renderOptions, cfg.compact && previousLine === l.sha);
                if (cfg.compact) {
                    const isEmptyOrWhitespace = this.document.lineAt(line).isEmptyOrWhitespace;
                    previousLine = isEmptyOrWhitespace ? undefined : l.sha;
                }
                if (cfg.heatmap.enabled) {
                    annotations_1.Annotations.applyHeatmap(gutter, commit.date, now);
                }
                const firstNonWhitespace = this.editor.document.lineAt(line).firstNonWhitespaceCharacterIndex;
                gutter.range = this.editor.document.validateRange(new vscode_1.Range(line, 0, line, firstNonWhitespace));
                decorations.push(gutter);
                if (cfg.hover.details) {
                    const details = annotations_1.Annotations.detailsHover(commit, dateFormat);
                    details.range = cfg.hover.wholeLine
                        ? this.editor.document.validateRange(new vscode_1.Range(line, 0, line, annotations_1.endOfLineIndex))
                        : gutter.range;
                    decorations.push(details);
                }
            }
            if (decorations.length) {
                this.editor.setDecorations(this.decoration, decorations);
            }
            this.selection(shaOrLine, blame);
            return true;
        });
    }
}
exports.GutterBlameAnnotationProvider = GutterBlameAnnotationProvider;
//# sourceMappingURL=gutterBlameAnnotationProvider.js.map