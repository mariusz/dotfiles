'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const system_1 = require("../../system");
const git_1 = require("./../git");
const moment = require("moment");
const path = require("path");
const diffRegex = /diff --git a\/(.*) b\/(.*)/;
class GitLogParser {
    static parse(data, type, repoPath, fileName, sha, maxCount, reverse, range) {
        if (!data)
            return undefined;
        const authors = new Map();
        const commits = new Map();
        let relativeFileName;
        let recentCommit = undefined;
        if (repoPath !== undefined) {
            repoPath = git_1.Git.normalizePath(repoPath);
        }
        let entry = undefined;
        let line = undefined;
        let lineParts;
        let next = undefined;
        let i = -1;
        let first = true;
        let skip = false;
        const lines = system_1.Strings.lines(data);
        while (true) {
            if (!skip) {
                next = lines.next();
                if (next.done)
                    break;
                line = next.value;
                i++;
            }
            else {
                skip = false;
            }
            if (reverse && maxCount && (i >= maxCount))
                break;
            lineParts = line.split(' ');
            if (lineParts.length < 2)
                continue;
            if (entry === undefined) {
                if (!git_1.Git.shaRegex.test(lineParts[0]))
                    continue;
                entry = {
                    sha: lineParts[0]
                };
                continue;
            }
            switch (lineParts[0]) {
                case 'author':
                    entry.author = git_1.Git.isUncommitted(entry.sha)
                        ? 'You'
                        : lineParts.slice(1).join(' ').trim();
                    break;
                case 'author-date':
                    entry.authorDate = `${lineParts[1]}T${lineParts[2]}${lineParts[3]}`;
                    break;
                case 'parents':
                    entry.parentShas = lineParts.slice(1);
                    break;
                case 'summary':
                    entry.summary = lineParts.slice(1).join(' ').trim();
                    while (true) {
                        next = lines.next();
                        if (next.done)
                            break;
                        i++;
                        line = next.value;
                        if (!line)
                            break;
                        if (line === 'filename ?') {
                            skip = true;
                            break;
                        }
                        entry.summary += `\n${line}`;
                    }
                    break;
                case 'filename':
                    if (type === 'branch') {
                        next = lines.next();
                        if (next.done)
                            break;
                        i++;
                        line = next.value;
                        if (line && git_1.Git.shaRegex.test(line)) {
                            skip = true;
                            continue;
                        }
                        let diff = false;
                        while (true) {
                            next = lines.next();
                            if (next.done)
                                break;
                            i++;
                            line = next.value;
                            lineParts = line.split(' ');
                            if (git_1.Git.shaRegex.test(lineParts[0])) {
                                skip = true;
                                break;
                            }
                            if (diff)
                                continue;
                            if (lineParts[0] === 'diff') {
                                diff = true;
                                const matches = diffRegex.exec(line);
                                if (matches != null) {
                                    entry.fileName = matches[1];
                                    const originalFileName = matches[2];
                                    if (entry.fileName !== originalFileName) {
                                        entry.originalFileName = originalFileName;
                                    }
                                }
                                continue;
                            }
                            if (entry.fileStatuses == null) {
                                entry.fileStatuses = [];
                            }
                            const status = {
                                status: line[0],
                                fileName: line.substring(1),
                                originalFileName: undefined
                            };
                            this._parseFileName(status);
                            entry.fileStatuses.push(status);
                        }
                        if (entry.fileStatuses) {
                            entry.fileName = entry.fileStatuses.filter(_ => !!_.fileName).map(_ => _.fileName).join(', ');
                        }
                    }
                    else {
                        next = lines.next();
                        next = lines.next();
                        i += 2;
                        line = next.value;
                        entry.status = line[0];
                        entry.fileName = line.substring(1);
                        this._parseFileName(entry);
                    }
                    if (first && repoPath === undefined && type === 'file' && fileName !== undefined) {
                        repoPath = git_1.Git.normalizePath(fileName.replace(fileName.startsWith('/') ? `/${entry.fileName}` : entry.fileName, ''));
                        relativeFileName = git_1.Git.normalizePath(path.relative(repoPath, fileName));
                    }
                    else {
                        relativeFileName = entry.fileName;
                    }
                    first = false;
                    recentCommit = GitLogParser._parseEntry(entry, type, repoPath, relativeFileName, commits, authors, recentCommit);
                    entry = undefined;
                    break;
            }
            if (next.done)
                break;
        }
        return {
            repoPath: repoPath,
            authors: authors,
            commits: commits,
            sha: sha,
            maxCount: maxCount,
            range: range,
            truncated: !!(maxCount && i >= maxCount)
        };
    }
    static _parseEntry(entry, type, repoPath, relativeFileName, commits, authors, recentCommit) {
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
            commit = new git_1.GitLogCommit(type, repoPath, entry.sha, relativeFileName, entry.author, moment(entry.authorDate).toDate(), entry.summary, entry.status, entry.fileStatuses, undefined, entry.originalFileName);
            commit.parentShas = entry.parentShas;
            if (relativeFileName !== entry.fileName) {
                commit.originalFileName = entry.fileName;
            }
            commits.set(entry.sha, commit);
        }
        if (recentCommit !== undefined) {
            recentCommit.previousSha = commit.sha;
            commit.nextSha = commit.sha !== recentCommit.sha ? recentCommit.sha : recentCommit.nextSha;
            if (type === 'file') {
                recentCommit.previousFileName = commit.originalFileName || commit.fileName;
                commit.nextFileName = recentCommit.originalFileName || recentCommit.fileName;
            }
        }
        return commit;
    }
    static _parseFileName(entry) {
        if (entry.fileName === undefined)
            return;
        const index = entry.fileName.indexOf('\t') + 1;
        if (index > 0) {
            const next = entry.fileName.indexOf('\t', index) + 1;
            if (next > 0) {
                entry.originalFileName = entry.fileName.substring(index, next - 1);
                entry.fileName = entry.fileName.substring(next);
            }
            else {
                entry.fileName = entry.fileName.substring(index);
            }
        }
    }
}
exports.GitLogParser = GitLogParser;
//# sourceMappingURL=logParser.js.map