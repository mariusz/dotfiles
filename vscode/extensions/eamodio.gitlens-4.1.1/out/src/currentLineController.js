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
const system_1 = require("./system");
const vscode_1 = require("vscode");
const annotationController_1 = require("./annotations/annotationController");
const annotations_1 = require("./annotations/annotations");
const commands_1 = require("./commands");
const comparers_1 = require("./comparers");
const configuration_1 = require("./configuration");
const constants_1 = require("./constants");
const gitService_1 = require("./gitService");
const annotationDecoration = vscode_1.window.createTextEditorDecorationType({
    after: {
        margin: '0 0 0 3em',
        textDecoration: 'none'
    }
});
exports.LineAnnotationType = {
    Trailing: 'trailing',
    Hover: 'hover'
};
class CurrentLineController extends vscode_1.Disposable {
    constructor(context, git, gitContextTracker, annotationController) {
        super(() => this.dispose());
        this.git = git;
        this.gitContextTracker = gitContextTracker;
        this.annotationController = annotationController;
        this._currentLine = -1;
        this._isAnnotating = false;
        this._updateBlameDebounced = system_1.Functions.debounce(this._updateBlame, 250);
        this._onConfigurationChanged();
        const subscriptions = [];
        subscriptions.push(vscode_1.workspace.onDidChangeConfiguration(this._onConfigurationChanged, this));
        subscriptions.push(git.onDidChangeGitCache(this._onGitCacheChanged, this));
        subscriptions.push(annotationController.onDidToggleAnnotations(this._onAnnotationsToggled, this));
        this._disposable = vscode_1.Disposable.from(...subscriptions);
    }
    dispose() {
        this._clearAnnotations(this._editor, true);
        this._activeEditorLineDisposable && this._activeEditorLineDisposable.dispose();
        this._statusBarItem && this._statusBarItem.dispose();
        this._disposable && this._disposable.dispose();
    }
    _onConfigurationChanged() {
        const cfg = vscode_1.workspace.getConfiguration().get(constants_1.ExtensionKey);
        let changed = false;
        if (!system_1.Objects.areEquivalent(cfg.blame.line, this._config && this._config.blame.line) ||
            !system_1.Objects.areEquivalent(cfg.annotations.line.trailing, this._config && this._config.annotations.line.trailing) ||
            !system_1.Objects.areEquivalent(cfg.annotations.line.hover, this._config && this._config.annotations.line.hover) ||
            !system_1.Objects.areEquivalent(cfg.theme.annotations.line.trailing, this._config && this._config.theme.annotations.line.trailing)) {
            changed = true;
            this._clearAnnotations(this._editor);
        }
        if (!system_1.Objects.areEquivalent(cfg.statusBar, this._config && this._config.statusBar)) {
            changed = true;
            if (cfg.statusBar.enabled) {
                const alignment = cfg.statusBar.alignment !== 'left' ? vscode_1.StatusBarAlignment.Right : vscode_1.StatusBarAlignment.Left;
                if (this._statusBarItem !== undefined && this._statusBarItem.alignment !== alignment) {
                    this._statusBarItem.dispose();
                    this._statusBarItem = undefined;
                }
                this._statusBarItem = this._statusBarItem || vscode_1.window.createStatusBarItem(alignment, alignment === vscode_1.StatusBarAlignment.Right ? 1000 : 0);
                this._statusBarItem.command = cfg.statusBar.command;
            }
            else if (!cfg.statusBar.enabled && this._statusBarItem) {
                this._statusBarItem.dispose();
                this._statusBarItem = undefined;
            }
        }
        this._config = cfg;
        if (!changed)
            return;
        const trackCurrentLine = cfg.statusBar.enabled || cfg.blame.line.enabled;
        if (trackCurrentLine && !this._activeEditorLineDisposable) {
            const subscriptions = [];
            subscriptions.push(vscode_1.window.onDidChangeActiveTextEditor(this._onActiveTextEditorChanged, this));
            subscriptions.push(vscode_1.window.onDidChangeTextEditorSelection(this._onTextEditorSelectionChanged, this));
            subscriptions.push(this.gitContextTracker.onDidBlameabilityChange(this._onBlameabilityChanged, this));
            this._activeEditorLineDisposable = vscode_1.Disposable.from(...subscriptions);
        }
        else if (!trackCurrentLine && this._activeEditorLineDisposable) {
            this._activeEditorLineDisposable.dispose();
            this._activeEditorLineDisposable = undefined;
        }
        this._onActiveTextEditorChanged(vscode_1.window.activeTextEditor);
    }
    isEditorBlameable(editor) {
        if (editor === undefined || editor.document === undefined)
            return false;
        if (!this.git.isTrackable(editor.document.uri))
            return false;
        if (editor.document.isUntitled && editor.document.uri.scheme === constants_1.DocumentSchemes.File)
            return false;
        return this.git.isEditorBlameable(editor);
    }
    _onActiveTextEditorChanged(editor) {
        return __awaiter(this, void 0, void 0, function* () {
            this._currentLine = -1;
            this._clearAnnotations(this._editor);
            if (editor === undefined || !this.isEditorBlameable(editor)) {
                this.clear(editor);
                this._editor = undefined;
                return;
            }
            this._blameable = editor !== undefined && editor.document !== undefined && !editor.document.isDirty;
            this._editor = editor;
            this._uri = yield gitService_1.GitUri.fromUri(editor.document.uri, this.git);
            const maxLines = this._config.advanced.caching.maxLines;
            if (this._config.advanced.caching.enabled && (maxLines <= 0 || editor.document.lineCount <= maxLines)) {
                this.git.getBlameForFile(this._uri);
            }
            this._updateBlameDebounced(editor.selection.active.line, editor);
        });
    }
    _onBlameabilityChanged(e) {
        this._blameable = e.blameable;
        if (!e.blameable || !this._editor) {
            this.clear(e.editor);
            return;
        }
        if (!comparers_1.TextEditorComparer.equals(this._editor, e.editor))
            return;
        this._updateBlameDebounced(this._editor.selection.active.line, this._editor);
    }
    _onAnnotationsToggled() {
        this._onActiveTextEditorChanged(vscode_1.window.activeTextEditor);
    }
    _onGitCacheChanged() {
        this._onActiveTextEditorChanged(vscode_1.window.activeTextEditor);
    }
    _onTextEditorSelectionChanged(e) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._blameable || !comparers_1.TextEditorComparer.equals(this._editor, e.textEditor))
                return;
            const line = e.selections[0].active.line;
            if (line === this._currentLine)
                return;
            this._currentLine = line;
            if (!this._uri && e.textEditor !== undefined) {
                this._uri = yield gitService_1.GitUri.fromUri(e.textEditor.document.uri, this.git);
            }
            this._clearAnnotations(e.textEditor);
            this._updateBlameDebounced(line, e.textEditor);
        });
    }
    _updateBlame(line, editor) {
        return __awaiter(this, void 0, void 0, function* () {
            line = line - this._uri.offset;
            let commit = undefined;
            let commitLine = undefined;
            if (this._blameable && line >= 0) {
                const blameLine = yield this.git.getBlameForLine(this._uri, line);
                commitLine = blameLine === undefined ? undefined : blameLine.line;
                commit = blameLine === undefined ? undefined : blameLine.commit;
            }
            if (commit !== undefined && commitLine !== undefined) {
                this.show(commit, commitLine, editor, line);
            }
            else {
                this.clear(editor);
            }
        });
    }
    clear(editor) {
        return __awaiter(this, void 0, void 0, function* () {
            this._clearAnnotations(editor, true);
            this._statusBarItem && this._statusBarItem.hide();
        });
    }
    _clearAnnotations(editor, force = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (editor === undefined || (!this._isAnnotating && !force))
                return;
            editor.setDecorations(annotationDecoration, []);
            this._isAnnotating = false;
            if (!force)
                return;
            yield system_1.Functions.wait(1);
            editor.setDecorations(annotationDecoration, []);
        });
    }
    show(commit, blameLine, editor, line) {
        return __awaiter(this, void 0, void 0, function* () {
            if (editor.document === undefined)
                return;
            this._updateStatusBar(commit);
            yield this._updateAnnotations(commit, blameLine, editor, line);
        });
    }
    showAnnotations(editor, type) {
        return __awaiter(this, void 0, void 0, function* () {
            if (editor === undefined)
                return;
            const cfg = this._config.blame.line;
            if (!cfg.enabled || cfg.annotationType !== type) {
                cfg.enabled = true;
                cfg.annotationType = type;
                yield this._clearAnnotations(editor);
                yield this._updateBlame(editor.selection.active.line, editor);
            }
        });
    }
    toggleAnnotations(editor, type) {
        return __awaiter(this, void 0, void 0, function* () {
            if (editor === undefined)
                return;
            const cfg = this._config.blame.line;
            cfg.enabled = !cfg.enabled;
            cfg.annotationType = type;
            yield this._clearAnnotations(editor);
            yield this._updateBlame(editor.selection.active.line, editor);
        });
    }
    _updateAnnotations(commit, blameLine, editor, line) {
        return __awaiter(this, void 0, void 0, function* () {
            const cfg = this._config.blame.line;
            if (!cfg.enabled)
                return;
            line = line === undefined ? blameLine.line + this._uri.offset : line;
            const decorationOptions = [];
            let showChanges = false;
            let showChangesStartIndex = 0;
            let showChangesInStartingWhitespace = false;
            let showDetails = false;
            let showDetailsStartIndex = 0;
            let showDetailsInStartingWhitespace = false;
            switch (cfg.annotationType) {
                case exports.LineAnnotationType.Trailing: {
                    const cfgAnnotations = this._config.annotations.line.trailing;
                    showChanges = cfgAnnotations.hover.changes;
                    showDetails = cfgAnnotations.hover.details;
                    if (cfgAnnotations.hover.wholeLine) {
                        showChangesStartIndex = 0;
                        showChangesInStartingWhitespace = false;
                        showDetailsStartIndex = 0;
                        showDetailsInStartingWhitespace = false;
                    }
                    else {
                        showChangesStartIndex = annotations_1.endOfLineIndex;
                        showChangesInStartingWhitespace = true;
                        showDetailsStartIndex = annotations_1.endOfLineIndex;
                        showDetailsInStartingWhitespace = true;
                    }
                    const decoration = annotations_1.Annotations.trailing(commit, cfgAnnotations.format, cfgAnnotations.dateFormat === null ? this._config.defaultDateFormat : cfgAnnotations.dateFormat, this._config.theme);
                    decoration.range = editor.document.validateRange(new vscode_1.Range(line, annotations_1.endOfLineIndex, line, annotations_1.endOfLineIndex));
                    decorationOptions.push(decoration);
                    break;
                }
                case exports.LineAnnotationType.Hover: {
                    const cfgAnnotations = this._config.annotations.line.hover;
                    showChanges = cfgAnnotations.changes;
                    showChangesStartIndex = 0;
                    showChangesInStartingWhitespace = false;
                    showDetails = cfgAnnotations.details;
                    showDetailsStartIndex = 0;
                    showDetailsInStartingWhitespace = false;
                    break;
                }
            }
            if (showDetails || showChanges) {
                const annotationType = this.annotationController.getAnnotationType(editor);
                const firstNonWhitespace = editor.document.lineAt(line).firstNonWhitespaceCharacterIndex;
                switch (annotationType) {
                    case annotationController_1.FileAnnotationType.Gutter: {
                        const cfgHover = this._config.annotations.file.gutter.hover;
                        if (cfgHover.details) {
                            showDetailsInStartingWhitespace = false;
                            if (cfgHover.wholeLine) {
                                showDetails = false;
                            }
                            else {
                                if (showDetailsStartIndex === 0) {
                                    showDetailsStartIndex = firstNonWhitespace === 0 ? 1 : firstNonWhitespace;
                                }
                                if (showChangesStartIndex === 0) {
                                    showChangesInStartingWhitespace = true;
                                    showChangesStartIndex = firstNonWhitespace === 0 ? 1 : firstNonWhitespace;
                                }
                            }
                        }
                        break;
                    }
                    case annotationController_1.FileAnnotationType.Hover: {
                        const cfgHover = this._config.annotations.file.hover;
                        showDetailsInStartingWhitespace = false;
                        if (cfgHover.wholeLine) {
                            showDetails = false;
                            showChangesStartIndex = 0;
                        }
                        else {
                            if (showDetailsStartIndex === 0) {
                                showDetailsStartIndex = firstNonWhitespace === 0 ? 1 : firstNonWhitespace;
                            }
                            if (showChangesStartIndex === 0) {
                                showChangesInStartingWhitespace = true;
                                showChangesStartIndex = firstNonWhitespace === 0 ? 1 : firstNonWhitespace;
                            }
                        }
                        break;
                    }
                    case annotationController_1.FileAnnotationType.RecentChanges: {
                        const cfgChanges = this._config.annotations.file.recentChanges.hover;
                        if (cfgChanges.details) {
                            if (cfgChanges.wholeLine) {
                                showDetails = false;
                            }
                            else {
                                showDetailsInStartingWhitespace = false;
                            }
                        }
                        if (cfgChanges.changes) {
                            if (cfgChanges.wholeLine) {
                                showChanges = false;
                            }
                            else {
                                showChangesInStartingWhitespace = false;
                            }
                        }
                        break;
                    }
                }
                if (showDetails) {
                    let logCommit = undefined;
                    if (!commit.isUncommitted) {
                        logCommit = yield this.git.getLogCommit(this._uri.repoPath, this._uri.fsPath, commit.sha);
                    }
                    if (editor.document === undefined)
                        return;
                    const decoration = annotations_1.Annotations.detailsHover(logCommit || commit, this._config.defaultDateFormat);
                    decoration.range = editor.document.validateRange(new vscode_1.Range(line, showDetailsStartIndex, line, annotations_1.endOfLineIndex));
                    decorationOptions.push(decoration);
                    if (showDetailsInStartingWhitespace && showDetailsStartIndex !== 0) {
                        decorationOptions.push(annotations_1.Annotations.withRange(decoration, 0, firstNonWhitespace));
                    }
                }
                if (showChanges) {
                    const decoration = yield annotations_1.Annotations.changesHover(commit, line, this._uri, this.git);
                    if (editor.document === undefined)
                        return;
                    decoration.range = editor.document.validateRange(new vscode_1.Range(line, showChangesStartIndex, line, annotations_1.endOfLineIndex));
                    decorationOptions.push(decoration);
                    if (showChangesInStartingWhitespace && showChangesStartIndex !== 0) {
                        decorationOptions.push(annotations_1.Annotations.withRange(decoration, 0, firstNonWhitespace));
                    }
                }
            }
            if (decorationOptions.length) {
                editor.setDecorations(annotationDecoration, decorationOptions);
                this._isAnnotating = true;
            }
        });
    }
    _updateStatusBar(commit) {
        const cfg = this._config.statusBar;
        if (!cfg.enabled || this._statusBarItem === undefined)
            return;
        this._statusBarItem.text = `$(git-commit) ${gitService_1.CommitFormatter.fromTemplate(cfg.format, commit, cfg.dateFormat === null ? this._config.defaultDateFormat : cfg.dateFormat)}`;
        switch (cfg.command) {
            case configuration_1.StatusBarCommand.BlameAnnotate:
                this._statusBarItem.tooltip = 'Toggle Blame Annotations';
                break;
            case configuration_1.StatusBarCommand.ShowBlameHistory:
                this._statusBarItem.tooltip = 'Open Blame History Explorer';
                break;
            case configuration_1.StatusBarCommand.ShowFileHistory:
                this._statusBarItem.tooltip = 'Open File History Explorer';
                break;
            case configuration_1.StatusBarCommand.DiffWithPrevious:
                this._statusBarItem.command = commands_1.Commands.DiffLineWithPrevious;
                this._statusBarItem.tooltip = 'Compare Line Commit with Previous';
                break;
            case configuration_1.StatusBarCommand.DiffWithWorking:
                this._statusBarItem.command = commands_1.Commands.DiffLineWithWorking;
                this._statusBarItem.tooltip = 'Compare Line Commit with Working Tree';
                break;
            case configuration_1.StatusBarCommand.ToggleCodeLens:
                this._statusBarItem.tooltip = 'Toggle Git CodeLens';
                break;
            case configuration_1.StatusBarCommand.ShowQuickCommitDetails:
                this._statusBarItem.tooltip = 'Show Commit Details';
                break;
            case configuration_1.StatusBarCommand.ShowQuickCommitFileDetails:
                this._statusBarItem.tooltip = 'Show Line Commit Details';
                break;
            case configuration_1.StatusBarCommand.ShowQuickFileHistory:
                this._statusBarItem.tooltip = 'Show File History';
                break;
            case configuration_1.StatusBarCommand.ShowQuickCurrentBranchHistory:
                this._statusBarItem.tooltip = 'Show Branch History';
                break;
        }
        this._statusBarItem.show();
    }
}
exports.CurrentLineController = CurrentLineController;
//# sourceMappingURL=currentLineController.js.map