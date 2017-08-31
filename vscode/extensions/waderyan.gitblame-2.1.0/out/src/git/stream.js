"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process = require("child_process");
const events_1 = require("events");
const gitcommand_1 = require("../util/gitcommand");
const blame_1 = require("./blame");
const errorhandler_1 = require("../util/errorhandler");
const property_1 = require("../util/property");
class GitBlameStream extends events_1.EventEmitter {
    constructor(file, workTree) {
        super();
        this.emittedCommits = {};
        this.file = file;
        this.workTree = workTree;
        gitcommand_1.getGitCommand().then((gitCommand) => {
            const args = this.generateArguments();
            const spawnOptions = {
                cwd: workTree
            };
            errorhandler_1.ErrorHandler.getInstance().logCommand(`${gitCommand} ${args.join(' ')}`);
            this.process = child_process.spawn(gitCommand, args, spawnOptions);
            this.setupListeners();
        });
    }
    generateArguments() {
        const processArguments = [];
        processArguments.push(`blame`);
        if (property_1.Property.get(property_1.Properties.IgnoreWhitespace)) {
            processArguments.push('-w');
        }
        processArguments.push('--incremental');
        processArguments.push('--');
        processArguments.push(this.file.fsPath);
        return processArguments;
    }
    setupListeners() {
        this.process.addListener('close', (code) => this.close(code));
        this.process.stdout.addListener('data', (chunk) => this.data(chunk));
        this.process.stderr.addListener('data', (error) => this.errorData(error));
    }
    close(code) {
        if (code === 0 || code === null) {
            this.emit('end');
        }
    }
    data(dataChunk) {
        const lines = dataChunk.toString().split('\n');
        let commitInfo = this.getCommitTemplate();
        lines.forEach((line, index) => {
            if (line && line != 'boundary') {
                const [all, key, value] = Array.from(line.match(/(.*?) (.*)/));
                if (/[a-z0-9]{40}/.test(key) && lines.hasOwnProperty(index + 1) && /^(author|committer)/.test(lines[index + 1]) && commitInfo.hash !== '') {
                    this.commitInfoToCommitEmit(commitInfo);
                    commitInfo = this.getCommitTemplate();
                }
                this.processLine({ key, value }, commitInfo);
            }
        });
        this.commitInfoToCommitEmit(commitInfo);
    }
    processLine(line, commitInfo) {
        if (line.key === 'author') {
            commitInfo.author.name = line.value;
        }
        else if (line.key === 'author-mail') {
            commitInfo.author.mail = line.value;
        }
        else if (line.key === 'author-time') {
            commitInfo.author.timestamp = parseInt(line.value, 10);
        }
        else if (line.key === 'author-tz') {
            commitInfo.author.tz = line.value;
        }
        else if (line.key === 'committer') {
            commitInfo.committer.name = line.value;
        }
        else if (line.key === 'committer-mail') {
            commitInfo.committer.mail = line.value;
        }
        else if (line.key === 'committer-time') {
            commitInfo.committer.timestamp = parseInt(line.value, 10);
        }
        else if (line.key === 'committer-tz') {
            commitInfo.committer.tz = line.value;
        }
        else if (line.key === 'summary') {
            commitInfo.summary = line.value;
        }
        else if (line.key.length === 40) {
            commitInfo.hash = line.key;
            const hash = line.key;
            const [originalLine, finalLine, lines] = line.value.split(' ').map((a) => parseInt(a, 10));
            this.lineGroupToLineEmit(hash, lines, finalLine);
        }
    }
    lineGroupToLineEmit(hash, lines, finalLine) {
        for (let i = 0; i < lines; i++) {
            this.emit('line', finalLine + i, blame_1.GitBlame.internalHash(hash));
        }
    }
    commitInfoToCommitEmit(commitInfo) {
        const internalHash = blame_1.GitBlame.internalHash(commitInfo.hash);
        if (!this.emittedCommits[internalHash]) {
            this.emittedCommits[internalHash] = true;
            this.emit('commit', internalHash, commitInfo);
        }
    }
    errorData(error) {
        this.emit('error', error);
    }
    getCommitTemplate() {
        return {
            hash: '',
            author: {
                name: '',
                mail: '',
                timestamp: 0,
                tz: ''
            },
            committer: {
                name: '',
                mail: '',
                timestamp: 0,
                tz: ''
            },
            summary: '',
            filename: this.file.fsPath.replace(this.workTree, '')
        };
    }
    terminate() {
        this.dispose();
    }
    dispose() {
        this.process.kill('SIGKILL');
        this.process.removeAllListeners();
    }
}
exports.GitBlameStream = GitBlameStream;
//# sourceMappingURL=stream.js.map