"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const vscode = require("vscode");
const micromatch = require("micromatch");
const styles_1 = require("./providers/styles");
const embedded_1 = require("./providers/embedded");
let output;
/**
 * Show message in iutput channel.
 */
function showOutput(msg) {
    if (!output) {
        output = vscode.window.createOutputChannel('CSSComb');
    }
    output.clear();
    output.appendLine('[CSSComb]\n');
    output.append(msg);
    output.show();
}
function getProvider(document, selection, workspace, filepath, settings) {
    const stylesProvider = new styles_1.default(document, selection, document.languageId, workspace, filepath, settings);
    const embeddedProvider = new embedded_1.default(document, document.languageId, workspace, filepath, settings);
    if (stylesProvider.isApplycable()) {
        return stylesProvider;
    }
    else if (embeddedProvider.isApplycable()) {
        return embeddedProvider;
    }
    return null;
}
function activate(context) {
    const onCommand = vscode.commands.registerTextEditorCommand('csscomb.execute', (textEditor) => {
        const document = textEditor.document;
        const selection = textEditor.selection;
        const workspace = vscode.workspace.rootPath;
        const filepath = document.uri.fsPath;
        const settings = vscode.workspace.getConfiguration().get('csscomb');
        const provider = getProvider(document, selection, workspace, filepath, settings);
        if (!provider) {
            return showOutput(`We do not support "${document.languageId}" syntax.`);
        }
        provider.format().then((blocks) => {
            textEditor.edit((builder) => {
                blocks.forEach((block) => {
                    if (block.error) {
                        showOutput(block.error.toString());
                    }
                    builder.replace(block.range, block.content);
                });
            });
        }).catch((err) => showOutput(err.stack));
    });
    const onSave = vscode.workspace.onWillSaveTextDocument((event) => {
        const document = event.document;
        const workspace = vscode.workspace.rootPath;
        const filepath = document.uri.fsPath;
        const settings = vscode.workspace.getConfiguration().get('csscomb');
        // Skip files without providers
        const provider = getProvider(document, null, workspace, filepath, settings);
        // Skip the formatting code without Editor configuration
        if (!settings || !settings.formatOnSave || !provider) {
            return null;
        }
        // Skip excluded files by Editor & CSSComb configuration file
        let excludes = [];
        if (settings && settings.ignoreFilesOnSave) {
            excludes = excludes.concat(settings.ignoreFilesOnSave);
        }
        if (typeof settings.preset === 'object' && settings.preset.exclude) {
            excludes = excludes.concat(settings.preset.exclude);
        }
        if (excludes.length !== 0) {
            const currentFile = path.relative(vscode.workspace.rootPath, event.document.fileName);
            if (micromatch([currentFile], excludes).length !== 0) {
                return null;
            }
        }
        const actions = provider.format().then((blocks) => {
            return blocks.map((block) => {
                if (block.error) {
                    showOutput(block.error.toString());
                }
                return vscode.TextEdit.replace(block.range, block.content);
            });
        }).catch((err) => showOutput(err.stack));
        event.waitUntil(actions);
    });
    context.subscriptions.push(onCommand);
    context.subscriptions.push(onSave);
}
exports.activate = activate;
