"use strict";
var os = require("os");
// import path = require("path");
// import fs = require("fs");
exports.homeDir = os.homedir();
exports.homePathVariable = "$home";
var PathUtils = (function () {
    function PathUtils() {
    }
    /**
     * Indicates if a path is a UNC path
     *
     * @param path The path to check
     */
    PathUtils.pathIsUNC = function (path) {
        return path.indexOf("\\\\") === 0;
    };
    /**
     * If the project path is in the user's home directory then store the home directory as a
     * parameter. This will help in situations when the user works with the same projects on
     * different machines, under different user names.
     */
    PathUtils.compactHomePath = function (path) {
        if (path.indexOf(exports.homeDir) === 0) {
            return path.replace(exports.homeDir, exports.homePathVariable);
        }
        return path;
    };
    /**
     * Expand $home parameter from path to real os home path
     *
     * @param path The path to expand
     */
    PathUtils.expandHomePath = function (path) {
        if (path.indexOf(exports.homePathVariable) === 0) {
            return path.replace(exports.homePathVariable, exports.homeDir);
        }
        return path;
    };
    /**
     * Expand $home parameter from path to real os home path
     *
     * @param items The array of items <QuickPickItem> to expand
     */
    PathUtils.expandHomePaths = function (items) {
        var _this = this;
        return items.map(function (item) {
            item.description = _this.expandHomePath(item.description);
            return item;
        });
    };
    return PathUtils;
}());
exports.PathUtils = PathUtils;
//# sourceMappingURL=PathUtils.js.map