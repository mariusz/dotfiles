'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const commands_1 = require("./commands");
var constants_1 = require("./constants");
exports.ExtensionKey = constants_1.ExtensionKey;
exports.CodeLensCommand = {
    BlameAnnotate: commands_1.Commands.ToggleFileBlame,
    ShowBlameHistory: commands_1.Commands.ShowBlameHistory,
    ShowFileHistory: commands_1.Commands.ShowFileHistory,
    DiffWithPrevious: commands_1.Commands.DiffWithPrevious,
    ShowQuickCommitDetails: commands_1.Commands.ShowQuickCommitDetails,
    ShowQuickCommitFileDetails: commands_1.Commands.ShowQuickCommitFileDetails,
    ShowQuickFileHistory: commands_1.Commands.ShowQuickFileHistory,
    ShowQuickCurrentBranchHistory: commands_1.Commands.ShowQuickCurrentBranchHistory
};
exports.CodeLensLocations = {
    Document: 'document',
    Containers: 'containers',
    Blocks: 'blocks',
    Custom: 'custom'
};
exports.LineHighlightLocations = {
    Gutter: 'gutter',
    Line: 'line',
    OverviewRuler: 'overviewRuler'
};
exports.StatusBarCommand = {
    BlameAnnotate: commands_1.Commands.ToggleFileBlame,
    ShowBlameHistory: commands_1.Commands.ShowBlameHistory,
    ShowFileHistory: commands_1.Commands.ShowFileHistory,
    DiffWithPrevious: commands_1.Commands.DiffWithPrevious,
    DiffWithWorking: commands_1.Commands.DiffWithWorking,
    ToggleCodeLens: commands_1.Commands.ToggleCodeLens,
    ShowQuickCommitDetails: commands_1.Commands.ShowQuickCommitDetails,
    ShowQuickCommitFileDetails: commands_1.Commands.ShowQuickCommitFileDetails,
    ShowQuickFileHistory: commands_1.Commands.ShowQuickFileHistory,
    ShowQuickCurrentBranchHistory: commands_1.Commands.ShowQuickCurrentBranchHistory
};
exports.themeDefaults = {
    annotations: {
        file: {
            gutter: {
                separateLines: true,
                dark: {
                    backgroundColor: null,
                    foregroundColor: 'rgb(190, 190, 190)',
                    uncommittedForegroundColor: null
                },
                light: {
                    backgroundColor: null,
                    foregroundColor: 'rgb(116, 116, 116)',
                    uncommittedForegroundColor: null
                }
            }
        },
        line: {
            trailing: {
                dark: {
                    backgroundColor: null,
                    foregroundColor: 'rgba(153, 153, 153, 0.35)'
                },
                light: {
                    backgroundColor: null,
                    foregroundColor: 'rgba(153, 153, 153, 0.35)'
                }
            }
        }
    },
    lineHighlight: {
        dark: {
            backgroundColor: 'rgba(0, 188, 242, 0.2)',
            overviewRulerColor: 'rgba(0, 188, 242, 0.6)'
        },
        light: {
            backgroundColor: 'rgba(0, 188, 242, 0.2)',
            overviewRulerColor: 'rgba(0, 188, 242, 0.6)'
        }
    }
};
//# sourceMappingURL=configuration.js.map