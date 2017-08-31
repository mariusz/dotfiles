"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const blamefilebase_1 = require("./blamefilebase");
const errorhandler_1 = require("../util/errorhandler");
class GitBlameFileDummy extends blamefilebase_1.GitBlameFileBase {
    constructor(fileName, disposeCallback = () => { }) {
        super(fileName, disposeCallback);
        this.startCacheInterval();
        errorhandler_1.ErrorHandler.getInstance().logInfo(`Will not try to blame file "${this.fileName.fsPath}" as it is outside of the current workspace`);
    }
}
exports.GitBlameFileDummy = GitBlameFileDummy;
//# sourceMappingURL=blamefiledummy.js.map