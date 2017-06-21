"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
function execute(command, options = {}) {
    return new Promise((resolve, reject) => {
        child_process_1.exec(command, options, (error, stdout, stderr) => {
            if (error) {
                reject(stderr);
            }
            else {
                resolve(stdout);
            }
        });
    });
}
exports.execute = execute;
//# sourceMappingURL=execcommand.js.map