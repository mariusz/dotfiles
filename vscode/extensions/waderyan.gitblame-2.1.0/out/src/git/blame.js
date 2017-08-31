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
const blamefilefactory_1 = require("./blamefilefactory");
const editorvalidator_1 = require("../util/editorvalidator");
const property_1 = require("../util/property");
const constants_1 = require("../constants");
class GitBlame {
    constructor() {
        this.files = {};
    }
    getBlameInfo(fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.files[fileName]) {
                this.files[fileName] = blamefilefactory_1.GitBlameFileFactory.create(fileName, this.generateDisposeFunction(fileName));
            }
            return this.files[fileName].blame();
        });
    }
    getCurrentLineInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            if (editorvalidator_1.isActiveEditorValid()) {
                return this.getLineInfo(vscode_1.window.activeTextEditor.document.fileName, vscode_1.window.activeTextEditor.selection.active.line);
            }
            else {
                return GitBlame.blankCommitInfo();
            }
        });
    }
    getLineInfo(fileName, lineNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            const commitLineNumber = lineNumber + 1;
            const blameInfo = yield this.getBlameInfo(fileName);
            if (blameInfo['lines'][commitLineNumber]) {
                const hash = blameInfo['lines'][commitLineNumber];
                return blameInfo['commits'][hash];
            }
            else {
                return GitBlame.blankCommitInfo();
            }
        });
    }
    generateDisposeFunction(fileName) {
        return () => {
            delete this.files[fileName];
        };
    }
    dispose() {
        vscode_1.Disposable.from(...Object.values(this.files)).dispose();
    }
    static blankBlameInfo() {
        return {
            'commits': {},
            'lines': {}
        };
    }
    static blankCommitInfo() {
        const emptyAuthor = {
            name: '',
            mail: '',
            timestamp: 0,
            tz: ''
        };
        return {
            hash: constants_1.HASH_NO_COMMIT_GIT,
            author: emptyAuthor,
            committer: emptyAuthor,
            summary: '',
            filename: '',
            generated: true
        };
    }
    static isBlankCommit(commit) {
        return commit.hash === constants_1.HASH_NO_COMMIT_GIT;
    }
    static isGeneratedCommit(commit) {
        return commit.generated;
    }
    static internalHash(hash) {
        return hash.substr(0, property_1.Property.get(property_1.Properties.InternalHashLength));
    }
}
exports.GitBlame = GitBlame;
//# sourceMappingURL=blame.js.map