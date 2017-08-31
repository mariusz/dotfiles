"use strict";
var ProjectsSorter = (function () {
    function ProjectsSorter() {
    }
    ProjectsSorter.getSortedByName = function (items) {
        var itemsSorted = items.sort(function (n1, n2) {
            // ignore octicons
            if (n1.label.replace(/\$\(\w*(-)*\w*\)\s/, "") > n2.label.replace(/\$\(\w*(-)*\w*\)\s/, "")) {
                return 1;
            }
            if (n1.label.replace(/\$\(\w*(-)*\w*\)\s/, "") < n2.label.replace(/\$\(\w*(-)*\w*\)\s/, "")) {
                return -1;
            }
            return 0;
        });
        return itemsSorted;
    };
    ProjectsSorter.getSortedByPath = function (items) {
        var itemsSorted = items.sort(function (n1, n2) {
            if (n1.description > n2.description) {
                return 1;
            }
            if (n1.description < n2.description) {
                return -1;
            }
            return 0;
        });
        return itemsSorted;
    };
    ProjectsSorter.getSortedByRecent = function (items, aStack) {
        if (aStack.length() === 0) {
            return items;
        }
        var loadedProjects = items;
        for (var index = 0; index < aStack.length(); index++) {
            var element = aStack.getItem(index);
            var found = -1;
            for (var i = 0; i < loadedProjects.length; i++) {
                var itemElement = loadedProjects[i];
                if (itemElement.label === element) {
                    found = i;
                    break;
                }
            }
            if (found > -1) {
                var removedProject = loadedProjects.splice(found, 1);
                loadedProjects.unshift(removedProject[0]);
            }
        }
        return loadedProjects;
    };
    /**
     * Show an information message.
     *
     * @see [showInformationMessage](#window.showInformationMessage)
     *
     * @param (string) itemsToShow The message to show.
     * @param criteria A set of items that will be rendered as actions in the message.
     * @param aStack A set of items that will be rendered as actions in the message.
     * @return Sorted list
     */
    ProjectsSorter.SortItemsByCriteria = function (itemsToShow, criteria, aStack) {
        var newItemsSorted = [];
        switch (criteria) {
            case "Path":
                newItemsSorted = this.getSortedByPath(itemsToShow);
                break;
            case "Saved":
                newItemsSorted = itemsToShow;
                break;
            case "Recent":
                newItemsSorted = this.getSortedByRecent(itemsToShow, aStack);
                break;
            default:
                newItemsSorted = this.getSortedByName(itemsToShow);
                break;
        }
        return newItemsSorted;
    };
    return ProjectsSorter;
}());
exports.ProjectsSorter = ProjectsSorter;
//# sourceMappingURL=sorter.js.map