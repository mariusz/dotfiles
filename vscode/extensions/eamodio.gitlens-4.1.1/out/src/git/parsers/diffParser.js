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
        const current = [];
        const previous = [];
        for (const l of lines) {
            switch (l[0]) {
                case '+':
                    current.push({
                        line: ` ${l.substring(1)}`,
                        state: 'added'
                    });
                    previous.push(undefined);
                    break;
                case '-':
                    current.push(undefined);
                    previous.push({
                        line: ` ${l.substring(1)}`,
                        state: 'removed'
                    });
                    break;
                default:
                    current.push({ line: l, state: 'unchanged' });
                    previous.push({ line: l, state: 'unchanged' });
                    break;
            }
        }
        return [current, previous];
    }
}
exports.GitDiffParser = GitDiffParser;
//# sourceMappingURL=diffParser.js.map