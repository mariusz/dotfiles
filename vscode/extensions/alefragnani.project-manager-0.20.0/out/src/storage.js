"use strict";
var fs = require("fs");
var PathUtils_1 = require("./PathUtils");
;
;
var ProjectItem = (function () {
    function ProjectItem(pname, prootPath) {
        this.name = pname;
        this.rootPath = prootPath;
        this.paths = [];
        this.group = "";
    }
    return ProjectItem;
}());
var ProjectStorage = (function () {
    function ProjectStorage(filename) {
        this.filename = filename;
        this.projectList = [];
    }
    /**
     * Adds a project to the list
     *
     * @param `name` The [Project Name](#Project.name)
     * @param `rootPath` The [Project Rooth Path](#Project.rootPath)
     * @param `rootPath` The [Project Group](#Project.group)
     *
     * @return `void`
     */
    ProjectStorage.prototype.push = function (name, rootPath, group) {
        this.projectList.push(new ProjectItem(name, rootPath));
        return;
    };
    /**
     * Removes a project to the list
     *
     * @param `name` The [Project Name](#Project.name)
     *
     * @return The [Project](#Project) that was removed
     */
    ProjectStorage.prototype.pop = function (name) {
        for (var index = 0; index < this.projectList.length; index++) {
            var element = this.projectList[index];
            if (element.name.toLowerCase() === name.toLowerCase()) {
                return this.projectList.splice(index, 1)[0];
            }
        }
    };
    /**
     * Adds another `path` to a project
     *
     * @param `name` The [Project Name](#Project.name)
     * @param `path` The [Project Path](#Project.paths)
     *
     * @return `void`
     */
    ProjectStorage.prototype.addPath = function (name, path) {
        // for (let index = 0; index < this.projectList.length; index++) {
        for (var _i = 0, _a = this.projectList; _i < _a.length; _i++) {
            var element = _a[_i];
            // let element: Project = this.projectList[index];
            if (element.name.toLowerCase() === name.toLowerCase()) {
                // this.projectList[index].paths.push(path);
                element.paths.push(path);
            }
        }
    };
    /**
     * Updates the `rootPath` of a project
     *
     * @param `name` The [Project Name](#Project.name)
     * @param `name` The [Project Root Path](#Project.rootPath)
     *
     * @return `void`
     */
    ProjectStorage.prototype.updateRootPath = function (name, path) {
        // for (let index = 0; index < this.projectList.length; index++) {
        for (var _i = 0, _a = this.projectList; _i < _a.length; _i++) {
            var element = _a[_i];
            // let element: Project = this.projectList[index];
            if (element.name.toLowerCase() === name.toLowerCase()) {
                // this.projectList[index].rootPath = path;
                element.rootPath = path;
            }
        }
    };
    /**
     * Removes a `path` from a project
     *
     * @param `name` The [Project Name](#Project.name)
     * @param `path` The [Project Path](#Project.paths)
     *
     * @return `void`
     */
    ProjectStorage.prototype.removePath = function (name, path) {
        // for (let index = 0; index < this.projectList.length; index++) {
        for (var _i = 0, _a = this.projectList; _i < _a.length; _i++) {
            var element = _a[_i];
            // let element: Project = this.projectList[index];
            if (element.name.toLowerCase() === name.toLowerCase()) {
                for (var indexPath = 0; indexPath < element.paths.length; indexPath++) {
                    var elementPath = element.paths[indexPath];
                    if (elementPath.toLowerCase() === path.toLowerCase()) {
                        // this.projectList[index].paths.splice(indexPath, 1);
                        element.paths.splice(indexPath, 1);
                        return;
                    }
                }
            }
        }
    };
    /**
     * Checks if exists a project with a given `name`
     *
     * @param `name` The [Project Name](#Project.name) to search for projects
     *
     * @return `true` or `false`
     */
    ProjectStorage.prototype.exists = function (name) {
        var found = false;
        // for (let i = 0; i < this.projectList.length; i++) {
        for (var _i = 0, _a = this.projectList; _i < _a.length; _i++) {
            var element = _a[_i];
            // let element = this.projectList[i];
            if (element.name.toLocaleLowerCase() === name.toLocaleLowerCase()) {
                found = true;
            }
        }
        return found;
    };
    /**
     * Checks if exists a project with a given `rootPath`
     *
     * @param `rootPath` The path to search for projects
     *
     * @return A [Project](#Project) with the given `rootPath`
     */
    ProjectStorage.prototype.existsWithRootPath = function (rootPath) {
        var rootPathUsingHome = PathUtils_1.PathUtils.compactHomePath(rootPath).toLocaleLowerCase();
        for (var _i = 0, _a = this.projectList; _i < _a.length; _i++) {
            var element = _a[_i];
            if ((element.rootPath.toLocaleLowerCase() === rootPath.toLocaleLowerCase()) || (element.rootPath.toLocaleLowerCase() === rootPathUsingHome)) {
                return element;
            }
        }
    };
    /**
     * Returns the number of projects stored in `projects.json`
     *
     * > The _dynamic projects_ like VSCode and Git aren't present
     *
     * @return The number of projects
     */
    ProjectStorage.prototype.length = function () {
        return this.projectList.length;
    };
    /**
     * Loads the `projects.json` file
     *
     * @return A `string` containing the _Error Message_ in case something goes wrong.
     *         An **empty string** if everything is ok.
     */
    ProjectStorage.prototype.load = function () {
        var items = [];
        // missing file (new install)
        if (!fs.existsSync(this.filename)) {
            this.projectList = items;
            return "";
        }
        try {
            items = JSON.parse(fs.readFileSync(this.filename).toString());
            // OLD format
            if ((items.length > 0) && (items[0].label)) {
                // for (let index = 0; index < items.length; index++) {
                for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
                    var element = items_1[_i];
                    // let element = items[index];
                    this.projectList.push(new ProjectItem(element.label, element.description));
                }
                // save updated
                this.save();
            }
            else {
                this.projectList = items;
            }
            return "";
        }
        catch (error) {
            console.log(error);
            return error.toString();
        }
    };
    /**
     * Reloads the `projects.json` file.
     *
     * > Using a forced _reload_ instead of a _watcher_
     *
     * @return `void`
     */
    ProjectStorage.prototype.reload = function () {
        var items = [];
        // missing file (new install)
        if (!fs.existsSync(this.filename)) {
            this.projectList = items;
        }
        else {
            items = JSON.parse(fs.readFileSync(this.filename).toString());
            this.projectList = items;
        }
    };
    /**
     * Saves the `projects.json` file to disk
     *
     * @return `void`
     */
    ProjectStorage.prototype.save = function () {
        fs.writeFileSync(this.filename, JSON.stringify(this.projectList, null, "\t"));
    };
    /**
     * Maps the projects to be used by a `showQuickPick`
     *
     * @return A list of projects `{[label, description]}` to be used on a `showQuickPick`
     */
    ProjectStorage.prototype.map = function () {
        var newItems = this.projectList.map(function (item) {
            return {
                label: item.name,
                description: item.rootPath
            };
        });
        return newItems;
    };
    return ProjectStorage;
}());
exports.ProjectStorage = ProjectStorage;
//# sourceMappingURL=storage.js.map