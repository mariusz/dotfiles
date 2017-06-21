'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const _escapeRegExp = require('lodash.escaperegexp');
var Strings;
(function (Strings) {
    function escapeRegExp(s) {
        return _escapeRegExp(s);
    }
    Strings.escapeRegExp = escapeRegExp;
    const TokenRegex = /\$\{([^|]*?)(?:\|(\d+)(\-|\?)?)?\}/g;
    const TokenSanitizeRegex = /\$\{(\w*?)(?:\W|\d)*?\}/g;
    function getTokensFromTemplate(template) {
        const tokens = [];
        let match = TokenRegex.exec(template);
        while (match != null) {
            const truncateTo = match[2];
            const option = match[3];
            tokens.push({
                key: match[1],
                options: {
                    truncateTo: truncateTo == null ? undefined : parseInt(truncateTo, 10),
                    padDirection: option === '-' ? 'left' : 'right',
                    collapseWhitespace: option === '?'
                }
            });
            match = TokenRegex.exec(template);
        }
        return tokens;
    }
    Strings.getTokensFromTemplate = getTokensFromTemplate;
    function interpolate(template, context) {
        if (!template)
            return template;
        template = template.replace(TokenSanitizeRegex, '$${this.$1}');
        return new Function(`return \`${template}\`;`).call(context);
    }
    Strings.interpolate = interpolate;
    function* lines(s) {
        let i = 0;
        while (i < s.length) {
            let j = s.indexOf('\n', i);
            if (j === -1) {
                j = s.length;
            }
            yield s.substring(i, j);
            i = j + 1;
        }
    }
    Strings.lines = lines;
    function pad(s, before = 0, after = 0, padding = `\u00a0`) {
        if (before === 0 && after === 0)
            return s;
        return `${before === 0 ? '' : padding.repeat(before)}${s}${after === 0 ? '' : padding.repeat(after)}`;
    }
    Strings.pad = pad;
    function padLeft(s, padTo, padding = '\u00a0') {
        const diff = padTo - s.length;
        return (diff <= 0) ? s : '\u00a0'.repeat(diff) + s;
    }
    Strings.padLeft = padLeft;
    function padLeftOrTruncate(s, max, padding) {
        if (s.length < max)
            return padLeft(s, max, padding);
        if (s.length > max)
            return truncate(s, max);
        return s;
    }
    Strings.padLeftOrTruncate = padLeftOrTruncate;
    function padRight(s, padTo, padding = '\u00a0') {
        const diff = padTo - s.length;
        return (diff <= 0) ? s : s + '\u00a0'.repeat(diff);
    }
    Strings.padRight = padRight;
    function padOrTruncate(s, max, padding) {
        const left = max < 0;
        max = Math.abs(max);
        if (s.length < max)
            return left ? padLeft(s, max, padding) : padRight(s, max, padding);
        if (s.length > max)
            return truncate(s, max);
        return s;
    }
    Strings.padOrTruncate = padOrTruncate;
    function padRightOrTruncate(s, max, padding) {
        if (s.length < max)
            return padRight(s, max, padding);
        if (s.length > max)
            return truncate(s, max);
        return s;
    }
    Strings.padRightOrTruncate = padRightOrTruncate;
    function truncate(s, truncateTo) {
        if (!s || truncateTo === undefined || s.length <= truncateTo)
            return s;
        return `${s.substring(0, truncateTo - 1)}\u2026`;
    }
    Strings.truncate = truncate;
})(Strings = exports.Strings || (exports.Strings = {}));
//# sourceMappingURL=string.js.map