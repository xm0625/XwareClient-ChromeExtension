

function closeTargetWindow(tabPath){
    var dtd =  $.Deferred();
    chrome.tabs.query({url:chrome.extension.getURL(tabPath)+"*"}, function(tabs){
        if(tabs.length >0){
            chrome.windows.remove(tabs[0].windowId,function(){
                dtd.resolve();
            });
        }else{
            dtd.resolve();
        }
    });
    return dtd.promise();
}