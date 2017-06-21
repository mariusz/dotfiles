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
const common_1 = require("./common");
const constants_1 = require("../constants");
const gitService_1 = require("../gitService");
const logger_1 = require("../logger");
const messages_1 = require("../messages");
const quickPicks_1 = require("../quickPicks");
const copy_paste_1 = require("copy-paste");
const searchByRegex = /^([@:#])/;
const searchByMap = new Map([
    ['@', gitService_1.GitRepoSearchBy.Author],
    [':', gitService_1.GitRepoSearchBy.Files],
    ['#', gitService_1.GitRepoSearchBy.Sha]
]);
class ShowCommitSearchCommand extends common_1.ActiveEditorCachedCommand {
    constructor(git) {
        super(common_1.Commands.ShowCommitSearch);
        this.git = git;
    }
    execute(editor, uri, args = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            uri = common_1.getCommandUri(uri, editor);
            const gitUri = uri === undefined ? undefined : yield gitService_1.GitUri.fromUri(uri, this.git);
            const repoPath = gitUri === undefined ? this.git.repoPath : gitUri.repoPath;
            if (!repoPath)
                return messages_1.Messages.showNoRepositoryWarningMessage(`Unable to show commit search`);
            if (!args.search || args.searchBy == null) {
                try {
                    if (!args.search) {
                        if (editor !== undefined && gitUri !== undefined) {
                            const line = editor.selection.active.line - gitUri.offset;
                            const blameLine = yield this.git.getBlameForLine(gitUri, line);
                            if (blameLine !== undefined) {
                                args.search = `#${blameLine.commit.shortSha}`;
                            }
                        }
                        if (!args.search) {
                            args.search = yield new Promise((resolve, reject) => {
                                copy_paste_1.paste((err, content) => resolve(err ? '' : content));
                            });
                        }
                    }
                }
                catch (ex) {
                    logger_1.Logger.error(ex, 'ShowCommitSearchCommand', 'search prefetch failed');
                }
                args.search = yield vscode_1.window.showInputBox({
                    value: args.search,
                    prompt: `Please enter a search string`,
                    placeHolder: `search by message, author (use @<name>), files (use :<pattern>), or commit id (use #<sha>)`
                });
                if (args.search === undefined)
                    return args.goBackCommand === undefined ? undefined : args.goBackCommand.execute();
                const match = searchByRegex.exec(args.search);
                if (match && match[1]) {
                    args.searchBy = searchByMap.get(match[1]);
                    args.search = args.search.substring((args.search[1] === ' ') ? 2 : 1);
                }
                else if (gitService_1.GitService.isSha(args.search)) {
                    args.searchBy = gitService_1.GitRepoSearchBy.Sha;
                }
                else {
                    args.searchBy = gitService_1.GitRepoSearchBy.Message;
                }
            }
            try {
                if (args.searchBy === undefined) {
                    args.searchBy = gitService_1.GitRepoSearchBy.Message;
                }
                const log = yield this.git.getLogForRepoSearch(repoPath, args.search, args.searchBy);
                if (log === undefined)
                    return undefined;
                let originalSearch = undefined;
                let placeHolder = undefined;
                switch (args.searchBy) {
                    case gitService_1.GitRepoSearchBy.Author:
                        originalSearch = `@${args.search}`;
                        placeHolder = `commits with author matching '${args.search}'`;
                        break;
                    case gitService_1.GitRepoSearchBy.Files:
                        originalSearch = `:${args.search}`;
                        placeHolder = `commits with files matching '${args.search}'`;
                        break;
                    case gitService_1.GitRepoSearchBy.Message:
                        originalSearch = args.search;
                        placeHolder = `commits with message matching '${args.search}'`;
                        break;
                    case gitService_1.GitRepoSearchBy.Sha:
                        originalSearch = `#${args.search}`;
                        placeHolder = `commits with id matching '${args.search}'`;
                        break;
                }
                const currentCommand = new quickPicks_1.CommandQuickPickItem({
                    label: `go back ${constants_1.GlyphChars.ArrowBack}`,
                    description: `${system_1.Strings.pad(constants_1.GlyphChars.Dash, 2, 3)} to commit search`
                }, common_1.Commands.ShowCommitSearch, [
                    uri,
                    {
                        search: originalSearch,
                        goBackCommand: args.goBackCommand
                    }
                ]);
                const pick = yield quickPicks_1.CommitsQuickPick.show(this.git, log, placeHolder, currentCommand);
                if (pick === undefined)
                    return undefined;
                if (pick instanceof quickPicks_1.CommandQuickPickItem)
                    return pick.execute();
                return vscode_1.commands.executeCommand(common_1.Commands.ShowQuickCommitDetails, new gitService_1.GitUri(pick.commit.uri, pick.commit), {
                    sha: pick.commit.sha,
                    commit: pick.commit,
                    goBackCommand: new quickPicks_1.CommandQuickPickItem({
                        label: `go back ${constants_1.GlyphChars.ArrowBack}`,
                        description: `${system_1.Strings.pad(constants_1.GlyphChars.Dash, 2, 2)} to search for ${placeHolder}`
                    }, common_1.Commands.ShowCommitSearch, [
                        uri,
                        args
                    ])
                });
            }
            catch (ex) {
                logger_1.Logger.error(ex, 'ShowCommitSearchCommand');
                return vscode_1.window.showErrorMessage(`Unable to find commits. See output channel for more details`);
            }
        });
    }
}
exports.ShowCommitSearchCommand = ShowCommitSearchCommand;
//# sourceMappingURL=showCommitSearch.js.map