/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
'use strict';
var vscode_languageserver_1 = require('vscode-languageserver');
var ID = (function () {
    function ID() {
    }
    ID.next = function () {
        return "" + ID.base + ID.counter++;
    };
    ID.base = Date.now().toString() + "-";
    ID.counter = 0;
    return ID;
}());
function makeDiagnostic(problem) {
    var message = (problem.ruleId != null)
        ? problem.message + " (" + problem.ruleId + ")"
        : "" + problem.message;
    return {
        message: message,
        severity: convertSeverity(problem.severity),
        source: 'eslint',
        range: {
            start: { line: problem.line - 1, character: problem.column - 1 },
            end: { line: problem.line - 1, character: problem.column - 1 }
        },
        code: problem.ruleId
    };
}
function computeKey(diagnostic) {
    var range = diagnostic.range;
    return "[" + range.start.line + "," + range.start.character + "," + range.end.line + "," + range.end.character + "]-" + diagnostic.code;
}
var codeActions = Object.create(null);
function recordCodeAction(document, diagnostic, problem) {
    if (!problem.fix || !problem.ruleId) {
        return;
    }
    var uri = document.uri;
    var edits = codeActions[uri];
    if (!edits) {
        edits = Object.create(null);
        codeActions[uri] = edits;
    }
    edits[computeKey(diagnostic)] = { label: "Fix this " + problem.ruleId + " problem", documentVersion: document.version, ruleId: problem.ruleId, edit: problem.fix };
}
function convertSeverity(severity) {
    switch (severity) {
        // Eslint 1 is warning
        case 1:
            return vscode_languageserver_1.DiagnosticSeverity.Warning;
        case 2:
            return vscode_languageserver_1.DiagnosticSeverity.Error;
        default:
            return vscode_languageserver_1.DiagnosticSeverity.Error;
    }
}
var connection = vscode_languageserver_1.createConnection(new vscode_languageserver_1.IPCMessageReader(process), new vscode_languageserver_1.IPCMessageWriter(process));
var lib = null;
var settings = null;
var options = null;
var documents = new vscode_languageserver_1.TextDocuments();
// The documents manager listen for text document create, change
// and close on the connection
documents.listen(connection);
// A text document has changed. Validate the document.
documents.onDidChangeContent(function (event) {
    validateSingle(event.document);
});
connection.onInitialize(function (params) {
    var rootPath = params.rootPath;
    return vscode_languageserver_1.Files.resolveModule(rootPath, 'eslint').then(function (value) {
        if (!value.CLIEngine) {
            return new vscode_languageserver_1.ResponseError(99, 'The eslint library doesn\'t export a CLIEngine. You need at least eslint@1.0.0', { retry: false });
        }
        lib = value;
        var result = { capabilities: { textDocumentSync: documents.syncKind, codeActionProvider: true } };
        return result;
    }, function (error) {
        return Promise.reject(new vscode_languageserver_1.ResponseError(99, 'Failed to load eslint library. Please install eslint in your workspace folder using \'npm install eslint\' or globally using \'npm install -g eslint\' and then press Retry.', { retry: true }));
    });
});
function getMessage(err, document) {
    var result = null;
    if (typeof err.message === 'string' || err.message instanceof String) {
        result = err.message;
        result = result.replace(/\r?\n/g, ' ');
        if (/^CLI: /.test(result)) {
            result = result.substr(5);
        }
    }
    else {
        result = "An unknown error occured while validating file: " + vscode_languageserver_1.Files.uriToFilePath(document.uri);
    }
    return result;
}
function validate(document) {
    var CLIEngine = lib.CLIEngine;
    var cli = new CLIEngine(options);
    var content = document.getText();
    var uri = document.uri;
    // Clean previously computed code actions.
    delete codeActions[uri];
    var report = cli.executeOnText(content, vscode_languageserver_1.Files.uriToFilePath(uri));
    var diagnostics = [];
    if (report && report.results && Array.isArray(report.results) && report.results.length > 0) {
        var docReport = report.results[0];
        if (docReport.messages && Array.isArray(docReport.messages)) {
            docReport.messages.forEach(function (problem) {
                if (problem) {
                    var diagnostic = makeDiagnostic(problem);
                    diagnostics.push(diagnostic);
                    recordCodeAction(document, diagnostic, problem);
                }
            });
        }
    }
    // Publish the diagnostics
    return connection.sendDiagnostics({ uri: uri, diagnostics: diagnostics });
}
function validateSingle(document) {
    try {
        validate(document);
    }
    catch (err) {
        connection.window.showErrorMessage(getMessage(err, document));
    }
}
function validateMany(documents) {
    var tracker = new vscode_languageserver_1.ErrorMessageTracker();
    documents.forEach(function (document) {
        try {
            validate(document);
        }
        catch (err) {
            tracker.add(getMessage(err, document));
        }
    });
    tracker.sendErrors(connection);
}
connection.onDidChangeConfiguration(function (params) {
    settings = params.settings;
    if (settings.eslint) {
        options = settings.eslint.options || {};
    }
    // Settings have changed. Revalidate all documents.
    validateMany(documents.all());
});
connection.onDidChangeWatchedFiles(function (params) {
    // A .eslintrc has change. No smartness here.
    // Simply revalidate all file.
    validateMany(documents.all());
});
var Fixes = (function () {
    function Fixes(edits) {
        this.edits = edits;
        this.keys = Object.keys(edits);
    }
    Fixes.overlaps = function (lastEdit, newEdit) {
        return !!lastEdit && lastEdit.edit.range[1] > newEdit.edit.range[0];
    };
    Fixes.prototype.isEmpty = function () {
        return this.keys.length === 0;
    };
    Fixes.prototype.getDocumentVersion = function () {
        return this.edits[this.keys[0]].documentVersion;
    };
    Fixes.prototype.getScoped = function (diagnostics) {
        var result = [];
        for (var _i = 0, diagnostics_1 = diagnostics; _i < diagnostics_1.length; _i++) {
            var diagnostic = diagnostics_1[_i];
            var key = computeKey(diagnostic);
            var editInfo = this.edits[key];
            if (editInfo) {
                result.push(editInfo);
            }
        }
        return result;
    };
    Fixes.prototype.getAllSorted = function () {
        var _this = this;
        var result = this.keys.map(function (key) { return _this.edits[key]; });
        return result.sort(function (a, b) {
            var d = a.edit.range[0] - b.edit.range[0];
            if (d !== 0) {
                return d;
            }
            if (a.edit.range[1] === 0) {
                return -1;
            }
            if (b.edit.range[1] === 0) {
                return 1;
            }
            return a.edit.range[1] - b.edit.range[1];
        });
    };
    Fixes.prototype.getOverlapFree = function () {
        var sorted = this.getAllSorted();
        if (sorted.length <= 1) {
            return sorted;
        }
        var result = [];
        var last = sorted[0];
        result.push(last);
        for (var i = 1; i < sorted.length; i++) {
            var current = sorted[i];
            if (!Fixes.overlaps(last, current)) {
                result.push(current);
                last = current;
            }
        }
        return result;
    };
    return Fixes;
}());
connection.onCodeAction(function (params) {
    var result = [];
    var uri = params.textDocument.uri;
    var edits = codeActions[uri];
    if (!edits) {
        return result;
    }
    var fixes = new Fixes(edits);
    if (fixes.isEmpty()) {
        return result;
    }
    var textDocument = documents.get(uri);
    var documentVersion = -1;
    var ruleId;
    function createTextEdit(editInfo) {
        return vscode_languageserver_1.TextEdit.replace(vscode_languageserver_1.Range.create(textDocument.positionAt(editInfo.edit.range[0]), textDocument.positionAt(editInfo.edit.range[1])), editInfo.edit.text || '');
    }
    for (var _i = 0, _a = fixes.getScoped(params.context.diagnostics); _i < _a.length; _i++) {
        var editInfo = _a[_i];
        documentVersion = editInfo.documentVersion;
        ruleId = editInfo.ruleId;
        result.push(vscode_languageserver_1.Command.create(editInfo.label, 'eslint.applySingleFix', uri, documentVersion, [
            createTextEdit(editInfo)
        ]));
    }
    ;
    if (result.length > 0) {
        var same = [];
        var all = [];
        function getLastEdit(array) {
            var length = array.length;
            if (length === 0) {
                return undefined;
            }
            return array[length - 1];
        }
        for (var _b = 0, _c = fixes.getAllSorted(); _b < _c.length; _b++) {
            var editInfo = _c[_b];
            if (documentVersion === -1) {
                documentVersion = editInfo.documentVersion;
            }
            if (editInfo.ruleId === ruleId && !Fixes.overlaps(getLastEdit(same), editInfo)) {
                same.push(editInfo);
            }
            if (!Fixes.overlaps(getLastEdit(all), editInfo)) {
                all.push(editInfo);
            }
        }
        if (same.length > 1) {
            result.push(vscode_languageserver_1.Command.create("Fix all " + ruleId + " problems", 'eslint.applySameFixes', uri, documentVersion, same.map(createTextEdit)));
        }
        if (all.length > 1) {
            result.push(vscode_languageserver_1.Command.create("Fix all auto-fixable problems", 'eslint.applyAllFixes', uri, documentVersion, all.map(createTextEdit)));
        }
    }
    return result;
});
var AllFixesRequest;
(function (AllFixesRequest) {
    AllFixesRequest.type = { get method() { return 'textDocument/eslint/allFixes'; } };
})(AllFixesRequest || (AllFixesRequest = {}));
connection.onRequest(AllFixesRequest.type, function (params) {
    var result = null;
    var uri = params.textDocument.uri;
    var textDocument = documents.get(uri);
    var edits = codeActions[uri];
    function createTextEdit(editInfo) {
        return vscode_languageserver_1.TextEdit.replace(vscode_languageserver_1.Range.create(textDocument.positionAt(editInfo.edit.range[0]), textDocument.positionAt(editInfo.edit.range[1])), editInfo.edit.text || '');
    }
    if (edits) {
        var fixes = new Fixes(edits);
        if (!fixes.isEmpty()) {
            result = {
                documentVersion: fixes.getDocumentVersion(),
                edits: fixes.getOverlapFree().map(createTextEdit)
            };
        }
    }
    return result;
});
connection.listen();
//# sourceMappingURL=server.js.map