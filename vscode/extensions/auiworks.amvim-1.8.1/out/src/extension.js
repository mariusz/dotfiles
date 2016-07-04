"use strict";
var Configuration_1 = require('./Configuration');
var Dispatcher_1 = require('./Dispatcher');
var dispatcher;
function activate(context) {
    Configuration_1.Configuration.init();
    dispatcher = new Dispatcher_1.Dispatcher(context);
    context.subscriptions.push(Configuration_1.Configuration, dispatcher);
}
exports.activate = activate;
function currentModeId() {
    return dispatcher ? dispatcher.currentModeId : null;
}
exports.currentModeId = currentModeId;
//# sourceMappingURL=extension.js.map