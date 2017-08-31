'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const diffParser_1 = require("../parsers/diffParser");
class GitDiffChunk {
    constructor(chunk, currentPosition, previousPosition) {
        this.currentPosition = currentPosition;
        this.previousPosition = previousPosition;
        this._chunk = chunk;
    }
    get lines() {
        if (this._lines === undefined) {
            this._lines = diffParser_1.GitDiffParser.parseChunk(this._chunk);
            this._chunk = undefined;
        }
        return this._lines;
    }
}
exports.GitDiffChunk = GitDiffChunk;
//# sourceMappingURL=diff.js.map