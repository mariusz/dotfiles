"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
class Spinner {
    constructor() {
        this.state = 0;
    }
    nextState(possibleStates) {
        let newStateValue = this.state + 1;
        if (newStateValue >= possibleStates.length) {
            newStateValue = 0;
        }
        this.state = newStateValue;
    }
    getStates() {
        const properties = vscode_1.workspace.getConfiguration('gitblame');
        return properties.get('progressSpinner');
    }
    updatable() {
        return this.getStates().length > 1;
    }
    toString() {
        const states = this.getStates();
        this.nextState(states);
        return states[this.state];
    }
}
exports.Spinner = Spinner;
//# sourceMappingURL=spinner.js.map