'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const formatter_1 = require("./formatter");
const status_1 = require("../models/status");
const path = require("path");
class StatusFileFormatter extends formatter_1.Formatter {
    get file() {
        const file = path.basename(this._item.fileName);
        return this._padOrTruncate(file, this._options.tokenOptions.file);
    }
    get path() {
        const directory = status_1.GitStatusFile.getFormattedDirectory(this._item, false);
        return this._padOrTruncate(directory, this._options.tokenOptions.file);
    }
    static fromTemplate(template, status, dateFormatOrOptions) {
        return super.fromTemplateCore(this, template, status, dateFormatOrOptions);
    }
}
exports.StatusFileFormatter = StatusFileFormatter;
//# sourceMappingURL=status.js.map