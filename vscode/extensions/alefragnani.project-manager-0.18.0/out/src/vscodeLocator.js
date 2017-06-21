"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var path = require("path");
var fs = require("fs");
var abstractLocator_1 = require("./abstractLocator");
var VisualStudioCodeLocator = (function (_super) {
    __extends(VisualStudioCodeLocator, _super);
    function VisualStudioCodeLocator() {
        _super.apply(this, arguments);
    }
    VisualStudioCodeLocator.prototype.getKind = function () {
        return "vscode";
    };
    VisualStudioCodeLocator.prototype.isRepoDir = function (projectPath) {
        return fs.existsSync(path.join(projectPath, ".vscode"));
    };
    VisualStudioCodeLocator.prototype.decideProjectName = function (projectPath) {
        return path.basename(projectPath);
    };
    return VisualStudioCodeLocator;
}(abstractLocator_1.AbstractLocator));
exports.VisualStudioCodeLocator = VisualStudioCodeLocator;
//# sourceMappingURL=vscodeLocator.js.map