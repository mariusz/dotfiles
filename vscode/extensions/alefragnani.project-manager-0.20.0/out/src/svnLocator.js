"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var path = require("path");
var fs = require("fs");
var abstractLocator_1 = require("./abstractLocator");
var SvnLocator = (function (_super) {
    __extends(SvnLocator, _super);
    function SvnLocator() {
        _super.apply(this, arguments);
    }
    SvnLocator.prototype.getKind = function () {
        return "svn";
    };
    SvnLocator.prototype.isRepoDir = function (projectPath) {
        return fs.existsSync(path.join(projectPath, ".svn", "pristine"));
    };
    SvnLocator.prototype.decideProjectName = function (projectPath) {
        return path.basename(projectPath);
    };
    return SvnLocator;
}(abstractLocator_1.AbstractLocator));
exports.SvnLocator = SvnLocator;
//# sourceMappingURL=svnLocator.js.map