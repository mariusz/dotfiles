'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const system_1 = require("../../system");
const git_1 = require("./../git");
const moment = require("moment");
const path = require("path");
class GitBlameParser {
    static parse(data, repoPath, fileName) {
        if (!data)
            return undefined;
        const authors = new Map();
        const commits = new Map();
        const lines = [];
        let relativeFileName = repoPath && fileName;
        let entry = undefined;
        let line;
        let lineParts;
        let i = -1;
        let first = true;
        for (line of system_1.Strings.lines(data)) {
            i++;
            lineParts = line.split(' ');
            if (lineParts.length < 2)
                continue;
            if (entry === undefined) {
                entry = {
                    sha: lineParts[0],
                    originalLine: parseInt(lineParts[1], 10) - 1,
                    line: parseInt(lineParts[2], 10) - 1,
                    lineCount: parseInt(lineParts[3], 10)
                };
                continue;
            }
            switch (lineParts[0]) {
                case 'author':
                    entry.author = git_1.Git.isUncommitted(entry.sha)
                        ? 'You'
                        : lineParts.slice(1).join(' ').trim();
                    break;
                case 'author-time':
                    entry.authorDate = lineParts[1];
                    break;
                case 'author-tz':
                    entry.authorTimeZone = lineParts[1];
                    break;
                case 'summary':
                    entry.summary = lineParts.slice(1).join(' ').trim();
                    break;
                case 'previous':
                    entry.previousSha = lineParts[1];
                    entry.previousFileName = lineParts.slice(2).join(' ');
                    break;
                case 'filename':
                    entry.fileName = lineParts.slice(1).join(' ');
                    if (first && repoPath === undefined) {
                        repoPath = git_1.Git.normalizePath(fileName.replace(fileName.startsWith('/') ? `/${entry.fileName}` : entry.fileName, ''));
                        relativeFileName = git_1.Git.normalizePath(path.relative(repoPath, fileName));
                    }
                    first = false;
                    GitBlameParser._parseEntry(entry, repoPath, relativeFileName, commits, authors, lines);
                    entry = undefined;
                    break;
                default:
                    break;
            }
        }
        commits.forEach(c => {
            if (c.author === undefined)
                return;
            const author = authors.get(c.author);
            if (author === undefined)
                return;
            author.lineCount += c.lines.length;
        });
        const sortedAuthors = new Map([...authors.entries()].sort((a, b) => b[1].lineCount - a[1].lineCount));
        return {
            repoPath: repoPath,
            authors: sortedAuthors,
            commits: commits,
            lines: lines
        };
    }
    static _parseEntry(entry, repoPath, fileName, commits, authors, lines) {
        let commit = commits.get(entry.sha);
        if (commit === undefined) {
            if (entry.author !== undefined) {
                let author = authors.get(entry.author);
                if (author === undefined) {
                    author = {
                        name: entry.author,
                        lineCount: 0
                    };
                    authors.set(entry.author, author);
                }
            }
            commit = new git_1.GitBlameCommit(repoPath, entry.sha, fileName, entry.author, moment(`${entry.authorDate} ${entry.authorTimeZone}`, 'X +-HHmm').toDate(), entry.summary, []);
            if (fileName !== entry.fileName) {
                commit.originalFileName = entry.fileName;
            }
            if (entry.previousSha) {
                commit.previousSha = entry.previousSha;
                commit.previousFileName = entry.previousFileName;
            }
            commits.set(entry.sha, commit);
        }
        for (let i = 0, len = entry.lineCount; i < len; i++) {
            const line = {
                sha: entry.sha,
                line: entry.line + i,
                originalLine: entry.originalLine + i
            };
            if (commit.previousSha) {
                line.previousSha = commit.previousSha;
            }
            commit.lines.push(line);
            lines[line.line] = line;
        }
    }
}
exports.GitBlameParser = GitBlameParser;
//# sourceMappingURL=blameParser.js.map