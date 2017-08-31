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
const Path = require("path");
const FS = require("fs");
const execcommand_1 = require("../util/execcommand");
const errorhandler_1 = require("../util/errorhandler");
const gitcommand_1 = require("../util/gitcommand");
const blame_1 = require("./blame");
const blamefilebase_1 = require("./blamefilebase");
const stream_1 = require("./stream");
const view_1 = require("../view");
const constants_1 = require("../constants");
class GitBlameFile extends blamefilebase_1.GitBlameFileBase {
    constructor(fileName, disposeCallback = () => { }) {
        super(fileName, disposeCallback);
        this.fileSystemWatcher = this.setupWatcher();
    }
    getGitWorkTree() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.workTree) {
                return this.workTree;
            }
            this.workTreePromise = this.workTreePromise || this.findWorkTree(this.fileName);
            this.workTree = yield this.workTreePromise;
            return this.workTree;
        });
    }
    setupWatcher() {
        const fileWatcherOptions = {
            persistent: false
        };
        return FS.watch(this.fileName.fsPath, fileWatcherOptions, this.makeHandleFileWatchEvent());
    }
    makeHandleFileWatchEvent() {
        return (eventType, fileName) => {
            if (eventType === constants_1.FS_EVENT_TYPE_REMOVE) {
                this.dispose();
            }
            else if (eventType === constants_1.FS_EVENT_TYPE_CHANGE) {
                this.changed();
            }
        };
    }
    findWorkTree(path) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.executeGitRevParseCommandInPath('--show-toplevel', path);
        });
    }
    executeGitRevParseCommandInPath(command, path) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentDirectory = Path.dirname(path.fsPath);
            const gitCommand = yield gitcommand_1.getGitCommand();
            const gitExecArguments = ['rev-parse', command];
            const gitExecOptions = {
                cwd: currentDirectory
            };
            const gitRev = yield execcommand_1.execute(gitCommand, gitExecArguments, gitExecOptions);
            const cleanGitRev = gitRev.trim();
            if (cleanGitRev === '') {
                return '';
            }
            else if (cleanGitRev === '.git') {
                return Path.join(currentDirectory, '.git');
            }
            else {
                return Path.normalize(cleanGitRev);
            }
        });
    }
    changed() {
        super.changed();
        delete this.blameInfoPromise;
    }
    blame() {
        return __awaiter(this, void 0, void 0, function* () {
            view_1.StatusBarView.getInstance().startProgress();
            if (this.blameInfoPromise) {
                return this.blameInfoPromise;
            }
            else {
                return this.findBlameInfo();
            }
        });
    }
    findBlameInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.blameInfoPromise = new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const workTree = yield this.getGitWorkTree();
                if (workTree) {
                    const blameInfo = blame_1.GitBlame.blankBlameInfo();
                    this.gitBlameStream = new stream_1.GitBlameStream(this.fileName, workTree);
                    const gitOver = this.gitStreamOver(this.gitBlameStream, reject, resolve, blameInfo);
                    this.gitBlameStream.on('commit', this.gitAddCommit(blameInfo));
                    this.gitBlameStream.on('line', this.gitAddLine(blameInfo));
                    this.gitBlameStream.on('error', gitOver);
                    this.gitBlameStream.on('end', gitOver);
                }
                else {
                    view_1.StatusBarView.getInstance().stopProgress();
                    this.startCacheInterval();
                    errorhandler_1.ErrorHandler.getInstance().logInfo(`File "${this.fileName.fsPath}" is not a decendant of a git repository`);
                    resolve(blame_1.GitBlame.blankBlameInfo());
                }
            }));
        });
    }
    gitAddCommit(blameInfo) {
        return (internalHash, data) => {
            blameInfo['commits'][internalHash] = data;
        };
    }
    gitAddLine(blameInfo) {
        return (line, gitCommitHash) => {
            blameInfo['lines'][line] = gitCommitHash;
        };
    }
    gitStreamOver(gitStream, reject, resolve, blameInfo) {
        return (err) => {
            gitStream.removeAllListeners();
            view_1.StatusBarView.getInstance().stopProgress();
            this.startCacheInterval();
            if (err) {
                errorhandler_1.ErrorHandler.getInstance().logError(err);
                resolve(blame_1.GitBlame.blankBlameInfo());
            }
            else {
                errorhandler_1.ErrorHandler.getInstance().logInfo(`Blamed file "${this.fileName.fsPath}" and found ${Object.keys(blameInfo.commits).length} commits`);
                resolve(blameInfo);
            }
        };
    }
    dispose() {
        super.dispose();
        if (this.gitBlameStream) {
            this.gitBlameStream.terminate();
            delete this.gitBlameStream;
        }
        this.fileSystemWatcher.close();
    }
}
exports.GitBlameFile = GitBlameFile;
//# sourceMappingURL=blamefile.js.map