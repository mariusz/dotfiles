"use strict";
var StringStack = (function () {
    function StringStack() {
        this.stack = [];
    }
    /**
     * fromString
     */
    StringStack.prototype.fromString = function (input) {
        if (input !== "") {
            this.stack = JSON.parse(input);
        }
    };
    /**
     * toString
     */
    StringStack.prototype.toString = function () {
        return JSON.stringify(this.stack);
    };
    /**
     * push
     */
    StringStack.prototype.push = function (item) {
        var index = this.stack.indexOf(item);
        if (index > -1) {
            this.stack.splice(index, 1);
        }
        this.stack.push(item);
    };
    /**
     * pop
     */
    StringStack.prototype.pop = function () {
        return this.stack.pop();
    };
    /**
     * length
     */
    StringStack.prototype.length = function () {
        return this.stack.length;
    };
    /**
     * getItem
     */
    StringStack.prototype.getItem = function (index) {
        if (index < 0) {
            return "";
        }
        if (this.stack.length === 0) {
            return "";
        }
        return this.stack[index];
    };
    return StringStack;
}());
exports.StringStack = StringStack;
//# sourceMappingURL=stack.js.map