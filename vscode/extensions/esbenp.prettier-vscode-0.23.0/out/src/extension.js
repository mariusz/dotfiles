"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const PrettierEditProvider_1 = require("./PrettierEditProvider");
const errorHandler_1 = require("./errorHandler");
const utils_1 = require("./utils");
const configCacheHandler_1 = require("./configCacheHandler");
function activate(context) {
    const editProvider = new PrettierEditProvider_1.default();
    const config = utils_1.getConfig();
    const languageSelector = utils_1.allEnabledLanguages();
    const rangeLanguageSelector = [
        ...config.javascriptEnable,
        ...config.typescriptEnable,
    ];
    context.subscriptions.push(vscode_1.languages.registerDocumentRangeFormattingEditProvider(rangeLanguageSelector, editProvider), vscode_1.languages.registerDocumentFormattingEditProvider(languageSelector, editProvider), errorHandler_1.setupErrorHandler(), configCacheHandler_1.default(), ...errorHandler_1.registerDisposables());
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map