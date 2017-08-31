"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const easymotion_1 = require("./easymotion");
const position_1 = require("./../../../common/motion/position");
const mode_1 = require("./../../../mode/mode");
const configuration_1 = require("./../../../configuration/configuration");
const actions_1 = require("./../../commands/actions");
const base_1 = require("./../../base");
class BaseEasyMotionCommand extends actions_1.BaseCommand {
    constructor(baseOptions) {
        super();
        this.modes = [mode_1.ModeName.Normal, mode_1.ModeName.Visual, mode_1.ModeName.VisualLine, mode_1.ModeName.VisualBlock];
        this._baseOptions = baseOptions;
    }
    getMatchPosition(match) {
        return match.position;
    }
    processMarkers(matches, position, vimState) {
        // Clear existing markers, just in case
        vimState.easyMotion.clearMarkers();
        let index = 0;
        for (const match of matches) {
            const pos = this.getMatchPosition(match);
            if (!match.position.isEqual(position)) {
                const marker = easymotion_1.EasyMotion.generateMarker(index++, matches.length, position, pos);
                if (marker) {
                    vimState.easyMotion.addMarker(marker);
                }
            }
        }
    }
    searchOptions(position) {
        switch (this._baseOptions.searchOptions) {
            case 'min':
                return { min: position };
            case 'max':
                return { max: position };
            default:
                return {};
        }
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            // Only execute the action if the configuration is set
            if (!configuration_1.Configuration.easymotion) {
                return vimState;
            }
            else {
                // Search all occurences of the character pressed
                const matches = this.getMatches(position, vimState);
                // Stop if there are no matches
                if (matches.length === 0) {
                    return vimState;
                }
                else {
                    vimState.easyMotion = new easymotion_1.EasyMotion();
                    this.processMarkers(matches, position, vimState);
                    if (matches.length === 1) {
                        // Only one found, navigate to it
                        const marker = vimState.easyMotion.markers[0];
                        // Set cursor position based on marker entered
                        vimState.cursorPosition = marker.position;
                        vimState.easyMotion.clearDecorations();
                        return vimState;
                    }
                    else {
                        // Store mode to return to after performing easy motion
                        vimState.easyMotion.previousMode = vimState.currentMode;
                        // Enter the EasyMotion mode and await further keys
                        vimState.currentMode = mode_1.ModeName.EasyMotionMode;
                        return vimState;
                    }
                }
            }
        });
    }
}
function getMatchesForString(position, vimState, searchString, options) {
    switch (searchString) {
        case '':
            return [];
        case ' ':
            // Searching for space should only find the first space
            return vimState.easyMotion.sortedSearch(position, new RegExp(' {1,}', 'g'), options);
        default:
            // Search all occurences of the character pressed
            const ignorecase = configuration_1.Configuration.ignorecase && !(configuration_1.Configuration.smartcase && /[A-Z]/.test(searchString));
            const regexFlags = ignorecase ? 'gi' : 'g';
            return vimState.easyMotion.sortedSearch(position, new RegExp(searchString, regexFlags), options);
    }
}
class SearchByCharCommand extends BaseEasyMotionCommand {
    constructor(options) {
        super(options);
        this._searchString = '';
        this._options = options;
    }
    getMatches(position, vimState) {
        return getMatchesForString(position, vimState, this._searchString, this.searchOptions(position));
    }
    updateSearchString(s) {
        this._searchString = s;
    }
    getSearchString() {
        return this._searchString;
    }
    shouldFire() {
        const charCount = this._options.charCount;
        return charCount ? this._searchString.length >= charCount : true;
    }
    fire(position, vimState) {
        return this.exec(position, vimState);
    }
    getMatchPosition(match) {
        const { line, character } = match.position;
        switch (this._options.labelPosition) {
            case 'after':
                return new position_1.Position(line, character + this._options.charCount);
            case 'before':
                return new position_1.Position(line, Math.max(0, character - 1));
            default:
                return match.position;
        }
    }
}
exports.SearchByCharCommand = SearchByCharCommand;
class SearchByNCharCommand extends BaseEasyMotionCommand {
    constructor() {
        super({});
        this._searchString = '';
    }
    updateSearchString(s) {
        this._searchString = s;
    }
    getSearchString() {
        return this._searchString;
    }
    getMatches(position, vimState) {
        return getMatchesForString(position, vimState, this.removeTrailingLineBreak(this._searchString), {});
    }
    removeTrailingLineBreak(s) {
        return s.replace(new RegExp('\n+$', 'g'), '');
    }
    shouldFire() {
        // Fire when <CR> typed
        return this._searchString.endsWith('\n');
    }
    fire(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.removeTrailingLineBreak(this._searchString) === '') {
                return vimState;
            }
            else {
                return this.exec(position, vimState);
            }
        });
    }
}
exports.SearchByNCharCommand = SearchByNCharCommand;
class EasyMotionCharMoveCommandBase extends actions_1.BaseCommand {
    constructor(trigger, action) {
        super();
        this.modes = [mode_1.ModeName.Normal, mode_1.ModeName.Visual, mode_1.ModeName.VisualLine, mode_1.ModeName.VisualBlock];
        this._action = action;
        this.keys = ['<leader>', '<leader>', ...trigger.split('')];
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            vimState.easyMotion = new easymotion_1.EasyMotion();
            vimState.easyMotion.previousMode = vimState.currentMode;
            vimState.easyMotion.searchAction = this._action;
            vimState.globalState.hl = true;
            vimState.currentMode = mode_1.ModeName.EasyMotionInputMode;
            return vimState;
        });
    }
}
exports.EasyMotionCharMoveCommandBase = EasyMotionCharMoveCommandBase;
class EasyMotionWordMoveCommandBase extends BaseEasyMotionCommand {
    constructor(trigger, options = {}) {
        super(options);
        this._options = options;
        this.keys = ['<leader>', '<leader>', ...trigger.split('')];
    }
    getMatches(position, vimState) {
        return this.getMatchesForWord(position, vimState, this.searchOptions(position));
    }
    getMatchPosition(match) {
        const { line, character } = match.position;
        switch (this._options.labelPosition) {
            case 'after':
                return new position_1.Position(line, character + match.text.length - 1);
            default:
                return match.position;
        }
    }
    getMatchesForWord(position, vimState, options) {
        // Search for the beginning of all words after the cursor
        return vimState.easyMotion.sortedSearch(position, new RegExp('\\w{1,}', 'g'), options);
    }
}
exports.EasyMotionWordMoveCommandBase = EasyMotionWordMoveCommandBase;
class EasyMotionLineMoveCommandBase extends BaseEasyMotionCommand {
    constructor(trigger, options) {
        super(options);
        this._options = options;
        this.keys = ['<leader>', '<leader>', ...trigger.split('')];
    }
    getMatches(position, vimState) {
        return this.getMatchesForLineStart(position, vimState, this.searchOptions(position));
    }
    getMatchesForLineStart(position, vimState, options) {
        // Search for the beginning of all non whitespace chars on each line before the cursor
        const matches = vimState.easyMotion.sortedSearch(position, new RegExp('^.', 'gm'), options);
        for (const match of matches) {
            match.position = match.position.getFirstLineNonBlankChar();
        }
        return matches;
    }
}
exports.EasyMotionLineMoveCommandBase = EasyMotionLineMoveCommandBase;
let EasyMotionCharInputMode = class EasyMotionCharInputMode extends actions_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.EasyMotionInputMode];
        this.keys = ['<character>'];
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = this.keysPressed[0];
            const action = vimState.easyMotion.searchAction;
            const oldSearchString = action.getSearchString();
            const newSearchString = key === '<BS>' || key === '<shift+BS>' ? oldSearchString.slice(0, -1) : oldSearchString + key;
            action.updateSearchString(newSearchString);
            if (action.shouldFire()) {
                // Skip Easymotion input mode to make sure not to back to it
                vimState.currentMode = vimState.easyMotion.previousMode;
                const state = yield action.fire(vimState.cursorPosition, vimState);
                return state;
            }
            return vimState;
        });
    }
};
EasyMotionCharInputMode = __decorate([
    base_1.RegisterAction
], EasyMotionCharInputMode);
let CommandEscEasyMotionCharInputMode = class CommandEscEasyMotionCharInputMode extends actions_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.EasyMotionInputMode];
        this.keys = ['<Esc>'];
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            vimState.currentMode = mode_1.ModeName.Normal;
            return vimState;
        });
    }
};
CommandEscEasyMotionCharInputMode = __decorate([
    base_1.RegisterAction
], CommandEscEasyMotionCharInputMode);
let MoveEasyMotion = class MoveEasyMotion extends actions_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.EasyMotionMode];
        this.keys = ['<character>'];
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = this.keysPressed[0];
            if (!key) {
                return vimState;
            }
            else {
                // "nail" refers to the accumulated depth keys
                const nail = vimState.easyMotion.accumulation + key;
                vimState.easyMotion.accumulation = nail;
                // Find markers starting with "nail"
                const markers = vimState.easyMotion.findMarkers(nail, true);
                // If previous mode was visual, restore visual selection
                if (vimState.easyMotion.previousMode === mode_1.ModeName.Visual ||
                    vimState.easyMotion.previousMode === mode_1.ModeName.VisualLine ||
                    vimState.easyMotion.previousMode === mode_1.ModeName.VisualBlock) {
                    vimState.cursorStartPosition = vimState.lastVisualSelectionStart;
                    vimState.cursorPosition = vimState.lastVisualSelectionEnd;
                }
                if (markers.length === 1) {
                    // Only one found, navigate to it
                    const marker = markers[0];
                    vimState.easyMotion.clearDecorations();
                    // Restore the mode from before easy motion
                    vimState.currentMode = vimState.easyMotion.previousMode;
                    // Set cursor position based on marker entered
                    vimState.cursorPosition = marker.position;
                    return vimState;
                }
                else {
                    if (markers.length === 0) {
                        // None found, exit mode
                        vimState.easyMotion.clearDecorations();
                        vimState.currentMode = vimState.easyMotion.previousMode;
                        return vimState;
                    }
                    else {
                        return vimState;
                    }
                }
            }
        });
    }
};
MoveEasyMotion = __decorate([
    base_1.RegisterAction
], MoveEasyMotion);
//# sourceMappingURL=easymotion.cmd.js.map