'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("./common");
class ToggleCodeLensCommand extends common_1.EditorCommand {
    constructor(git) {
        super(common_1.Commands.ToggleCodeLens);
        this.git = git;
    }
    execute(editor, edit) {
        return this.git.toggleCodeLens(editor);
    }
}
exports.ToggleCodeLensCommand = ToggleCodeLensCommand;
//# sourceMappingURL=toggleCodeLens.js.map