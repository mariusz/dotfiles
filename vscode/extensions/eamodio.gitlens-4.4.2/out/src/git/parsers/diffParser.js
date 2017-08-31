'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const system_1 = require("../../system");
const git_1 = require("./../git");
const unifiedDiffRegex = /^@@ -([\d]+),([\d]+) [+]([\d]+),([\d]+) @@([\s\S]*?)(?=^@@)/gm;
class GitDiffParser {
    static parse(data, debug = false) {
        if (!data)
            return undefined;
        const chunks = [];
        let match = null;
        let chunk;
        let currentStart;
        let previousStart;
        do {
            match = unifiedDiffRegex.exec(`${data}\n@@`);
            if (match == null)
                break;
            chunk = (' ' + match[5]).substr(1);
            currentStart = parseInt(match[3], 10);
            previousStart = parseInt(match[1], 10);
            chunks.push(new git_1.GitDiffChunk(chunk, { start: currentStart, end: currentStart + parseInt(match[4], 10) }, { start: previousStart, end: previousStart + parseInt(match[2], 10) }));
        } while (match != null);
        if (!chunks.length)
            return undefined;
        const diff = {
            diff: debug ? data : undefined,
            chunks: chunks
        };
        return diff;
    }
    static parseChunk(chunk) {
        const lines = system_1.Iterables.skip(system_1.Strings.lines(chunk), 1);
        const currentLines = [];
        const previousLines = [];
        let removed = 0;
        for (const l of lines) {
            switch (l[0]) {
                case '+':
                    currentLines.push({
                        line: ` ${l.substring(1)}`,
                        state: 'added'
                    });
                    if (removed > 0) {
                        removed--;
                    }
                    else {
                        previousLines.push(undefined);
                    }
                    break;
                case '-':
                    removed++;
                    previousLines.push({
                        line: ` ${l.substring(1)}`,
                        state: 'removed'
                    });
                    break;
                default:
                    while (removed > 0) {
                        removed--;
                        currentLines.push(undefined);
                    }
                    currentLines.push({ line: l, state: 'unchanged' });
                    previousLines.push({ line: l, state: 'unchanged' });
                    break;
            }
        }
        const chunkLines = [];
        let chunkLine = undefined;
        let current = undefined;
        for (let i = 0; i < currentLines.length; i++) {
            current = currentLines[i];
            if (current === undefined) {
                if (chunkLine === undefined)
                    continue;
                if (chunkLine.previous === undefined) {
                    chunkLine.previous = [previousLines[i]];
                    continue;
                }
                chunkLine.previous.push(previousLines[i]);
                continue;
            }
            chunkLine = {
                line: current.line,
                state: current.state,
                previous: [previousLines[i]]
            };
            chunkLines.push(chunkLine);
        }
        return chunkLines;
    }
}
exports.GitDiffParser = GitDiffParser;
//# sourceMappingURL=diffParser.js.map