"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function walkObject(object, keyPath, defaultValue = undefined) {
    const pathParts = keyPath.split('.');
    const currentStep = pathParts.shift();
    if (pathParts.length === 0) {
        return object.hasOwnProperty(currentStep) ? object[currentStep] : defaultValue;
        ;
    }
    else if (object.hasOwnProperty(currentStep)) {
        return walkObject(object[currentStep], pathParts.join('.'), defaultValue);
    }
    else {
        return defaultValue;
    }
}
exports.walkObject = walkObject;
//# sourceMappingURL=objectpath.js.map