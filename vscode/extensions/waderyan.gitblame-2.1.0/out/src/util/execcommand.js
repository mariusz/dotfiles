"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process = require("child_process");
const errorhandler_1 = require("./errorhandler");
function execute(command, args, options = {}) {
    return new Promise((resolve, reject) => {
        errorhandler_1.ErrorHandler.getInstance().logCommand(`${command} ${args.join(' ')}`);
        child_process.execFile(command, args, options, (error, stdout, stderr) => {
            if (error) {
                errorhandler_1.ErrorHandler.getInstance().logError(new Error(stderr));
                resolve('');
            }
            else {
                resolve(stdout);
            }
        });
    });
}
exports.execute = execute;
//# sourceMappingURL=execcommand.js.map