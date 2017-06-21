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
const FS = require("fs");
const Path = require("path");
function findGitPath(repositoryDirectory) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            function recur(repoDir) {
                const repositoryPath = Path.join(repoDir, '.git');
                FS.access(repositoryPath, (err) => {
                    if (err) {
                        const parentDirectory = Path.dirname(repoDir);
                        if (parentDirectory !== repoDir) {
                            recur(parentDirectory);
                        }
                        else {
                            reject(err);
                        }
                    }
                    else {
                        resolve({
                            'dir': repoDir,
                            'path': repositoryPath
                        });
                    }
                });
            }
            recur(repositoryDirectory);
        });
    });
}
exports.findGitPath = findGitPath;
//# sourceMappingURL=gitpath.js.map