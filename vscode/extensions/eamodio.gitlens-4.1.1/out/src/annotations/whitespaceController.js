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
const logger_1 = require("../logger");
var SettingLocation;
(function (SettingLocation) {
    SettingLocation[SettingLocation["workspace"] = 0] = "workspace";
    SettingLocation[SettingLocation["global"] = 1] = "global";
    SettingLocation[SettingLocation["default"] = 2] = "default";
})(SettingLocation || (SettingLocation = {}));
class RenderWhitespaceConfiguration {
    constructor(inspection) {
        this.inspection = inspection;
    }
    get location() {
        if (this.inspection.workspaceValue)
            return SettingLocation.workspace;
        if (this.inspection.globalValue)
            return SettingLocation.global;
        return SettingLocation.default;
    }
    get overrideRequired() {
        return this.value != null && this.value !== 'none';
    }
    get value() {
        return this.inspection.workspaceValue || this.inspection.globalValue || this.inspection.defaultValue;
    }
    update(replacement) {
        let override = false;
        switch (this.location) {
            case SettingLocation.workspace:
                this.inspection.defaultValue = replacement.defaultValue;
                this.inspection.globalValue = replacement.globalValue;
                if (replacement.workspaceValue !== 'none') {
                    this.inspection.workspaceValue = replacement.workspaceValue;
                    override = true;
                }
                break;
            case SettingLocation.global:
                this.inspection.defaultValue = replacement.defaultValue;
                this.inspection.workspaceValue = replacement.workspaceValue;
                if (replacement.globalValue !== 'none') {
                    this.inspection.globalValue = replacement.globalValue;
                    override = true;
                }
                break;
            case SettingLocation.default:
                this.inspection.globalValue = replacement.globalValue;
                this.inspection.workspaceValue = replacement.workspaceValue;
                if (replacement.defaultValue !== 'none') {
                    this.inspection.defaultValue = replacement.defaultValue;
                    override = true;
                }
                break;
        }
        return override;
    }
}
class WhitespaceController extends vscode_1.Disposable {
    constructor() {
        super(() => this.dispose());
        this._count = 0;
        this._disposed = false;
        const subscriptions = [];
        subscriptions.push(vscode_1.workspace.onDidChangeConfiguration(this._onConfigurationChanged, this));
        this._disposable = vscode_1.Disposable.from(...subscriptions);
        this._onConfigurationChanged();
    }
    dispose() {
        return __awaiter(this, void 0, void 0, function* () {
            this._disposed = true;
            if (this._count !== 0) {
                yield this._restoreWhitespace();
                this._count = 0;
            }
        });
    }
    _onConfigurationChanged() {
        if (this._disposed)
            return;
        const inspection = vscode_1.workspace.getConfiguration('editor').inspect('renderWhitespace');
        if (!this._count) {
            this._configuration = new RenderWhitespaceConfiguration(inspection);
            return;
        }
        if (this._configuration.update(inspection)) {
            setTimeout(() => this._overrideWhitespace(), 1);
        }
    }
    override() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._disposed)
                return;
            logger_1.Logger.log(`Request whitespace override; count=${this._count}`);
            this._count++;
            if (this._count === 1 && this._configuration.overrideRequired) {
                yield this._overrideWhitespace();
            }
        });
    }
    _overrideWhitespace() {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.Logger.log(`Override whitespace`);
            const cfg = vscode_1.workspace.getConfiguration('editor');
            return cfg.update('renderWhitespace', 'none', this._configuration.location === SettingLocation.global);
        });
    }
    restore() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._disposed || this._count === 0)
                return;
            logger_1.Logger.log(`Request whitespace restore; count=${this._count}`);
            this._count--;
            if (this._count === 0 && this._configuration.overrideRequired) {
                yield this._restoreWhitespace();
            }
        });
    }
    _restoreWhitespace() {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.Logger.log(`Restore whitespace`);
            const cfg = vscode_1.workspace.getConfiguration('editor');
            return cfg.update('renderWhitespace', this._configuration.location === SettingLocation.default
                ? undefined
                : this._configuration.value, this._configuration.location === SettingLocation.global);
        });
    }
}
exports.WhitespaceController = WhitespaceController;
//# sourceMappingURL=whitespaceController.js.map