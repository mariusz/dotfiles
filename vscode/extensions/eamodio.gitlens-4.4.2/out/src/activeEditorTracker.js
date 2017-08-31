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
const system_1 = require("./system");
const vscode_1 = require("vscode");
const constants_1 = require("./constants");
class ActiveEditorTracker extends vscode_1.Disposable {
    constructor() {
        super(() => this.dispose());
        const fn = system_1.Functions.debounce((e) => this._resolver && this._resolver(e), 50);
        this._disposable = vscode_1.window.onDidChangeActiveTextEditor(fn);
    }
    dispose() {
        this._disposable && this._disposable.dispose();
    }
    awaitClose(timeout = 500) {
        return __awaiter(this, void 0, void 0, function* () {
            this.close();
            return this.wait(timeout);
        });
    }
    awaitNext(timeout = 500) {
        return __awaiter(this, void 0, void 0, function* () {
            this.next();
            return this.wait(timeout);
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            return vscode_1.commands.executeCommand(constants_1.BuiltInCommands.CloseActiveEditor);
        });
    }
    next() {
        return __awaiter(this, void 0, void 0, function* () {
            return vscode_1.commands.executeCommand(constants_1.BuiltInCommands.NextEditor);
        });
    }
    wait(timeout = 500) {
        return __awaiter(this, void 0, void 0, function* () {
            const editor = yield new Promise((resolve, reject) => {
                let timer;
                this._resolver = (e) => {
                    if (timer) {
                        clearTimeout(timer);
                        timer = 0;
                        resolve(e);
                    }
                };
                timer = setTimeout(() => {
                    resolve(vscode_1.window.activeTextEditor);
                    timer = 0;
                }, timeout);
            });
            this._resolver = undefined;
            return editor;
        });
    }
}
exports.ActiveEditorTracker = ActiveEditorTracker;
//# sourceMappingURL=activeEditorTracker.js.map