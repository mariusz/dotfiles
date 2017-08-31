"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler_1 = require("./errorHandler");
const path = require('path');
const readPkgUp = require('read-pkg-up');
function findPkg(fspath, pkgName) {
    const res = readPkgUp.sync({ cwd: fspath, normalize: false });
    if (res.pkg &&
        ((res.pkg.dependencies && res.pkg.dependencies[pkgName]) ||
            (res.pkg.devDependencies && res.pkg.devDependencies[pkgName]))) {
        return path.resolve(res.path, '..', 'node_modules/', pkgName);
    }
    else if (res.path) {
        return findPkg(path.resolve(path.dirname(res.path), '..'), pkgName);
    }
    return;
}
function requireLocalPkg(fspath, pkgName) {
    const modulePath = findPkg(fspath, pkgName);
    if (modulePath !== void 0) {
        try {
            return require(modulePath);
        }
        catch (e) {
            errorHandler_1.addToOutput(`Failed to load ${pkgName} from ${modulePath}. Using bundled`);
        }
    }
    return require(pkgName);
}
exports.requireLocalPkg = requireLocalPkg;
//# sourceMappingURL=requirePkg.js.map