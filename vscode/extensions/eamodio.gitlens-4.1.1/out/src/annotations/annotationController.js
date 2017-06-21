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
const keyboard_1 = require("../keyboard");
const comparers_1 = require("../comparers");
const configuration_1 = require("../configuration");
const gitService_1 = require("../gitService");
const gutterBlameAnnotationProvider_1 = require("./gutterBlameAnnotationProvider");
const hoverBlameAnnotationProvider_1 = require("./hoverBlameAnnotationProvider");
const logger_1 = require("../logger");
const recentChangesAnnotationProvider_1 = require("./recentChangesAnnotationProvider");
const whitespaceController_1 = require("./whitespaceController");
exports.FileAnnotationType = {
    Gutter: 'gutter',
    Hover: 'hover',
    RecentChanges: 'recentChanges'
};
exports.Decorations = {
    blameAnnotation: vscode_1.window.createTextEditorDecorationType({
        isWholeLine: true,
        textDecoration: 'none'
    }),
    blameHighlight: undefined,
    recentChangesAnnotation: undefined,
    recentChangesHighlight: undefined
};
class AnnotationController extends vscode_1.Disposable {
    constructor(context, git, gitContextTracker) {
        super(() => this.dispose());
        this.context = context;
        this.git = git;
        this.gitContextTracker = gitContextTracker;
        this._onDidToggleAnnotations = new vscode_1.EventEmitter();
        this._annotationProviders = new Map();
        this._keyboardScope = undefined;
        this._onConfigurationChanged();
        const subscriptions = [];
        subscriptions.push(vscode_1.workspace.onDidChangeConfiguration(this._onConfigurationChanged, this));
        this._disposable = vscode_1.Disposable.from(...subscriptions);
    }
    get onDidToggleAnnotations() {
        return this._onDidToggleAnnotations.event;
    }
    dispose() {
        this._annotationProviders.forEach((p, i) => __awaiter(this, void 0, void 0, function* () { return yield this.clear(i); }));
        exports.Decorations.blameAnnotation && exports.Decorations.blameAnnotation.dispose();
        exports.Decorations.blameHighlight && exports.Decorations.blameHighlight.dispose();
        this._annotationsDisposable && this._annotationsDisposable.dispose();
        this._whitespaceController && this._whitespaceController.dispose();
        this._disposable && this._disposable.dispose();
    }
    _onConfigurationChanged() {
        let toggleWhitespace = vscode_1.workspace.getConfiguration(`${configuration_1.ExtensionKey}.advanced.toggleWhitespace`).get('enabled');
        if (toggleWhitespace && this._annotationProviders.size === 0) {
            toggleWhitespace = (vscode_1.workspace.getConfiguration('editor').get('renderWhitespace') !== 'none');
        }
        let changed = false;
        if (toggleWhitespace && this._whitespaceController === undefined) {
            changed = true;
            this._whitespaceController = new whitespaceController_1.WhitespaceController();
        }
        else if (!toggleWhitespace && this._whitespaceController !== undefined) {
            changed = true;
            this._whitespaceController.dispose();
            this._whitespaceController = undefined;
        }
        const cfg = vscode_1.workspace.getConfiguration().get(configuration_1.ExtensionKey);
        const cfgBlameHighlight = cfg.blame.file.lineHighlight;
        const cfgChangesHighlight = cfg.recentChanges.file.lineHighlight;
        const cfgTheme = cfg.theme.lineHighlight;
        if (!system_1.Objects.areEquivalent(cfgBlameHighlight, this._config && this._config.blame.file.lineHighlight) ||
            !system_1.Objects.areEquivalent(cfgChangesHighlight, this._config && this._config.recentChanges.file.lineHighlight) ||
            !system_1.Objects.areEquivalent(cfgTheme, this._config && this._config.theme.lineHighlight)) {
            changed = true;
            exports.Decorations.blameHighlight && exports.Decorations.blameHighlight.dispose();
            if (cfgBlameHighlight.enabled) {
                exports.Decorations.blameHighlight = vscode_1.window.createTextEditorDecorationType({
                    gutterIconSize: 'contain',
                    isWholeLine: true,
                    overviewRulerLane: vscode_1.OverviewRulerLane.Right,
                    dark: {
                        backgroundColor: cfgBlameHighlight.locations.includes(configuration_1.LineHighlightLocations.Line)
                            ? cfgTheme.dark.backgroundColor || configuration_1.themeDefaults.lineHighlight.dark.backgroundColor
                            : undefined,
                        gutterIconPath: cfgBlameHighlight.locations.includes(configuration_1.LineHighlightLocations.Gutter)
                            ? this.context.asAbsolutePath('images/dark/highlight-gutter.svg')
                            : undefined,
                        overviewRulerColor: cfgBlameHighlight.locations.includes(configuration_1.LineHighlightLocations.OverviewRuler)
                            ? cfgTheme.dark.overviewRulerColor || configuration_1.themeDefaults.lineHighlight.dark.overviewRulerColor
                            : undefined
                    },
                    light: {
                        backgroundColor: cfgBlameHighlight.locations.includes(configuration_1.LineHighlightLocations.Line)
                            ? cfgTheme.light.backgroundColor || configuration_1.themeDefaults.lineHighlight.light.backgroundColor
                            : undefined,
                        gutterIconPath: cfgBlameHighlight.locations.includes(configuration_1.LineHighlightLocations.Gutter)
                            ? this.context.asAbsolutePath('images/light/highlight-gutter.svg')
                            : undefined,
                        overviewRulerColor: cfgBlameHighlight.locations.includes(configuration_1.LineHighlightLocations.OverviewRuler)
                            ? cfgTheme.light.overviewRulerColor || configuration_1.themeDefaults.lineHighlight.light.overviewRulerColor
                            : undefined
                    }
                });
            }
            else {
                exports.Decorations.blameHighlight = undefined;
            }
            exports.Decorations.recentChangesHighlight && exports.Decorations.recentChangesHighlight.dispose();
            exports.Decorations.recentChangesHighlight = vscode_1.window.createTextEditorDecorationType({
                gutterIconSize: 'contain',
                isWholeLine: true,
                overviewRulerLane: vscode_1.OverviewRulerLane.Right,
                dark: {
                    backgroundColor: cfgChangesHighlight.locations.includes(configuration_1.LineHighlightLocations.Line)
                        ? cfgTheme.dark.backgroundColor || configuration_1.themeDefaults.lineHighlight.dark.backgroundColor
                        : undefined,
                    gutterIconPath: cfgChangesHighlight.locations.includes(configuration_1.LineHighlightLocations.Gutter)
                        ? this.context.asAbsolutePath('images/dark/highlight-gutter.svg')
                        : undefined,
                    overviewRulerColor: cfgChangesHighlight.locations.includes(configuration_1.LineHighlightLocations.OverviewRuler)
                        ? cfgTheme.dark.overviewRulerColor || configuration_1.themeDefaults.lineHighlight.dark.overviewRulerColor
                        : undefined
                },
                light: {
                    backgroundColor: cfgChangesHighlight.locations.includes(configuration_1.LineHighlightLocations.Line)
                        ? cfgTheme.light.backgroundColor || configuration_1.themeDefaults.lineHighlight.light.backgroundColor
                        : undefined,
                    gutterIconPath: cfgChangesHighlight.locations.includes(configuration_1.LineHighlightLocations.Gutter)
                        ? this.context.asAbsolutePath('images/light/highlight-gutter.svg')
                        : undefined,
                    overviewRulerColor: cfgChangesHighlight.locations.includes(configuration_1.LineHighlightLocations.OverviewRuler)
                        ? cfgTheme.light.overviewRulerColor || configuration_1.themeDefaults.lineHighlight.light.overviewRulerColor
                        : undefined
                }
            });
        }
        if (!system_1.Objects.areEquivalent(cfg.blame.file, this._config && this._config.blame.file) ||
            !system_1.Objects.areEquivalent(cfg.recentChanges.file, this._config && this._config.recentChanges.file) ||
            !system_1.Objects.areEquivalent(cfg.annotations, this._config && this._config.annotations) ||
            !system_1.Objects.areEquivalent(cfg.theme.annotations, this._config && this._config.theme.annotations)) {
            changed = true;
        }
        this._config = cfg;
        if (changed) {
            for (const provider of this._annotationProviders.values()) {
                if (provider === undefined)
                    continue;
                if (provider.annotationType === exports.FileAnnotationType.RecentChanges) {
                    provider.reset(exports.Decorations.recentChangesAnnotation, exports.Decorations.recentChangesHighlight);
                }
                else {
                    provider.reset(exports.Decorations.blameAnnotation, exports.Decorations.blameHighlight, this._whitespaceController);
                }
            }
        }
    }
    clear(column) {
        return __awaiter(this, void 0, void 0, function* () {
            const provider = this._annotationProviders.get(column);
            if (provider === undefined)
                return;
            this._annotationProviders.delete(column);
            yield provider.dispose();
            if (this._annotationProviders.size === 0) {
                logger_1.Logger.log(`Remove listener registrations for annotations`);
                this._keyboardScope && this._keyboardScope.dispose();
                this._keyboardScope = undefined;
                this._annotationsDisposable && this._annotationsDisposable.dispose();
                this._annotationsDisposable = undefined;
            }
            this._onDidToggleAnnotations.fire();
        });
    }
    getAnnotationType(editor) {
        const provider = this.getProvider(editor);
        return provider === undefined ? undefined : provider.annotationType;
    }
    getProvider(editor) {
        if (!editor || !editor.document || !this.git.isEditorBlameable(editor))
            return undefined;
        return this._annotationProviders.get(editor.viewColumn || -1);
    }
    showAnnotations(editor, type, shaOrLine) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!editor || !editor.document || !this.git.isEditorBlameable(editor))
                return false;
            const currentProvider = this._annotationProviders.get(editor.viewColumn || -1);
            if (currentProvider && comparers_1.TextEditorComparer.equals(currentProvider.editor, editor)) {
                yield currentProvider.selection(shaOrLine);
                return true;
            }
            if (this._keyboardScope === undefined) {
                this._keyboardScope = yield keyboard_1.Keyboard.instance.beginScope({
                    escape: {
                        onDidPressKey: (key) => {
                            const editor = vscode_1.window.activeTextEditor;
                            if (editor === undefined)
                                return Promise.resolve(undefined);
                            this.clear(editor.viewColumn || -1);
                            return Promise.resolve(undefined);
                        }
                    }
                });
            }
            const gitUri = yield gitService_1.GitUri.fromUri(editor.document.uri, this.git);
            let provider = undefined;
            switch (type) {
                case exports.FileAnnotationType.Gutter:
                    provider = new gutterBlameAnnotationProvider_1.GutterBlameAnnotationProvider(this.context, editor, exports.Decorations.blameAnnotation, exports.Decorations.blameHighlight, this._whitespaceController, this.git, gitUri);
                    break;
                case exports.FileAnnotationType.Hover:
                    provider = new hoverBlameAnnotationProvider_1.HoverBlameAnnotationProvider(this.context, editor, exports.Decorations.blameAnnotation, exports.Decorations.blameHighlight, this._whitespaceController, this.git, gitUri);
                    break;
                case exports.FileAnnotationType.RecentChanges:
                    provider = new recentChangesAnnotationProvider_1.RecentChangesAnnotationProvider(this.context, editor, undefined, exports.Decorations.recentChangesHighlight, this.git, gitUri);
                    break;
            }
            if (provider === undefined || !(yield provider.validate()))
                return false;
            if (currentProvider) {
                yield this.clear(currentProvider.editor.viewColumn || -1);
            }
            if (!this._annotationsDisposable && this._annotationProviders.size === 0) {
                logger_1.Logger.log(`Add listener registrations for annotations`);
                const subscriptions = [];
                subscriptions.push(vscode_1.window.onDidChangeVisibleTextEditors(system_1.Functions.debounce(this._onVisibleTextEditorsChanged, 100), this));
                subscriptions.push(vscode_1.window.onDidChangeTextEditorViewColumn(this._onTextEditorViewColumnChanged, this));
                subscriptions.push(vscode_1.workspace.onDidChangeTextDocument(this._onTextDocumentChanged, this));
                subscriptions.push(vscode_1.workspace.onDidCloseTextDocument(this._onTextDocumentClosed, this));
                subscriptions.push(this.gitContextTracker.onDidBlameabilityChange(this._onBlameabilityChanged, this));
                this._annotationsDisposable = vscode_1.Disposable.from(...subscriptions);
            }
            this._annotationProviders.set(editor.viewColumn || -1, provider);
            if (yield provider.provideAnnotation(shaOrLine)) {
                this._onDidToggleAnnotations.fire();
                return true;
            }
            return false;
        });
    }
    toggleAnnotations(editor, type, shaOrLine) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!editor || !editor.document || type === exports.FileAnnotationType.RecentChanges ? !this.git.isTrackable(editor.document.uri) : !this.git.isEditorBlameable(editor))
                return false;
            const provider = this._annotationProviders.get(editor.viewColumn || -1);
            if (provider === undefined)
                return this.showAnnotations(editor, type, shaOrLine);
            const reopen = provider.annotationType !== type;
            yield this.clear(provider.editor.viewColumn || -1);
            if (!reopen)
                return false;
            return this.showAnnotations(editor, type, shaOrLine);
        });
    }
    _onBlameabilityChanged(e) {
        if (e.blameable || !e.editor)
            return;
        for (const [key, p] of this._annotationProviders) {
            if (!comparers_1.TextDocumentComparer.equals(p.document, e.editor.document))
                continue;
            logger_1.Logger.log('BlameabilityChanged:', `Clear annotations for column ${key}`);
            this.clear(key);
        }
    }
    _onTextDocumentChanged(e) {
        for (const [key, p] of this._annotationProviders) {
            if (!comparers_1.TextDocumentComparer.equals(p.document, e.document))
                continue;
            setTimeout(() => {
                if (e.document.isDirty)
                    return;
                logger_1.Logger.log('TextDocumentChanged:', `Clear annotations for column ${key}`);
                this.clear(key);
            }, 1);
        }
    }
    _onTextDocumentClosed(e) {
        for (const [key, p] of this._annotationProviders) {
            if (!comparers_1.TextDocumentComparer.equals(p.document, e))
                continue;
            logger_1.Logger.log('TextDocumentClosed:', `Clear annotations for column ${key}`);
            this.clear(key);
        }
    }
    _onTextEditorViewColumnChanged(e) {
        return __awaiter(this, void 0, void 0, function* () {
            const viewColumn = e.viewColumn || -1;
            logger_1.Logger.log('TextEditorViewColumnChanged:', `Clear annotations for column ${viewColumn}`);
            yield this.clear(viewColumn);
            for (const [key, p] of this._annotationProviders) {
                if (!comparers_1.TextEditorComparer.equals(p.editor, e.textEditor))
                    continue;
                logger_1.Logger.log('TextEditorViewColumnChanged:', `Clear annotations for column ${key}`);
                yield this.clear(key);
            }
        });
    }
    _onVisibleTextEditorsChanged(e) {
        return __awaiter(this, void 0, void 0, function* () {
            if (e.every(_ => _.document.uri.scheme === 'inmemory'))
                return;
            for (const [key, p] of this._annotationProviders) {
                if (e.some(_ => comparers_1.TextEditorComparer.equals(p.editor, _)))
                    continue;
                logger_1.Logger.log('VisibleTextEditorsChanged:', `Clear annotations for column ${key}`);
                this.clear(key);
            }
        });
    }
}
exports.AnnotationController = AnnotationController;
//# sourceMappingURL=annotationController.js.map