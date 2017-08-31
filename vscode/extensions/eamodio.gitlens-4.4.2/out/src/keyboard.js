'use strict';
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
const constants_1 = require("./constants");
const logger_1 = require("./logger");
const keyNoopCommand = Object.create(null);
exports.KeyNoopCommand = keyNoopCommand;
exports.keys = [
    'left',
    'right',
    ',',
    '.',
    'escape'
];
const mappings = [];
let _instance;
class KeyboardScope extends vscode_1.Disposable {
    constructor(mapping) {
        super(() => this.dispose());
        this.mapping = mapping;
        for (const key in mapping) {
            mapping[key] = mapping[key] || keyNoopCommand;
        }
    }
    dispose() {
        return __awaiter(this, void 0, void 0, function* () {
            const index = mappings.indexOf(this.mapping);
            logger_1.Logger.log('KeyboardScope.dispose', mappings.length, index);
            if (index === (mappings.length - 1)) {
                mappings.pop();
                yield this.updateKeyCommandsContext(mappings[mappings.length - 1]);
            }
            else {
                mappings.splice(index, 1);
            }
        });
    }
    begin() {
        return __awaiter(this, void 0, void 0, function* () {
            mappings.push(this.mapping);
            yield this.updateKeyCommandsContext(this.mapping);
            return this;
        });
    }
    clearKeyCommand(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const mapping = mappings[mappings.length - 1];
            if (mapping !== this.mapping || !mapping[key])
                return;
            logger_1.Logger.log('KeyboardScope.clearKeyCommand', mappings.length, key);
            mapping[key] = undefined;
            yield constants_1.setCommandContext(`${constants_1.CommandContext.Key}:${key}`, false);
        });
    }
    setKeyCommand(key, command) {
        return __awaiter(this, void 0, void 0, function* () {
            const mapping = mappings[mappings.length - 1];
            if (mapping !== this.mapping)
                return;
            logger_1.Logger.log('KeyboardScope.setKeyCommand', mappings.length, key, !!mapping[key]);
            if (!mapping[key]) {
                mapping[key] = command;
                yield constants_1.setCommandContext(`${constants_1.CommandContext.Key}:${key}`, true);
            }
            else {
                mapping[key] = command;
            }
        });
    }
    updateKeyCommandsContext(mapping) {
        return __awaiter(this, void 0, void 0, function* () {
            const promises = [];
            for (const key of exports.keys) {
                promises.push(constants_1.setCommandContext(`${constants_1.CommandContext.Key}:${key}`, !!(mapping && mapping[key])));
            }
            yield Promise.all(promises);
        });
    }
}
exports.KeyboardScope = KeyboardScope;
class Keyboard extends vscode_1.Disposable {
    static get instance() {
        return _instance;
    }
    constructor() {
        super(() => this.dispose());
        const subscriptions = [];
        for (const key of exports.keys) {
            subscriptions.push(vscode_1.commands.registerCommand(`${constants_1.ExtensionKey}.key.${key}`, () => this.execute(key), this));
        }
        this._disposable = vscode_1.Disposable.from(...subscriptions);
        _instance = this;
    }
    dispose() {
        this._disposable && this._disposable.dispose();
    }
    beginScope(mapping) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.Logger.log('Keyboard.beginScope', mappings.length);
            return yield new KeyboardScope(mapping ? Object.assign(Object.create(null), mapping) : Object.create(null)).begin();
        });
    }
    execute(key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mappings.length)
                return undefined;
            try {
                const mapping = mappings[mappings.length - 1];
                let command = mapping[key];
                if (typeof command === 'function') {
                    command = yield command();
                }
                if (!command || typeof command.onDidPressKey !== 'function')
                    return undefined;
                logger_1.Logger.log('Keyboard.execute', key);
                return yield command.onDidPressKey(key);
            }
            catch (ex) {
                logger_1.Logger.error(ex, 'Keyboard.execute');
                return undefined;
            }
        });
    }
}
exports.Keyboard = Keyboard;
//# sourceMappingURL=keyboard.js.map