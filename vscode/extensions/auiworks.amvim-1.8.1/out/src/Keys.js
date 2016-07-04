"use strict";
exports.raws = [].concat('backspace delete escape left right up down'
    .split(' '), 'cruwfb['
    .split('').map(function (key) { return ("ctrl+" + key); }));
//# sourceMappingURL=Keys.js.map