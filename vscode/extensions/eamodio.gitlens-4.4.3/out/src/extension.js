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
const annotationController_1 = require("./annotations/annotationController");
const commands_1 = require("./commands");
const commands_2 = require("./commands");
const commands_3 = require("./commands");
const commands_4 = require("./commands");
const commands_5 = require("./commands");
const commands_6 = require("./commands");
const commands_7 = require("./commands");
const commands_8 = require("./commands");
const commands_9 = require("./commands");
const commands_10 = require("./commands");
const commands_11 = require("./commands");
const commands_12 = require("./commands");
const commands_13 = require("./commands");
const configuration_1 = require("./configuration");
const constants_1 = require("./constants");
const currentLineController_1 = require("./currentLineController");
const gitContentProvider_1 = require("./gitContentProvider");
const stashExplorer_1 = require("./views/stashExplorer");
const gitRevisionCodeLensProvider_1 = require("./gitRevisionCodeLensProvider");
const gitService_1 = require("./gitService");
const keyboard_1 = require("./keyboard");
const logger_1 = require("./logger");
const messages_1 = require("./messages");
const telemetry_1 = require("./telemetry");
function activate(context) {
    return __awaiter(this, void 0, void 0, function* () {
        logger_1.Logger.configure(context);
        messages_1.Messages.configure(context);
        telemetry_1.Telemetry.configure(constants_1.ApplicationInsightsKey);
        const gitlens = vscode_1.extensions.getExtension(constants_1.QualifiedExtensionId);
        const gitlensVersion = gitlens.packageJSON.version;
        const rootPath = vscode_1.workspace.rootPath && vscode_1.workspace.rootPath.replace(/\\/g, '/');
        logger_1.Logger.log(`GitLens(v${gitlensVersion}) active: ${rootPath}`);
        const cfg = vscode_1.workspace.getConfiguration().get(constants_1.ExtensionKey);
        const gitPath = cfg.advanced.git;
        try {
            yield gitService_1.GitService.getGitPath(gitPath);
        }
        catch (ex) {
            logger_1.Logger.error(ex, 'Extension.activate');
            if (ex.message.includes('Unable to find git')) {
                yield vscode_1.window.showErrorMessage(`GitLens was unable to find Git. Please make sure Git is installed. Also ensure that Git is either in the PATH, or that 'gitlens.advanced.git' is pointed to its installed location.`);
            }
            constants_1.setCommandContext(constants_1.CommandContext.Enabled, false);
            return;
        }
        const repoPath = yield gitService_1.GitService.getRepoPath(rootPath);
        const gitVersion = gitService_1.GitService.getGitVersion();
        logger_1.Logger.log(`Git version: ${gitVersion}`);
        const telemetryContext = Object.create(null);
        telemetryContext.version = gitlensVersion;
        telemetryContext['git.version'] = gitVersion;
        telemetry_1.Telemetry.setContext(telemetryContext);
        yield migrateSettings(context);
        notifyOnUnsupportedGitVersion(context, gitVersion);
        notifyOnNewGitLensVersion(context, gitlensVersion);
        yield context.globalState.update(constants_1.WorkspaceState.GitLensVersion, gitlensVersion);
        const git = new gitService_1.GitService(context, repoPath);
        context.subscriptions.push(git);
        const gitContextTracker = new gitService_1.GitContextTracker(git);
        context.subscriptions.push(gitContextTracker);
        context.subscriptions.push(vscode_1.workspace.registerTextDocumentContentProvider(gitContentProvider_1.GitContentProvider.scheme, new gitContentProvider_1.GitContentProvider(context, git)));
        context.subscriptions.push(vscode_1.languages.registerCodeLensProvider(gitRevisionCodeLensProvider_1.GitRevisionCodeLensProvider.selector, new gitRevisionCodeLensProvider_1.GitRevisionCodeLensProvider(context, git)));
        const annotationController = new annotationController_1.AnnotationController(context, git, gitContextTracker);
        context.subscriptions.push(annotationController);
        const currentLineController = new currentLineController_1.CurrentLineController(context, git, gitContextTracker, annotationController);
        context.subscriptions.push(currentLineController);
        context.subscriptions.push(new keyboard_1.Keyboard());
        context.subscriptions.push(vscode_1.window.registerTreeDataProvider('gitlens.stashExplorer', new stashExplorer_1.StashExplorer(context, git)));
        context.subscriptions.push(vscode_1.commands.registerTextEditorCommand('gitlens.computingFileAnnotations', () => { }));
        context.subscriptions.push(new commands_1.CloseUnchangedFilesCommand(git));
        context.subscriptions.push(new commands_1.OpenChangedFilesCommand(git));
        context.subscriptions.push(new commands_3.CopyMessageToClipboardCommand(git));
        context.subscriptions.push(new commands_3.CopyShaToClipboardCommand(git));
        context.subscriptions.push(new commands_4.DiffDirectoryCommand(git));
        context.subscriptions.push(new commands_4.DiffLineWithPreviousCommand(git));
        context.subscriptions.push(new commands_4.DiffLineWithWorkingCommand(git));
        context.subscriptions.push(new commands_4.DiffWithBranchCommand(git));
        context.subscriptions.push(new commands_4.DiffWithNextCommand(git));
        context.subscriptions.push(new commands_4.DiffWithPreviousCommand(git));
        context.subscriptions.push(new commands_4.DiffWithRevisionCommand(git));
        context.subscriptions.push(new commands_4.DiffWithWorkingCommand(git));
        context.subscriptions.push(new commands_2.OpenBranchInRemoteCommand(git));
        context.subscriptions.push(new commands_2.OpenCommitInRemoteCommand(git));
        context.subscriptions.push(new commands_2.OpenFileInRemoteCommand(git));
        context.subscriptions.push(new commands_2.OpenInRemoteCommand());
        context.subscriptions.push(new commands_2.OpenRepoInRemoteCommand(git));
        context.subscriptions.push(new commands_6.ClearFileAnnotationsCommand(annotationController));
        context.subscriptions.push(new commands_6.ShowFileBlameCommand(annotationController));
        context.subscriptions.push(new commands_6.ShowLineBlameCommand(currentLineController));
        context.subscriptions.push(new commands_6.ToggleFileBlameCommand(annotationController));
        context.subscriptions.push(new commands_6.ToggleFileRecentChangesCommand(annotationController));
        context.subscriptions.push(new commands_6.ToggleLineBlameCommand(currentLineController));
        context.subscriptions.push(new commands_5.ResetSuppressedWarningsCommand(context));
        context.subscriptions.push(new commands_7.ShowBlameHistoryCommand(git));
        context.subscriptions.push(new commands_7.ShowFileHistoryCommand(git));
        context.subscriptions.push(new commands_8.ShowLastQuickPickCommand());
        context.subscriptions.push(new commands_9.ShowQuickBranchHistoryCommand(git));
        context.subscriptions.push(new commands_9.ShowQuickCurrentBranchHistoryCommand(git));
        context.subscriptions.push(new commands_10.ShowQuickCommitDetailsCommand(git));
        context.subscriptions.push(new commands_10.ShowQuickCommitFileDetailsCommand(git));
        context.subscriptions.push(new commands_10.ShowCommitSearchCommand(git));
        context.subscriptions.push(new commands_9.ShowQuickFileHistoryCommand(git));
        context.subscriptions.push(new commands_11.ShowQuickRepoStatusCommand(git));
        context.subscriptions.push(new commands_11.ShowQuickStashListCommand(git));
        context.subscriptions.push(new commands_12.StashApplyCommand(git));
        context.subscriptions.push(new commands_12.StashDeleteCommand(git));
        context.subscriptions.push(new commands_12.StashSaveCommand(git));
        context.subscriptions.push(new commands_13.ToggleCodeLensCommand(git));
    });
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
function migrateSettings(context) {
    return __awaiter(this, void 0, void 0, function* () {
        const previousVersion = context.globalState.get(constants_1.WorkspaceState.GitLensVersion);
        if (previousVersion === undefined)
            return;
        const [major] = previousVersion.split('.');
        if (parseInt(major, 10) >= 4)
            return;
        try {
            const cfg = vscode_1.workspace.getConfiguration(constants_1.ExtensionKey);
            const prevCfg = vscode_1.workspace.getConfiguration().get(constants_1.ExtensionKey);
            if (prevCfg.blame !== undefined && prevCfg.blame.annotation !== undefined) {
                switch (prevCfg.blame.annotation.activeLine) {
                    case 'off':
                        yield cfg.update('blame.line.enabled', false, true);
                        break;
                    case 'hover':
                        yield cfg.update('blame.line.annotationType', currentLineController_1.LineAnnotationType.Hover, true);
                        break;
                }
                if (prevCfg.blame.annotation.activeLineDarkColor != null) {
                    yield cfg.update('theme.annotations.line.trailing.dark.foregroundColor', prevCfg.blame.annotation.activeLineDarkColor, true);
                }
                if (prevCfg.blame.annotation.activeLineLightColor != null) {
                    yield cfg.update('theme.annotations.line.trailing.light.foregroundColor', prevCfg.blame.annotation.activeLineLightColor, true);
                }
                switch (prevCfg.blame.annotation.highlight) {
                    case 'none':
                        yield cfg.update('blame.file.lineHighlight.enabled', false);
                        break;
                    case 'gutter':
                        yield cfg.update('blame.file.lineHighlight.locations', [configuration_1.LineHighlightLocations.Gutter, configuration_1.LineHighlightLocations.OverviewRuler], true);
                        break;
                    case 'line':
                        yield cfg.update('blame.file.lineHighlight.locations', [configuration_1.LineHighlightLocations.Line, configuration_1.LineHighlightLocations.OverviewRuler], true);
                        break;
                    case 'both':
                }
                if (prevCfg.blame.annotation.dateFormat != null) {
                    yield cfg.update('annotations.file.gutter.dateFormat', prevCfg.blame.annotation.dateFormat, true);
                    yield cfg.update('annotations.line.trailing.dateFormat', prevCfg.blame.annotation.dateFormat, true);
                }
            }
            if (prevCfg.codeLens !== undefined) {
                switch (prevCfg.codeLens.visibility) {
                    case 'ondemand':
                    case 'off':
                        yield cfg.update('codeLens.enabled', false);
                }
                switch (prevCfg.codeLens.location) {
                    case 'all':
                        yield cfg.update('codeLens.locations', [configuration_1.CodeLensLocations.Document, configuration_1.CodeLensLocations.Containers, configuration_1.CodeLensLocations.Blocks], true);
                        break;
                    case 'document+containers':
                        yield cfg.update('codeLens.locations', [configuration_1.CodeLensLocations.Document, configuration_1.CodeLensLocations.Containers], true);
                        break;
                    case 'document':
                        yield cfg.update('codeLens.locations', [configuration_1.CodeLensLocations.Document], true);
                        break;
                    case 'custom':
                        yield cfg.update('codeLens.locations', [configuration_1.CodeLensLocations.Custom], true);
                        break;
                }
                if (prevCfg.codeLens.locationCustomSymbols != null) {
                    yield cfg.update('codeLens.customLocationSymbols', prevCfg.codeLens.locationCustomSymbols, true);
                }
            }
            if ((prevCfg.menus && prevCfg.menus.diff && prevCfg.menus.diff.enabled) === false) {
                yield cfg.update('advanced.menus', {
                    editorContext: {
                        blame: true,
                        copy: true,
                        details: true,
                        fileDiff: false,
                        history: true,
                        lineDiff: false,
                        remote: true
                    },
                    editorTitle: {
                        blame: true,
                        fileDiff: false,
                        history: true,
                        remote: true,
                        status: true
                    },
                    editorTitleContext: {
                        blame: true,
                        fileDiff: false,
                        history: true,
                        remote: true
                    },
                    explorerContext: {
                        fileDiff: false,
                        history: true,
                        remote: true
                    }
                }, true);
            }
            switch (prevCfg.statusBar && prevCfg.statusBar.date) {
                case 'off':
                    yield cfg.update('statusBar.format', '${author}', true);
                    break;
                case 'absolute':
                    yield cfg.update('statusBar.format', '${author}, ${date}', true);
                    break;
            }
        }
        catch (ex) {
            logger_1.Logger.error(ex, 'migrateSettings');
        }
        finally {
            vscode_1.window.showInformationMessage(`GitLens v4 adds many new settings and removes a few old ones, so please review your settings to ensure they are configured properly.`);
        }
    });
}
function notifyOnNewGitLensVersion(context, version) {
    return __awaiter(this, void 0, void 0, function* () {
        if (context.globalState.get(messages_1.SuppressedKeys.UpdateNotice, false))
            return;
        const previousVersion = context.globalState.get(constants_1.WorkspaceState.GitLensVersion);
        if (previousVersion === undefined) {
            logger_1.Logger.log(`GitLens first-time install`);
            yield messages_1.Messages.showWelcomeMessage();
            return;
        }
        logger_1.Logger.log(`GitLens upgraded from v${previousVersion} to v${version}`);
        const [major, minor] = version.split('.');
        const [prevMajor, prevMinor] = previousVersion.split('.');
        if (major === prevMajor && minor === prevMinor)
            return;
        if (major < prevMajor || (major === prevMajor && minor < prevMinor))
            return;
        yield messages_1.Messages.showUpdateMessage(version);
    });
}
function notifyOnUnsupportedGitVersion(context, version) {
    return __awaiter(this, void 0, void 0, function* () {
        if (gitService_1.GitService.validateGitVersion(2, 2))
            return;
        yield messages_1.Messages.showUnsupportedGitVersionErrorMessage(version);
    });
}
//# sourceMappingURL=extension.js.map