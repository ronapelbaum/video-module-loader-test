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
    
    // write html to iframe with script
    function method1 (container, onload, mainCallback, scriptUrl) {
        const iframe = createIframe();
        container.appendChild(iframe);
        iframe.contentWindow['moduleLoaded'] = function (iframeWindow) {
            iframeWindow[mainCallback](iframe.contentDocument.body, onload);
        }
        const moduleLoadedScript = 'moduleLoaded(window)';
        const iframeHtml = `<html><body><script type="text/javascript" src="${scriptUrl}"></script><script type="text/javascript">${moduleLoadedScript}</script></body></html>`;    
        iframe.contentDocument.open();
        iframe.contentDocument.write(iframeHtml);
        iframe.contentDocument.close();
    }
    
    // append activetion script to iframe
    function method2 (container, onload, mainCallback) {
        const iframe = createIframe();
        container.appendChild(iframe);
        iframe.contentWindow['moduleLoaded'] = function () {
            window[mainCallback](iframe.contentDocument.body, onload);
        }
        const scriptElement = iframe.contentDocument.createElement('script');
        scriptElement.innerHTML = 'moduleLoaded()';
        iframe.contentDocument.body.appendChild(scriptElement);
    }
    
    // use iframe onload and use script from parent
    function method3 (container, onload, mainCallback) {
        const iframe = createIframe();
        iframe.onload = function () {
            window[mainCallback](iframe.contentDocument.body, onload);
        };
        container.appendChild(iframe);
    }
    
    return function loadModule(container, options = {}, onload){
        // cleanContainer(container);
        
        switch (options.method){
            case 1:
            method1(container, onload, options.mainCallback, options.scriptUrl);
            break;
            
            case 2:
            method2(container, onload, options.mainCallback);
            break;
            
            case 3: 
            method3(container, onload, options.mainCallback);
            break;
            
            default: 
            // do nothing
        }
    }
}());