"use strict";
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
const errorHandler_1 = require("./errorHandler");
const utils_1 = require("./utils");
const requirePkg_1 = require("./requirePkg");
const semver = require("semver");
const bundledPrettier = require('prettier');
let errorShown = false;
const PARSER_SINCE = {
    babylon: '0.0.0',
    flow: '0.0.0',
    typescript: '1.4.0-beta',
    postcss: '1.4.0-beta',
    json: '1.5.0',
    graphql: '1.5.0',
};
utils_1.onWorkspaceRootChange(() => {
    errorShown = false;
});
function parserExists(parser, prettier) {
    return semver.gte(prettier.version, PARSER_SINCE[parser]);
}
function format(text, { fileName, languageId }, customOptions) {
    return __awaiter(this, void 0, void 0, function* () {
        const vscodeConfig = vscode_1.workspace.getConfiguration('prettier');
        let trailingComma = vscodeConfig.trailingComma;
        if (trailingComma === true) {
            trailingComma = 'es5';
        }
        else if (trailingComma === false) {
            trailingComma = 'none';
        }
        let parser = vscodeConfig.parser;
        let isNonJsParser = false;
        if (vscodeConfig.typescriptEnable.includes(languageId)) {
            parser = 'typescript';
            isNonJsParser = true;
        }
        if (vscodeConfig.cssEnable.includes(languageId)) {
            parser = 'postcss';
            isNonJsParser = true;
        }
        if (vscodeConfig.jsonEnable.includes(languageId)) {
            parser = 'json';
            isNonJsParser = true;
            trailingComma = 'none';
        }
        if (vscodeConfig.graphqlEnable.includes(languageId)) {
            parser = 'graphql';
            isNonJsParser = true;
        }
        const fileOptions = yield bundledPrettier.resolveConfig(fileName);
        const prettierOptions = Object.assign({
            printWidth: vscodeConfig.printWidth,
            tabWidth: vscodeConfig.tabWidth,
            singleQuote: vscodeConfig.singleQuote,
            trailingComma,
            bracketSpacing: vscodeConfig.bracketSpacing,
            jsxBracketSameLine: vscodeConfig.jsxBracketSameLine,
            parser: parser,
            semi: vscodeConfig.semi,
            useTabs: vscodeConfig.useTabs,
        }, customOptions, fileOptions);
        if (vscodeConfig.eslintIntegration && !isNonJsParser) {
            return errorHandler_1.safeExecution(() => {
                const prettierEslint = require('prettier-eslint');
                return prettierEslint({
                    text,
                    filePath: fileName,
                    fallbackPrettierOptions: prettierOptions,
                });
            }, text, fileName);
        }
        const prettier = requirePkg_1.requireLocalPkg(fileName, 'prettier');
        if (isNonJsParser && !parserExists(parser, prettier)) {
            return errorHandler_1.safeExecution(() => {
                const warningMessage = `prettier@${prettier.version} doesn't support ${languageId}. ` +
                    `Falling back to bundled prettier@${bundledPrettier.version}.`;
                errorHandler_1.addToOutput(warningMessage);
                if (errorShown === false) {
                    vscode_1.window.showWarningMessage(warningMessage);
                    errorShown = true;
                }
                return bundledPrettier.format(text, prettierOptions);
            }, text, fileName);
        }
        return errorHandler_1.safeExecution(() => prettier.format(text, prettierOptions), text, fileName);
    });
}
function fullDocumentRange(document) {
    const lastLineId = document.lineCount - 1;
    return new vscode_1.Range(0, 0, lastLineId, document.lineAt(lastLineId).text.length);
}
class PrettierEditProvider {
    provideDocumentRangeFormattingEdits(document, range, options, token) {
        return format(document.getText(), document, {
            rangeStart: document.offsetAt(range.start),
            rangeEnd: document.offsetAt(range.end),
        }).then(code => [vscode_1.TextEdit.replace(fullDocumentRange(document), code)]);
    }
    provideDocumentFormattingEdits(document, options, token) {
        return format(document.getText(), document, {}).then(code => [
            vscode_1.TextEdit.replace(fullDocumentRange(document), code),
        ]);
    }
}
exports.default = PrettierEditProvider;
//# sourceMappingURL=PrettierEditProvider.js.map