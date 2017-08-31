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
const commands_1 = require("./commands");
const constants_1 = require("./constants");
const configuration_1 = require("./configuration");
const gitService_1 = require("./gitService");
const logger_1 = require("./logger");
const moment = require("moment");
class GitRecentChangeCodeLens extends vscode_1.CodeLens {
    constructor(blame, uri, symbolKind, blameRange, isFullRange, range) {
        super(range);
        this.blame = blame;
        this.uri = uri;
        this.symbolKind = symbolKind;
        this.blameRange = blameRange;
        this.isFullRange = isFullRange;
    }
    getBlame() {
        return this.blame();
    }
}
exports.GitRecentChangeCodeLens = GitRecentChangeCodeLens;
class GitAuthorsCodeLens extends vscode_1.CodeLens {
    constructor(blame, uri, symbolKind, blameRange, isFullRange, range) {
        super(range);
        this.blame = blame;
        this.uri = uri;
        this.symbolKind = symbolKind;
        this.blameRange = blameRange;
        this.isFullRange = isFullRange;
    }
    getBlame() {
        return this.blame();
    }
}
exports.GitAuthorsCodeLens = GitAuthorsCodeLens;
class GitCodeLensProvider {
    constructor(context, git) {
        this.git = git;
        this._onDidChangeCodeLenses = new vscode_1.EventEmitter();
        this._config = vscode_1.workspace.getConfiguration().get(constants_1.ExtensionKey);
    }
    get onDidChangeCodeLenses() {
        return this._onDidChangeCodeLenses.event;
    }
    reset() {
        this._config = vscode_1.workspace.getConfiguration().get(constants_1.ExtensionKey);
        logger_1.Logger.log('Triggering a reset of the git CodeLens provider');
        this._onDidChangeCodeLenses.fire();
    }
    provideCodeLenses(document, token) {
        return __awaiter(this, void 0, void 0, function* () {
            this._documentIsDirty = document.isDirty;
            let languageLocations = this._config.codeLens.perLanguageLocations.find(_ => _.language !== undefined && _.language.toLowerCase() === document.languageId);
            if (languageLocations == null) {
                languageLocations = {
                    language: undefined,
                    locations: this._config.codeLens.locations,
                    customSymbols: this._config.codeLens.customLocationSymbols
                };
            }
            const lenses = [];
            const gitUri = yield gitService_1.GitUri.fromUri(document.uri, this.git);
            const blamePromise = this.git.getBlameForFile(gitUri);
            let blame;
            if (languageLocations.locations.length === 1 && languageLocations.locations.includes(configuration_1.CodeLensLocations.Document)) {
                blame = yield blamePromise;
                if (blame === undefined || blame.lines.length === 0)
                    return lenses;
            }
            else {
                const values = yield Promise.all([
                    blamePromise,
                    vscode_1.commands.executeCommand(constants_1.BuiltInCommands.ExecuteDocumentSymbolProvider, document.uri)
                ]);
                blame = values[0];
                if (blame === undefined || blame.lines.length === 0)
                    return lenses;
                const symbols = values[1];
                logger_1.Logger.log('GitCodeLensProvider.provideCodeLenses:', `${symbols.length} symbol(s) found`);
                symbols.forEach(sym => this._provideCodeLens(gitUri, document, sym, languageLocations, blame, lenses));
            }
            if (languageLocations.locations.includes(configuration_1.CodeLensLocations.Document) ||
                (languageLocations.locations.includes(configuration_1.CodeLensLocations.Custom) && (languageLocations.customSymbols || []).find(_ => _.toLowerCase() === 'file'))) {
                if (!lenses.find(l => l.range.start.line === 0 && l.range.end.line === 0)) {
                    const blameRange = document.validateRange(new vscode_1.Range(0, 1000000, 1000000, 1000000));
                    let blameForRangeFn = undefined;
                    if (this._documentIsDirty || this._config.codeLens.recentChange.enabled) {
                        blameForRangeFn = system_1.Functions.once(() => this.git.getBlameForRangeSync(blame, gitUri, blameRange));
                        lenses.push(new GitRecentChangeCodeLens(blameForRangeFn, gitUri, vscode_1.SymbolKind.File, blameRange, true, new vscode_1.Range(0, 0, 0, blameRange.start.character)));
                    }
                    if (this._config.codeLens.authors.enabled) {
                        if (blameForRangeFn === undefined) {
                            blameForRangeFn = system_1.Functions.once(() => this.git.getBlameForRangeSync(blame, gitUri, blameRange));
                        }
                        if (!this._documentIsDirty) {
                            lenses.push(new GitAuthorsCodeLens(blameForRangeFn, gitUri, vscode_1.SymbolKind.File, blameRange, true, new vscode_1.Range(0, 1, 0, blameRange.start.character)));
                        }
                    }
                }
            }
            return lenses;
        });
    }
    _validateSymbolAndGetBlameRange(document, symbol, languageLocation) {
        let valid = false;
        let range;
        switch (symbol.kind) {
            case vscode_1.SymbolKind.File:
                if (languageLocation.locations.includes(configuration_1.CodeLensLocations.Containers)) {
                    valid = true;
                }
                else if (languageLocation.locations.includes(configuration_1.CodeLensLocations.Custom)) {
                    valid = !!(languageLocation.customSymbols || []).find(_ => _.toLowerCase() === vscode_1.SymbolKind[symbol.kind].toLowerCase());
                }
                if (valid) {
                    range = document.validateRange(new vscode_1.Range(0, 1000000, 1000000, 1000000));
                }
                break;
            case vscode_1.SymbolKind.Package:
                if (languageLocation.locations.includes(configuration_1.CodeLensLocations.Containers)) {
                    valid = true;
                }
                else if (languageLocation.locations.includes(configuration_1.CodeLensLocations.Custom)) {
                    valid = !!(languageLocation.customSymbols || []).find(_ => _.toLowerCase() === vscode_1.SymbolKind[symbol.kind].toLowerCase());
                }
                if (valid) {
                    if (symbol.location.range.start.line === 0 && symbol.location.range.end.line === 0) {
                        range = document.validateRange(new vscode_1.Range(0, 1000000, 1000000, 1000000));
                    }
                }
                break;
            case vscode_1.SymbolKind.Class:
            case vscode_1.SymbolKind.Interface:
            case vscode_1.SymbolKind.Module:
            case vscode_1.SymbolKind.Namespace:
            case vscode_1.SymbolKind.Struct:
                if (languageLocation.locations.includes(configuration_1.CodeLensLocations.Containers)) {
                    valid = true;
                }
                break;
            case vscode_1.SymbolKind.Constructor:
            case vscode_1.SymbolKind.Enum:
            case vscode_1.SymbolKind.Function:
            case vscode_1.SymbolKind.Method:
            case vscode_1.SymbolKind.Property:
                if (languageLocation.locations.includes(configuration_1.CodeLensLocations.Blocks)) {
                    valid = true;
                }
                break;
        }
        if (!valid && languageLocation.locations.includes(configuration_1.CodeLensLocations.Custom)) {
            valid = !!(languageLocation.customSymbols || []).find(_ => _.toLowerCase() === vscode_1.SymbolKind[symbol.kind].toLowerCase());
        }
        return valid ? range || symbol.location.range : undefined;
    }
    _provideCodeLens(gitUri, document, symbol, languageLocation, blame, lenses) {
        const blameRange = this._validateSymbolAndGetBlameRange(document, symbol, languageLocation);
        if (!blameRange)
            return;
        const line = document.lineAt(symbol.location.range.start);
        if (lenses.length && lenses[lenses.length - 1].range.start.line === line.lineNumber)
            return;
        let startChar = line.range.end.character - 1;
        let blameForRangeFn = undefined;
        if (this._documentIsDirty || this._config.codeLens.recentChange.enabled) {
            blameForRangeFn = system_1.Functions.once(() => this.git.getBlameForRangeSync(blame, gitUri, blameRange));
            lenses.push(new GitRecentChangeCodeLens(blameForRangeFn, gitUri, symbol.kind, blameRange, false, line.range.with(new vscode_1.Position(line.range.start.line, startChar))));
            startChar++;
        }
        if (this._config.codeLens.authors.enabled) {
            let multiline = !blameRange.isSingleLine;
            if (!multiline && document.languageId === 'csharp') {
                switch (symbol.kind) {
                    case vscode_1.SymbolKind.File:
                        break;
                    case vscode_1.SymbolKind.Package:
                    case vscode_1.SymbolKind.Module:
                    case vscode_1.SymbolKind.Namespace:
                    case vscode_1.SymbolKind.Class:
                    case vscode_1.SymbolKind.Interface:
                    case vscode_1.SymbolKind.Constructor:
                    case vscode_1.SymbolKind.Method:
                    case vscode_1.SymbolKind.Function:
                    case vscode_1.SymbolKind.Enum:
                        multiline = true;
                        break;
                }
            }
            if (multiline) {
                if (blameForRangeFn === undefined) {
                    blameForRangeFn = system_1.Functions.once(() => this.git.getBlameForRangeSync(blame, gitUri, blameRange));
                }
                if (!this._documentIsDirty) {
                    lenses.push(new GitAuthorsCodeLens(blameForRangeFn, gitUri, symbol.kind, blameRange, false, line.range.with(new vscode_1.Position(line.range.start.line, startChar))));
                }
            }
        }
    }
    resolveCodeLens(lens, token) {
        if (lens instanceof GitRecentChangeCodeLens)
            return this._resolveGitRecentChangeCodeLens(lens, token);
        if (lens instanceof GitAuthorsCodeLens)
            return this._resolveGitAuthorsCodeLens(lens, token);
        return Promise.reject(undefined);
    }
    _resolveGitRecentChangeCodeLens(lens, token) {
        let title;
        if (this._documentIsDirty) {
            if (this._config.codeLens.recentChange.enabled && this._config.codeLens.authors.enabled) {
                title = this._config.strings.codeLens.unsavedChanges.recentChangeAndAuthors;
            }
            else if (this._config.codeLens.recentChange.enabled) {
                title = this._config.strings.codeLens.unsavedChanges.recentChangeOnly;
            }
            else {
                title = this._config.strings.codeLens.unsavedChanges.authorsOnly;
            }
            lens.command = { title: title };
            return lens;
        }
        const blame = lens.getBlame();
        if (blame === undefined)
            return lens;
        const recentCommit = system_1.Iterables.first(blame.commits.values());
        title = `${recentCommit.author}, ${moment(recentCommit.date).fromNow()}`;
        if (this._config.codeLens.debug) {
            title += ` [${vscode_1.SymbolKind[lens.symbolKind]}(${lens.range.start.character}-${lens.range.end.character}), Lines (${lens.blameRange.start.line + 1}-${lens.blameRange.end.line + 1}), Commit (${recentCommit.shortSha})]`;
        }
        switch (this._config.codeLens.recentChange.command) {
            case configuration_1.CodeLensCommand.BlameAnnotate: return this._applyBlameAnnotateCommand(title, lens, blame);
            case configuration_1.CodeLensCommand.ShowBlameHistory: return this._applyShowBlameHistoryCommand(title, lens, blame, recentCommit);
            case configuration_1.CodeLensCommand.ShowFileHistory: return this._applyShowFileHistoryCommand(title, lens, blame, recentCommit);
            case configuration_1.CodeLensCommand.DiffWithPrevious: return this._applyDiffWithPreviousCommand(title, lens, blame, recentCommit);
            case configuration_1.CodeLensCommand.ShowQuickCommitDetails: return this._applyShowQuickCommitDetailsCommand(title, lens, blame, recentCommit);
            case configuration_1.CodeLensCommand.ShowQuickCommitFileDetails: return this._applyShowQuickCommitFileDetailsCommand(title, lens, blame, recentCommit);
            case configuration_1.CodeLensCommand.ShowQuickFileHistory: return this._applyShowQuickFileHistoryCommand(title, lens, blame, recentCommit);
            case configuration_1.CodeLensCommand.ShowQuickCurrentBranchHistory: return this._applyShowQuickBranchHistoryCommand(title, lens, blame, recentCommit);
            default: return lens;
        }
    }
    _resolveGitAuthorsCodeLens(lens, token) {
        const blame = lens.getBlame();
        if (blame === undefined)
            return lens;
        const count = blame.authors.size;
        let title = `${count} ${count > 1 ? 'authors' : 'author'} (${system_1.Iterables.first(blame.authors.values()).name}${count > 1 ? ' and others' : ''})`;
        if (this._config.codeLens.debug) {
            title += ` [${vscode_1.SymbolKind[lens.symbolKind]}(${lens.range.start.character}-${lens.range.end.character}), Lines (${lens.blameRange.start.line + 1}-${lens.blameRange.end.line + 1}), Authors (${system_1.Iterables.join(system_1.Iterables.map(blame.authors.values(), _ => _.name), ', ')})]`;
        }
        switch (this._config.codeLens.authors.command) {
            case configuration_1.CodeLensCommand.BlameAnnotate: return this._applyBlameAnnotateCommand(title, lens, blame);
            case configuration_1.CodeLensCommand.ShowBlameHistory: return this._applyShowBlameHistoryCommand(title, lens, blame);
            case configuration_1.CodeLensCommand.ShowFileHistory: return this._applyShowFileHistoryCommand(title, lens, blame);
            case configuration_1.CodeLensCommand.DiffWithPrevious: return this._applyDiffWithPreviousCommand(title, lens, blame);
            case configuration_1.CodeLensCommand.ShowQuickCommitDetails: return this._applyShowQuickCommitDetailsCommand(title, lens, blame);
            case configuration_1.CodeLensCommand.ShowQuickCommitFileDetails: return this._applyShowQuickCommitFileDetailsCommand(title, lens, blame);
            case configuration_1.CodeLensCommand.ShowQuickFileHistory: return this._applyShowQuickFileHistoryCommand(title, lens, blame);
            case configuration_1.CodeLensCommand.ShowQuickCurrentBranchHistory: return this._applyShowQuickBranchHistoryCommand(title, lens, blame);
            default: return lens;
        }
    }
    _applyBlameAnnotateCommand(title, lens, blame) {
        lens.command = {
            title: title,
            command: commands_1.Commands.ToggleFileBlame,
            arguments: [vscode_1.Uri.file(lens.uri.fsPath)]
        };
        return lens;
    }
    _applyShowBlameHistoryCommand(title, lens, blame, commit) {
        let line = lens.range.start.line;
        if (commit) {
            const blameLine = commit.lines.find(_ => _.line === line);
            if (blameLine) {
                line = blameLine.originalLine;
            }
        }
        const position = lens.isFullRange ? new vscode_1.Position(1, 0) : lens.range.start;
        lens.command = {
            title: title,
            command: commands_1.Commands.ShowBlameHistory,
            arguments: [
                vscode_1.Uri.file(lens.uri.fsPath),
                {
                    line,
                    position,
                    range: lens.blameRange,
                    sha: commit && commit.sha
                }
            ]
        };
        return lens;
    }
    _applyShowFileHistoryCommand(title, lens, blame, commit) {
        let line = lens.range.start.line;
        if (commit) {
            const blameLine = commit.lines.find(_ => _.line === line);
            if (blameLine) {
                line = blameLine.originalLine;
            }
        }
        const position = lens.isFullRange ? new vscode_1.Position(1, 0) : lens.range.start;
        lens.command = {
            title: title,
            command: commands_1.Commands.ShowFileHistory,
            arguments: [
                vscode_1.Uri.file(lens.uri.fsPath),
                {
                    line,
                    position,
                    sha: commit && commit.sha
                }
            ]
        };
        return lens;
    }
    _applyDiffWithPreviousCommand(title, lens, blame, commit) {
        if (commit === undefined) {
            const blameLine = blame.allLines[lens.range.start.line];
            commit = blame.commits.get(blameLine.sha);
        }
        lens.command = {
            title: title,
            command: commands_1.Commands.DiffWithPrevious,
            arguments: [
                vscode_1.Uri.file(lens.uri.fsPath),
                {
                    commit: commit,
                    range: lens.isFullRange ? undefined : lens.blameRange
                }
            ]
        };
        return lens;
    }
    _applyShowQuickCommitDetailsCommand(title, lens, blame, commit) {
        lens.command = {
            title: title,
            command: commit !== undefined && commit.isUncommitted ? '' : configuration_1.CodeLensCommand.ShowQuickCommitDetails,
            arguments: [
                vscode_1.Uri.file(lens.uri.fsPath),
                {
                    commit,
                    sha: commit === undefined ? undefined : commit.sha
                }
            ]
        };
        return lens;
    }
    _applyShowQuickCommitFileDetailsCommand(title, lens, blame, commit) {
        lens.command = {
            title: title,
            command: commit !== undefined && commit.isUncommitted ? '' : configuration_1.CodeLensCommand.ShowQuickCommitFileDetails,
            arguments: [
                vscode_1.Uri.file(lens.uri.fsPath),
                {
                    commit,
                    sha: commit === undefined ? undefined : commit.sha
                }
            ]
        };
        return lens;
    }
    _applyShowQuickFileHistoryCommand(title, lens, blame, commit) {
        lens.command = {
            title: title,
            command: configuration_1.CodeLensCommand.ShowQuickFileHistory,
            arguments: [
                vscode_1.Uri.file(lens.uri.fsPath),
                {
                    range: lens.isFullRange ? undefined : lens.blameRange
                }
            ]
        };
        return lens;
    }
    _applyShowQuickBranchHistoryCommand(title, lens, blame, commit) {
        lens.command = {
            title: title,
            command: configuration_1.CodeLensCommand.ShowQuickCurrentBranchHistory,
            arguments: [vscode_1.Uri.file(lens.uri.fsPath)]
        };
        return lens;
    }
}
GitCodeLensProvider.selector = { scheme: constants_1.DocumentSchemes.File };
exports.GitCodeLensProvider = GitCodeLensProvider;
//# sourceMappingURL=gitCodeLensProvider.js.map