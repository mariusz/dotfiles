'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const diffParser_1 = require("../parsers/diffParser");
class GitDiffChunk {
    constructor(chunk, currentPosition, previousPosition) {
        this.currentPosition = currentPosition;
        this.previousPosition = previousPosition;
        this._chunk = chunk;
    }
    get current() {
        if (this._chunk !== undefined) {
            this.parseChunk();
        }
        return this._current;
    }
    get previous() {
        if (this._chunk !== undefined) {
            this.parseChunk();
        }
        return this._previous;
    }
    parseChunk() {
        [this._current, this._previous] = diffParser_1.GitDiffParser.parseChunk(this._chunk);
        this._chunk = undefined;
    }
}
exports.GitDiffChunk = GitDiffChunk;
//# sourceMappingURL=diff.js.map