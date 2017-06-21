'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const system_1 = require("../../system");
class Formatter {
    constructor(item, options) {
        this.collapsableWhitespace = 0;
        this.reset(item, options);
    }
    reset(item, options) {
        this._item = item;
        if (options === undefined && this._options !== undefined)
            return;
        if (options === undefined) {
            options = {};
        }
        if (options.dateFormat == null) {
            options.dateFormat = 'MMMM Do, YYYY h:MMa';
        }
        if (options.tokenOptions == null) {
            options.tokenOptions = {};
        }
        this._options = options;
    }
    _padOrTruncate(s, options) {
        if (options === undefined) {
            options = {
                truncateTo: undefined,
                padDirection: 'left',
                collapseWhitespace: false
            };
        }
        let max = options.truncateTo;
        if (max === undefined) {
            if (this.collapsableWhitespace === 0)
                return s;
            const diff = this.collapsableWhitespace - s.length;
            this.collapsableWhitespace = 0;
            if (diff <= 0)
                return s;
            if (options.truncateTo === undefined)
                return s;
            return system_1.Strings.padLeft(s, diff);
        }
        max += this.collapsableWhitespace;
        this.collapsableWhitespace = 0;
        const diff = max - s.length;
        if (diff > 0) {
            if (options.collapseWhitespace) {
                this.collapsableWhitespace = diff;
            }
            if (options.padDirection === 'left')
                return system_1.Strings.padLeft(s, max);
            if (options.collapseWhitespace) {
                max -= diff;
            }
            return system_1.Strings.padRight(s, max);
        }
        if (diff < 0)
            return system_1.Strings.truncate(s, max);
        return s;
    }
    static fromTemplateCore(formatter, template, item, dateFormatOrOptions) {
        if (formatter instanceof Formatter)
            return system_1.Strings.interpolate(template, formatter);
        let options = undefined;
        if (dateFormatOrOptions == null || typeof dateFormatOrOptions === 'string') {
            const tokenOptions = system_1.Strings.getTokensFromTemplate(template)
                .reduce((map, token) => {
                map[token.key] = token.options;
                return map;
            }, {});
            options = {
                dateFormat: dateFormatOrOptions,
                tokenOptions: tokenOptions
            };
        }
        else {
            options = dateFormatOrOptions;
        }
        if (this._formatter === undefined) {
            this._formatter = new formatter(item, options);
        }
        else {
            this._formatter.reset(item, options);
        }
        return system_1.Strings.interpolate(template, this._formatter);
    }
}
Formatter._formatter = undefined;
exports.Formatter = Formatter;
//# sourceMappingURL=formatter.js.map