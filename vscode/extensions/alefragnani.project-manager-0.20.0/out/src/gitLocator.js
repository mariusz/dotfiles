"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var path = require("path");
var fs = require("fs");
var abstractLocator_1 = require("./abstractLocator");
var GitLocator = (function (_super) {
    __extends(GitLocator, _super);
    function GitLocator() {
        _super.apply(this, arguments);
    }
    GitLocator.prototype.getKind = function () {
        return "git";
    };
    GitLocator.prototype.isRepoDir = function (projectPath) {
        var isGit;
        isGit = fs.existsSync(path.join(projectPath, ".git", "config"));
        if (isGit) {
            return true;
        }
        isGit = fs.existsSync(path.join(projectPath, ".git"));
        if (isGit) {
            var file = void 0;
            try {
                file = fs.readFileSync(path.join(projectPath, ".git"), "utf8");
                isGit = file.indexOf("gitdir: ") === 0;
                if (isGit) {
                    return true;
                }
            }
            catch (e) {
                console.log("Error checking git-worktree: " + e);
            }
        }
        return false;
    };
    GitLocator.prototype.decideProjectName = function (projectPath) {
        return path.basename(projectPath);
    };
    return GitLocator;
}(abstractLocator_1.AbstractLocator));
exports.GitLocator = GitLocator;
//# sourceMappingURL=gitLocator.js.map