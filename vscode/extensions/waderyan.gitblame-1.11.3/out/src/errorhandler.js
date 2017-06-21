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
const vscode_1 = require("vscode");
const showLog = 'Show Log';
const outputStream = vscode_1.window.createOutputChannel('Extension: gitblame');
function handleErrorWithShowMessage(error, message) {
    return __awaiter(this, void 0, void 0, function* () {
        outputStream.append(error.toString());
        const selectedItem = yield vscode_1.window.showErrorMessage(message, showLog);
        if (selectedItem === showLog) {
            outputStream.show();
        }
    });
}
exports.handleErrorWithShowMessage = handleErrorWithShowMessage;
function handleErrorToLog(error) {
    outputStream.append(error.toString());
}
exports.handleErrorToLog = handleErrorToLog;
//# sourceMappingURL=errorhandler.js.map