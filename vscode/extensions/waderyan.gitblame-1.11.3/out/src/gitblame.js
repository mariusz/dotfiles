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
const errorhandler_1 = require("./errorhandler");
const gitblamefile_1 = require("./gitblamefile");
class GitBlame {
    constructor() {
        this.files = {};
        this.blamed = {};
    }
    getBlameInfo(fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof this.files[fileName] === 'undefined') {
                this.files[fileName] = new gitblamefile_1.GitBlameFile(fileName, this.generateDisposeFunction(fileName));
            }
            try {
                return yield this.files[fileName].blame();
            }
            catch (err) {
                errorhandler_1.handleErrorToLog(err);
            }
            return Promise.resolve(GitBlame.blankBlameInfo());
        });
    }
    getLineInfo(fileName, lineNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            const commitLineNumber = lineNumber + 1;
            const blameInfo = yield this.getBlameInfo(fileName);
            if (blameInfo['lines'][commitLineNumber]) {
                const hash = blameInfo['lines'][commitLineNumber]['hash'];
                return blameInfo['commits'][hash];
            }
            else {
                throw new Error(`No blame info can be found for ${fileName}:${lineNumber}`);
            }
        });
    }
    generateDisposeFunction(fileName) {
        return () => {
            delete this.files[fileName];
        };
    }
    dispose() {
        for (let fileName in this.files) {
            this.files[fileName].dispose();
        }
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
            hash: '0000000000000000000000000000000000000000',
            author: emptyAuthor,
            committer: emptyAuthor,
            summary: '',
            filename: ''
        };
    }
}
exports.GitBlame = GitBlame;
//# sourceMappingURL=gitblame.js.map