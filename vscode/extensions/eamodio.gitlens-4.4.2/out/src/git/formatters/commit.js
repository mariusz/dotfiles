'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const formatter_1 = require("./formatter");
const moment = require("moment");
class CommitFormatter extends formatter_1.Formatter {
    get ago() {
        const ago = moment(this._item.date).fromNow();
        return this._padOrTruncate(ago, this._options.tokenOptions.ago);
    }
    get author() {
        const author = this._item.author;
        return this._padOrTruncate(author, this._options.tokenOptions.author);
    }
    get authorAgo() {
        const authorAgo = `${this._item.author}, ${moment(this._item.date).fromNow()}`;
        return this._padOrTruncate(authorAgo, this._options.tokenOptions.authorAgo);
    }
    get date() {
        const date = moment(this._item.date).format(this._options.dateFormat);
        return this._padOrTruncate(date, this._options.tokenOptions.date);
    }
    get id() {
        return this._item.shortSha;
    }
    get message() {
        const message = this._item.isUncommitted ? 'Uncommitted change' : this._item.message;
        return this._padOrTruncate(message, this._options.tokenOptions.message);
    }
    get sha() {
        return this.id;
    }
    static fromTemplate(template, commit, dateFormatOrOptions) {
        return super.fromTemplateCore(this, template, commit, dateFormatOrOptions);
    }
}
exports.CommitFormatter = CommitFormatter;
//# sourceMappingURL=commit.js.map