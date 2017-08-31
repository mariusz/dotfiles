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
const moment = require("moment");
const vscode_1 = require("vscode");
const property_1 = require("./property");
const constants_1 = require("../constants");
var LogCategory;
(function (LogCategory) {
    LogCategory["Info"] = "info";
    LogCategory["Error"] = "error";
    LogCategory["Command"] = "command";
    LogCategory["Critical"] = "critical";
})(LogCategory || (LogCategory = {}));
class ErrorHandler {
    constructor() {
        this.outputChannel = vscode_1.window.createOutputChannel('Extension: gitblame');
    }
    static getInstance() {
        if (!ErrorHandler.instance) {
            ErrorHandler.instance = new ErrorHandler();
        }
        return ErrorHandler.instance;
    }
    logInfo(message) {
        this.writeToLog(LogCategory.Info, message);
    }
    logCommand(message) {
        this.writeToLog(LogCategory.Command, message);
    }
    logError(error) {
        this.writeToLog(LogCategory.Error, error.toString());
    }
    logCritical(error, message) {
        return __awaiter(this, void 0, void 0, function* () {
            this.writeToLog(LogCategory.Critical, error.toString());
            this.showErrorMessage(message);
        });
    }
    showErrorMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const selectedItem = yield vscode_1.window.showErrorMessage(message, constants_1.TITLE_SHOW_LOG);
            if (selectedItem === constants_1.TITLE_SHOW_LOG) {
                this.outputChannel.show();
            }
        });
    }
    writeToLog(category, message) {
        const allowCategory = this.logCategoryAllowed(category);
        if (allowCategory) {
            const trimmedMessage = message.trim();
            const timestamp = moment().format('HH:mm:ss');
            this.outputChannel.appendLine(`[ ${timestamp} | ${category} ] ${trimmedMessage}`);
        }
        return allowCategory;
    }
    logCategoryAllowed(level) {
        const enabledLevels = property_1.Property.get(property_1.Properties.LogLevel, []);
        return enabledLevels.includes(level);
    }
    dispose() {
        this.outputChannel.dispose();
    }
}
exports.ErrorHandler = ErrorHandler;
//# sourceMappingURL=errorhandler.js.map