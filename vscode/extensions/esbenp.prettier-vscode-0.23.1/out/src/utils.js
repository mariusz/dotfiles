"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
let currentRootPath = vscode_1.workspace.rootPath;
function onWorkspaceRootChange(cb) {
    return vscode_1.workspace.onDidChangeConfiguration(() => {
        if (currentRootPath !== vscode_1.workspace.rootPath) {
            cb(vscode_1.workspace.rootPath);
            currentRootPath = vscode_1.workspace.rootPath;
        }
    });
}
exports.onWorkspaceRootChange = onWorkspaceRootChange;
function getConfig() {
    return vscode_1.workspace.getConfiguration('prettier');
}
exports.getConfig = getConfig;
function allEnabledLanguages() {
    const config = getConfig();
    return [
        ...config.javascriptEnable,
        ...config.typescriptEnable,
        ...config.cssEnable,
        ...config.jsonEnable,
        ...config.graphqlEnable,
    ];
}
exports.allEnabledLanguages = allEnabledLanguages;
//# sourceMappingURL=utils.js.map