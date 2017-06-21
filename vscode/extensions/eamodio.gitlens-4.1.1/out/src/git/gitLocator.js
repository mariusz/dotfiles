'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const spawn_rx_1 = require("spawn-rx");
const path = require("path");
function parseVersion(raw) {
    return raw.replace(/^git version /, '');
}
function findSpecificGit(path) {
    return __awaiter(this, void 0, void 0, function* () {
        const version = yield spawn_rx_1.spawnPromise(path, ['--version']);
        if (!path || path === 'git') {
            path = spawn_rx_1.findActualExecutable(path, ['--version']).cmd;
        }
        return {
            path,
            version: parseVersion(version.trim())
        };
    });
}
function findGitDarwin() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let path = yield spawn_rx_1.spawnPromise('which', ['git']);
            path = path.replace(/^\s+|\s+$/g, '');
            if (path !== '/usr/bin/git') {
                return findSpecificGit(path);
            }
            try {
                yield spawn_rx_1.spawnPromise('xcode-select', ['-p']);
                return findSpecificGit(path);
            }
            catch (ex) {
                if (ex.code === 2) {
                    return Promise.reject(new Error('Unable to find git'));
                }
                return findSpecificGit(path);
            }
        }
        catch (ex) {
            return Promise.reject(new Error('Unable to find git'));
        }
    });
}
function findSystemGitWin32(basePath) {
    if (!basePath)
        return Promise.reject(new Error('Unable to find git'));
    return findSpecificGit(path.join(basePath, 'Git', 'cmd', 'git.exe'));
}
function findGitWin32() {
    return findSystemGitWin32(process.env['ProgramW6432'])
        .then(null, () => findSystemGitWin32(process.env['ProgramFiles(x86)']))
        .then(null, () => findSystemGitWin32(process.env['ProgramFiles']))
        .then(null, () => findSpecificGit('git'));
}
function findGitPath(path) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield findSpecificGit(path || 'git');
        }
        catch (ex) {
            try {
                switch (process.platform) {
                    case 'darwin': return yield findGitDarwin();
                    case 'win32': return yield findGitWin32();
                    default: return Promise.reject('Unable to find git');
                }
            }
            catch (ex) {
                return Promise.reject(new Error('Unable to find git'));
            }
        }
    });
}
exports.findGitPath = findGitPath;
//# sourceMappingURL=gitLocator.js.map