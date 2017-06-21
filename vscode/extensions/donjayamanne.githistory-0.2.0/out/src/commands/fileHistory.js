"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const vscode = require('vscode');
const gitPaths_1 = require('../helpers/gitPaths');
const historyUtil = require('../helpers/historyUtils');
const path = require('path');
const tmp = require('tmp');
const he_1 = require('he');
const logger = require('../logger');
const logParser_1 = require('../helpers/logParser');
const fs = require('fs');
function activate(context) {
    let disposable = vscode.commands.registerCommand('git.viewFileHistory', (fileUri) => {
        let fileName = '';
        if (fileUri && fileUri.fsPath) {
            fileName = fileUri.fsPath;
        }
        else {
            if (!vscode.window.activeTextEditor || !vscode.window.activeTextEditor.document) {
                return;
            }
            fileName = vscode.window.activeTextEditor.document.fileName;
        }
        run(fileName);
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
vscode.commands.registerCommand('git.viewFileCommitDetails', (sha1, relativeFilePath, isoStrictDateTime) => __awaiter(this, void 0, void 0, function* () {
    try {
        relativeFilePath = he_1.decode(relativeFilePath);
        const fileName = path.join(vscode.workspace.rootPath, relativeFilePath);
        const gitRepositoryPath = yield gitPaths_1.getGitRepositoryPath(vscode.workspace.rootPath);
        const data = yield historyUtil.getFileHistoryBefore(gitRepositoryPath, relativeFilePath, isoStrictDateTime);
        const historyItem = data.find(data => data.sha1 === sha1);
        const previousItems = data.filter(data => data.sha1 !== sha1);
        historyItem.previousSha1 = previousItems.length === 0 ? '' : previousItems[0].sha1;
        const item = {
            label: '',
            description: '',
            data: historyItem,
            isLast: historyItem.previousSha1.length === 0
        };
        onItemSelected(item, fileName, relativeFilePath);
    }
    catch (error) {
        logger.logError(error);
    }
}));
function run(fileName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const gitRepositoryPath = yield gitPaths_1.getGitRepositoryPath(fileName);
            const relativeFilePath = path.relative(gitRepositoryPath, fileName);
            const fileHistory = yield historyUtil.getFileHistory(gitRepositoryPath, relativeFilePath);
            if (fileHistory.length === 0) {
                vscode.window.showInformationMessage(`There are no history items for this item '${relativeFilePath}'.`);
                return;
            }
            let itemPickList = fileHistory.map(item => {
                let dateTime = logParser_1.formatDate(new Date(Date.parse(item.author_date)));
                let label = vscode.workspace.getConfiguration('gitHistory').get('displayLabel');
                let description = vscode.workspace.getConfiguration('gitHistory').get('displayDescription');
                let detail = vscode.workspace.getConfiguration('gitHistory').get('displayDetail');
                const firstLineofMessage = item.message.split('\n')[0];
                label = label.replace('${date}', dateTime).replace('${name}', item.author_name)
                    .replace('${email}', item.author_email).replace('${message}', firstLineofMessage);
                description = description.replace('${date}', dateTime).replace('${name}', item.author_name)
                    .replace('${email}', item.author_email).replace('${message}', firstLineofMessage);
                detail = detail.replace('${date}', dateTime).replace('${name}', item.author_name)
                    .replace('${email}', item.author_email).replace('${message}', firstLineofMessage);
                return { label: label, description: description, detail: detail, data: item };
            });
            itemPickList.forEach((item, index) => {
                if (index === (itemPickList.length - 1)) {
                    item.isLast = true;
                }
                else {
                    item.data.previousSha1 = fileHistory[index + 1].sha1;
                }
            });
            vscode.window.showQuickPick(itemPickList, { placeHolder: '', matchOnDescription: true }).then(item => {
                if (!item) {
                    return;
                }
                onItemSelected(item, fileName, relativeFilePath);
            });
        }
        catch (error) {
            logger.logError(error);
        }
    });
}
exports.run = run;
function onItemSelected(item, fileName, relativeFilePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const commit = item.data;
        const getThisFile = getFile(commit.sha1, relativeFilePath);
        const getPreviousFile = getFile(commit.previousSha1, relativeFilePath);
        const thisFile = yield getThisFile;
        const previousFile = yield getPreviousFile;
        const itemPickList = [];
        itemPickList.push({ label: 'View Change Log', description: 'Author, committer and message' });
        if (thisFile !== 'fileUnavailable') {
            itemPickList.push({ label: 'View File Contents', description: '' });
        }
        if (thisFile !== 'fileUnavailable' && fs.existsSync(fileName)) {
            itemPickList.push({ label: 'Compare against workspace file', description: '' });
        }
        if (previousFile !== 'fileUnavailable' && thisFile !== 'fileUnavailable') {
            itemPickList.push({ label: 'Compare against previous version', description: '' });
        }
        vscode.window.showQuickPick(itemPickList, { placeHolder: item.label, matchOnDescription: true }).then(cmd => {
            if (!cmd) {
                return;
            }
            const data = item.data;
            if (cmd.label === 'View Change Log') {
                viewLog(data);
                return;
            }
            if (cmd.label === 'View File Contents') {
                viewFile(thisFile);
                return;
            }
            if (cmd.label === 'Compare against workspace file') {
                diffFiles(fileName, thisFile, commit.sha1, fileName, '');
                return;
            }
            if (cmd.label === 'Compare against previous version') {
                diffFiles(fileName, previousFile, commit.previousSha1, thisFile, commit.sha1);
                return;
            }
        });
    });
}
function viewFile(fileName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            vscode.workspace.openTextDocument(fileName).then(document => {
                vscode.window.showTextDocument(document);
            });
        }
        catch (error) {
            logger.logError(error);
        }
    });
}
function viewLog(details) {
    let authorDate = new Date(Date.parse(details.author_date)).toLocaleString();
    let committerDate = new Date(Date.parse(details.commit_date)).toLocaleString();
    let log = `sha1 : ${details.sha1}\n` +
        `Author : ${details.author_name} <${details.author_email}>\n` +
        `Author Date : ${authorDate}\n` +
        `Committer Name : ${details.committer_name} <${details.committer_email}>\n` +
        `Commit Date : ${committerDate}\n` +
        `Message : ${details.message}`;
    logger.showInfo(log);
}
function diffFiles(fileName, sourceFile, sourceSha1, destinationFile, destinationSha1) {
    try {
        const sourceFormattedSha1 = `(${sourceSha1.substring(0, 7)})`;
        const destinationFormattedSha1 = destinationSha1 !== '' ? `(${destinationSha1.substring(0, 7)})` : '';
        vscode.commands.executeCommand('vscode.diff', vscode.Uri.file(sourceFile), vscode.Uri.file(destinationFile), `${path.basename(fileName)} ${sourceFormattedSha1} ↔ ${path.basename(fileName)} ${destinationFormattedSha1}`);
    }
    catch (error) {
        logger.logError(error);
    }
}
function getFile(commitSha1, localFilePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const rootDir = vscode.workspace.rootPath;
        return new Promise((resolve, reject) => {
            if (commitSha1 === undefined) {
                resolve('fileUnavailable');
                return;
            }
            let ext = path.extname(localFilePath);
            tmp.file({ postfix: ext }, function _tempFileCreated(err, tmpFilePath, fd, cleanupCallback) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        reject(err);
                        return;
                    }
                    try {
                        const targetFile = yield historyUtil.writeFile(rootDir, commitSha1, localFilePath, tmpFilePath);
                        resolve(targetFile);
                    }
                    catch (ex) {
                        logger.logError(ex);
                        reject(ex);
                    }
                });
            });
        });
    });
}
//# sourceMappingURL=fileHistory.js.map