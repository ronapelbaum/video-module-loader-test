window.loadModule = (function (){
    function cleanContainer (container) {
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
    }
    
    function createIframe () {
        const iframe = document.createElement('iframe');
        
        iframe.src = 'javascript:void(0)';
        iframe.width = '100%';
        iframe.height = '100%';
        iframe.scrolling = 'no';
        iframe.frameBorder = 0;
        iframe.marginHeight = 0;
        iframe.marginWidth = 0;
        
        return iframe;
    }
    
    function createModuleLoadedCllback (mainCallback, onLoadCallback, onIframeWindow) {
        return function (iframeWindow) {
            const win = onIframeWindow ? iframeWindow : window;
            win[mainCallback](iframeWindow.document.body, onLoadCallback);
        };    
    }
    
    function writeToIframe(iframe, moduleLoadedScript, scriptUrl) {
        const scriptHtml = scriptUrl ? `<script type="text/javascript" src="${scriptUrl}"></script>` : '';
        const iframeHtml = `<html><body>${scriptHtml}<script type="text/javascript">${moduleLoadedScript}</script></body></html>`;    
        iframe.contentDocument.open();
        iframe.contentDocument.write(iframeHtml);
        iframe.contentDocument.close();
    }
    
    function appendToItrame (iframe, moduleLoadedScript) {
        const scriptElement = iframe.contentDocument.createElement('script');
        scriptElement.innerHTML = moduleLoadedScript;
        iframe.contentDocument.body.appendChild(scriptElement);
    }
    
    return function loadModule(container, options = {}, onload){
        // cleanContainer(container);
        
        const iframe = createIframe();
        container.appendChild(iframe);
        
        const moduleLoadedName = 'moduleLoded';
        const moduleLoadedScript = `${moduleLoadedName}(window)`;
        const moduleLoadedFunction = createModuleLoadedCllback(options.mainCallback, onload, options.mainInIframe);
        
        iframe.contentWindow[`${moduleLoadedName}`] = moduleLoadedFunction
        
        if (options.writeHtml) {
            writeToIframe(iframe, moduleLoadedScript, options.scriptUrl);
        } else {
            appendToItrame(iframe, moduleLoadedScript)
        }
    }
}());