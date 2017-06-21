(function () {
    window.GITHISTORY = {};
    let clipboard;
    function initializeClipboard() {
        $('a.clipboard-link').addClass('hidden');
        clipboard = new Clipboard('.btn.clipboard');
        clipboard.on('success', onCopied);
    }
    function onCopied(e) {
        e.clearSelection();
    }
    $(document).ready(() => {
        initializeClipboard();
        window.GITHISTORY.generateSVG();
        window.GITHISTORY.initializeDetailsView();
    });
})();
//# sourceMappingURL=proxy.js.map