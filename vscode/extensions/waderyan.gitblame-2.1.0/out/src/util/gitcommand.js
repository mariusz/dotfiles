"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Path = require("path");
const FS = require("fs");
const vscode_1 = require("vscode");
const errorhandler_1 = require("./errorhandler");
const constants_1 = require("../constants");
function getGitCommand() {
    const gitConfig = vscode_1.workspace.getConfiguration('git');
    const command = gitConfig.get('path', constants_1.GIT_COMMAND_IN_PATH) || constants_1.GIT_COMMAND_IN_PATH;
    const promise = new Promise((resolve, reject) => {
        if (command === constants_1.GIT_COMMAND_IN_PATH) {
            resolve(command);
        }
        const commandPath = Path.normalize(command);
        FS.access(commandPath, FS.constants.X_OK, (err) => {
            if (err) {
                errorhandler_1.ErrorHandler.getInstance().logError(new Error(`Can not execute "${commandPath}" (your git.path property) falling back to "${constants_1.GIT_COMMAND_IN_PATH}"`));
                resolve(constants_1.GIT_COMMAND_IN_PATH);
            }
            else {
                resolve(commandPath);
            }
        });
    });
    return promise;
}
exports.getGitCommand = getGitCommand;
//# sourceMappingURL=gitcommand.js.map