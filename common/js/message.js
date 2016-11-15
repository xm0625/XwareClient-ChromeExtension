var requestDeferredObject = {};
var deferredTimeout = 3000;

var currentTarget = "";
//注册监听器和其他页面通讯
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(request);
        var target = request.target;
        var requestId = request.requestId;

        if(target && target != currentTarget){
            return;
        }
        var deferredObject = requestDeferredObject[requestId];
        if(deferredObject){
            delete requestDeferredObject[requestId];
            if(request.code == 0){
                deferredObject.resolve(request.result);
            }
            if(request.code == -1){
                deferredObject.reject(request.exception);
            }
        }

        var functionName = request.functionName;
        var functionParamArray = request.functionParamArray;
        if(functionName){
            try{
                $.when(eval(functionName).apply(this, functionParamArray)).done(function(result){
                    chrome.runtime.sendMessage({requestId:requestId,code:0,result:result});
                }).fail(function(error){
                    chrome.runtime.sendMessage({requestId:requestId,code:-1,exception:exception});
                });
            }catch(e){
                var exception = e.message? e.message:e;
                chrome.runtime.sendMessage({requestId:requestId,code:-1,exception:exception});
            }
        }
    }
);


function callPage(target,functionName,functionParamArray){
    var dtd =  $.Deferred();
    var requestId = Math.random()*100000000000000000+"";
    requestDeferredObject[requestId] = dtd;
    chrome.runtime.sendMessage({"target":target,"requestId":requestId,"functionName":functionName,"functionParamArray":functionParamArray});
    setTimeout(function(){
        var deferredObject = requestDeferredObject[requestId];
        if(deferredObject) {
            delete requestDeferredObject[requestId];
            deferredObject.reject("timeout");
        }
    },deferredTimeout);
    return dtd.promise();
}
