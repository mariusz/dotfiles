"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const moment = require("moment");
const ObjectPath = require("object-path");
class TextDecorator {
    static toTextView(commit) {
        const config = vscode_1.workspace.getConfiguration('gitblame');
        if (commit['hash'] === '0000000000000000000000000000000000000000') {
            return config.get('statusBarMessageNoCommit');
        }
        else {
            const normalizedCommitInfo = TextDecorator.normalizeCommitInfoTokens(commit);
            const messageFormat = config.get('statusBarMessageFormat');
            return TextDecorator.parseTokens(messageFormat, normalizedCommitInfo);
        }
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
        return target.replace(tokenRegex, (string, key, inValue) => {
            const currentToken = ObjectPath.get(tokens, key);
            const value = inValue.length > 0 ? inValue : undefined;
            if (typeof currentToken === 'string') {
                return currentToken;
            }
            else if (typeof currentToken === 'number') {
                return currentToken.toString();
            }
            else if (typeof currentToken === 'function') {
                let newString = currentToken.call(this, value, key);
                if (typeof newString === 'string') {
                    return newString;
                }
                else if (typeof newString === 'number') {
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