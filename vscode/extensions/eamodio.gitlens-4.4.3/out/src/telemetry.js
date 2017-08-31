'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const configuration_1 = require("./configuration");
const os = require("os");
let _reporter;
class Telemetry extends vscode_1.Disposable {
    static configure(key) {
        const cfg = vscode_1.workspace.getConfiguration().get(configuration_1.ExtensionKey);
        if (!cfg.advanced.telemetry.enabled || !vscode_1.workspace.getConfiguration('telemetry').get('enableTelemetry', true))
            return;
        _reporter = new TelemetryReporter(key);
    }
    static setContext(context) {
        if (_reporter === undefined)
            return;
        _reporter.setContext(context);
    }
    static trackEvent(name, properties, measurements) {
        if (_reporter === undefined)
            return;
        _reporter.trackEvent(name, properties, measurements);
    }
    static trackException(ex) {
        if (_reporter === undefined)
            return;
        _reporter.trackException(ex);
    }
}
exports.Telemetry = Telemetry;
class TelemetryReporter {
    constructor(key) {
        const diagChannelState = process.env['APPLICATION_INSIGHTS_NO_DIAGNOSTIC_CHANNEL'];
        process.env['APPLICATION_INSIGHTS_NO_DIAGNOSTIC_CHANNEL'] = true;
        this.appInsights = require('applicationinsights');
        process.env['APPLICATION_INSIGHTS_NO_DIAGNOSTIC_CHANNEL'] = diagChannelState;
        if (this.appInsights.client) {
            this._client = this.appInsights.getClient(key);
            this._client.channel.setOfflineMode(true);
        }
        else {
            this._client = this.appInsights.setup(key)
                .setAutoCollectRequests(false)
                .setAutoCollectPerformance(false)
                .setAutoCollectExceptions(false)
                .setAutoCollectDependencies(false)
                .setAutoCollectConsole(false)
                .setAutoDependencyCorrelation(false)
                .setOfflineMode(true)
                .start()
                .client;
        }
        this.setContext();
        this._stripPII(this._client);
    }
    setContext(context) {
        if (!this._context) {
            this._context = Object.create(null);
            this._context['code.language'] = vscode_1.env.language;
            this._context['code.version'] = vscode_1.version;
            this._context[this._client.context.keys.sessionId] = vscode_1.env.sessionId;
            this._context['os.platform'] = os.platform();
            this._context['os.version'] = os.release();
        }
        if (context) {
            Object.assign(this._context, context);
        }
        Object.assign(this._client.commonProperties, this._context);
    }
    trackEvent(name, properties, measurements) {
        this._client.trackEvent(name, properties, measurements);
    }
    trackException(ex) {
        this._client.trackException(ex);
    }
    _stripPII(client) {
        if (client && client.context && client.context.keys && client.context.tags) {
            const machineNameKey = client.context.keys.deviceMachineName;
            client.context.tags[machineNameKey] = '';
        }
    }
}
exports.TelemetryReporter = TelemetryReporter;
//# sourceMappingURL=telemetry.js.map