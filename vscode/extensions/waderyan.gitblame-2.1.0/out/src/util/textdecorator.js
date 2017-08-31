"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
const blame_1 = require("../git/blame");
const objectpath_1 = require("./objectpath");
const property_1 = require("./property");
class TextDecorator {
    static toTextView(commit) {
        if (blame_1.GitBlame.isBlankCommit(commit)) {
            return property_1.Property.get(property_1.Properties.StatusBarMessageNoCommit);
        }
        const normalizedCommitInfo = TextDecorator.normalizeCommitInfoTokens(commit);
        const messageFormat = property_1.Property.get(property_1.Properties.StatusBarMessageFormat);
        return TextDecorator.parseTokens(messageFormat, normalizedCommitInfo);
    }
    static toDateText(dateNow, dateThen) {
        const momentNow = moment(dateNow);
        const momentThen = moment(dateThen);
        const months = momentNow.diff(momentThen, 'months');
        const days = momentNow.diff(momentThen, 'days');
        const hours = momentNow.diff(momentThen, 'hours');
        const minutes = momentNow.diff(momentThen, 'minutes');
        if (minutes <= 4) {
            return 'right now';
        }
        else if (minutes <= 70) {
            return minutes + ' ' + (minutes === 1 ? 'minute' : 'minutes') + ' ago';
        }
        else if (hours <= 47) {
            return hours + ' ' + (hours === 1 ? 'hour' : 'hours') + ' ago';
        }
        else if (days <= 40) {
            return days + ' ' + (days === 1 ? 'day' : 'days') + ' ago';
        }
        else {
            return months + ' ' + (months === 1 ? 'month' : 'months') + ' ago';
        }
    }
    static parseTokens(target, tokens = {}) {
        const tokenRegex = /\$\{([a-z\.\-\_]{1,})[,]*(|.{1,}?)(?=\})}/gi;
        if (typeof target !== 'string') {
            return '';
        }
        return target.replace(tokenRegex, (string, key, inValue) => {
            const currentToken = objectpath_1.walkObject(tokens, key);
            const value = inValue.length > 0 ? inValue : undefined;
            const currentTokenType = typeof currentToken;
            if (currentTokenType === 'string') {
                return currentToken;
            }
            else if (currentTokenType === 'number') {
                return currentToken.toString();
            }
            else if (currentTokenType === 'function') {
                const newString = currentToken.call(this, value, key);
                const newStringType = typeof newString;
                if (newStringType === 'string') {
                    return newString;
                }
                else if (newStringType === 'number') {
                    return newString.toString();
                }
            }
            return key;
        });
    }
    static normalizeCommitInfoTokens(commitInfo) {
        const now = new Date();
        const authorTime = moment.unix(commitInfo.author.timestamp);
        const committerTime = moment.unix(commitInfo.committer.timestamp);
        return {
            'commit': {
                'hash': commitInfo.hash,
                'hash_short': (length = 7) => commitInfo.hash.substr(0, length),
                'summary': commitInfo.summary,
                'filename': commitInfo.filename
            },
            'author': commitInfo.author,
            'committer': commitInfo.committer,
            'time': {
                'ago': () => TextDecorator.toDateText(now, authorTime.toDate()),
                'from': () => authorTime.fromNow(),
                'custom': (momentFormat) => authorTime.format(momentFormat),
                'c_ago': () => TextDecorator.toDateText(now, committerTime.toDate()),
                'c_from': () => committerTime.fromNow(),
                'c_custom': (momentFormat) => committerTime.format(momentFormat)
            }
        };
    }
}
exports.TextDecorator = TextDecorator;
//# sourceMappingURL=textdecorator.js.map