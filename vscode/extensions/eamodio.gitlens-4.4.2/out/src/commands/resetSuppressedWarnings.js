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
const system_1 = require("../system");
const common_1 = require("./common");
const messages_1 = require("../messages");
class ResetSuppressedWarningsCommand extends common_1.Command {
    constructor(context) {
        super(common_1.Commands.ResetSuppressedWarnings);
        this.context = context;
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const key of system_1.Objects.values(messages_1.SuppressedKeys)) {
                yield this.context.globalState.update(key, false);
            }
        });
    }
}
exports.ResetSuppressedWarningsCommand = ResetSuppressedWarningsCommand;
//# sourceMappingURL=resetSuppressedWarnings.js.map