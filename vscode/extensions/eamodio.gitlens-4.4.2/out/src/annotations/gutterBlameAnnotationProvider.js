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
const annotations_1 = require("./annotations");
const blameAnnotationProvider_1 = require("./blameAnnotationProvider");
const constants_1 = require("../constants");
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
            const renderOptions = annotations_1.Annotations.gutterRenderOptions(this._config.theme, cfg.heatmap);
            const dateFormat = this._config.defaultDateFormat;
            const separateLines = this._config.theme.annotations.file.gutter.separateLines;
            const decorations = [];
            const document = this.document;
            let commit;
            let compacted = false;
            let details;
            let gutter;
            let previousSha;
            for (const l of blame.lines) {
                commit = blame.commits.get(l.sha);
                if (commit === undefined)
                    continue;
                const line = l.line + offset;
                if (previousSha === l.sha) {
                    gutter = Object.assign({}, gutter);
                    if (cfg.compact && !compacted) {
                        gutter.renderOptions = Object.assign({}, gutter.renderOptions);
                        gutter.renderOptions.before = Object.assign({}, gutter.renderOptions.before, { contentText: constants_1.GlyphChars.Space.repeat(system_1.Strings.getWidth(gutter.renderOptions.before.contentText)) });
                        if (separateLines) {
                            gutter.renderOptions.dark = Object.assign({}, gutter.renderOptions.dark);
                            gutter.renderOptions.dark.before = Object.assign({}, gutter.renderOptions.dark.before, { textDecoration: 'none' });
                            gutter.renderOptions.light = Object.assign({}, gutter.renderOptions.light);
                            gutter.renderOptions.light.before = Object.assign({}, gutter.renderOptions.light.before, { textDecoration: 'none' });
                        }
                        compacted = true;
                    }
                    const endIndex = document.lineAt(line).firstNonWhitespaceCharacterIndex;
                    gutter.range = new vscode_1.Range(line, 0, line, endIndex);
                    decorations.push(gutter);
                    if (details !== undefined) {
                        details = Object.assign({}, details);
                        details.range = cfg.hover.wholeLine
                            ? document.validateRange(new vscode_1.Range(line, 0, line, annotations_1.endOfLineIndex))
                            : gutter.range;
                        decorations.push(details);
                    }
                    continue;
                }
                compacted = false;
                previousSha = l.sha;
                gutter = annotations_1.Annotations.gutter(commit, cfg.format, options, renderOptions);
                if (cfg.heatmap.enabled) {
                    annotations_1.Annotations.applyHeatmap(gutter, commit.date, now);
                }
                const endIndex = document.lineAt(line).firstNonWhitespaceCharacterIndex;
                gutter.range = new vscode_1.Range(line, 0, line, endIndex);
                decorations.push(gutter);
                if (cfg.hover.details) {
                    details = annotations_1.Annotations.detailsHover(commit, dateFormat);
                    details.range = cfg.hover.wholeLine
                        ? document.validateRange(new vscode_1.Range(line, 0, line, annotations_1.endOfLineIndex))
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