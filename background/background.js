currentTarget = "bg";
/**
 * 数据模型
 * **/
var totalSpeed = -1;//总速度

var totalDownloadTaskNumber = 0;//当前未完成任务数
var statusData = {"code":"0", "data":{"rtn":0,"dlNum":0,"completeNum":2,"recycleNum":0,"dlSpeed":0,"upSpeed":0,"tasks":[]}};//状态数据
/**
 * 数据模型-End
 * **/

var speedRate = {"G":1073741824,"M":1048576,"K":1024,"B":1};

var loopRefreshSpeedStatus = 0; //0:停止,就绪状态,可以开始 1:开始执行已经发出,尚未运行 2:正在运行 3:结束指令已发出,尚未停止


function getTotalSpeed(){
    return totalSpeed;
}

function getStatusData(){
    return statusData;
}

function setTotalSpeed(totalSpeedVar){
    totalSpeed = totalSpeedVar;
}

function formatSpeed(speed){
    for(var speedPattern in speedRate){
        if(speed > speedRate[speedPattern]){
            if((round(speed/speedRate[speedPattern],0)+"").length <2){
                return round(speed/speedRate[speedPattern],1)+speedPattern;
            }else{
                return round(speed/speedRate[speedPattern],0)+speedPattern;
            }
        }
    }
    return "0B";
}

function setBadgeText(text){
    chrome.browserAction.setBadgeText({text: text});
}

function round(dight,pos){
    dight = Math.floor(dight*Math.pow(10,pos))/Math.pow(10,pos);
    return dight;
}



function startLoopRefreshSpeed(){
    if(loopRefreshSpeedStatus!=0){
        console.log("速度显示模块尚未就绪,请稍后再试");
        return;
    }
    loopRefreshSpeedStatus = 1;
    loopRefreshSpeed();
}

function stopLoopRefreshSpeed(){
    loopRefreshSpeedStatus = 3;
}

function loopRefreshSpeed(){
    if(loopRefreshSpeedStatus == 1){
        loopRefreshSpeedStatus = 2;
    }
    if(loopRefreshSpeedStatus == 3){
        loopRefreshSpeedStatus = 0;
    }
    if(loopRefreshSpeedStatus != 2){
        return;
    }
    $.when(getList()).done(function(data){
        console.log(data);
        statusData = {"code":"0", "data":data};
        totalSpeed = data["dlSpeed"];
        totalDownloadTaskNumber = data["dlNum"];
        if(totalDownloadTaskNumber > 0){
            setBadgeText(formatSpeed(totalSpeed));
        }else{
            setBadgeText("√");
        }
    }).fail(function(error){
        statusData = {"code":"-1", "data":{}};
        setBadgeText("x");
        console.log(error);
    }).always(function(){
        setTimeout(loopRefreshSpeed,getConfigValue("loopRefreshSpeedInterval"));
    });
}

function checkDownloadUrlExist(downloadUrl){
    var dtd = $.Deferred();
    var taskArray = statusData["data"]["tasks"];


    //在正在下载中查找
    for(var i in taskArray){
        var taskItem = taskArray[i];
        console.log(decodeURIComponent(taskItem["url"]));
        if(decodeURIComponent(taskItem["url"]) == decodeURIComponent(downloadUrl)){
            dtd.resolve({"exist":"1", "kind": "running", "id":taskItem["id"]});
            return dtd;
        }
    }

    //在已下载中查找
    $.when(getCompletedTaskList()).then(function(data){
        taskArray = data["tasks"];
        for(var i in taskArray){
            var taskItem = taskArray[i];
            console.log(decodeURIComponent(taskItem["url"]));
            if(decodeURIComponent(taskItem["url"]) == decodeURIComponent(downloadUrl)){
                dtd.resolve({"exist":"1", "kind": "completed", "id":taskItem["id"]});
                return;
            }
        }
        dtd.resolve({"exist":"0"});
    }).fail(function(){
        dtd.reject("networkError");
    });

    return dtd;
}

function showTaskCreate(taskUrl){
    var sendTaskUrlPromise = function(){
        return callPage("taskCreate","receiveTaskUrl",[taskUrl]);
    };
    $.when(openPage('page/task/taskCreate.html',{"taskUrl":taskUrl},true)).then(sendTaskUrlPromise).done(function(data){
        console.log(data);
    });
}

function openPage(pageUrl,params,isOnly){

    var openNewPagePromise = function(){
        return openNewPage(pageUrl,params);
    };

    if(isOnly){
        return $.when(closeTargetWindow(pageUrl)).then(openNewPagePromise);
    }else{
        return openNewPagePromise;
    }
}

function openNewPage(pageUrl,params){
    var dtd = $.Deferred();

    chrome.windows.getCurrent(function(win){
        var topValue =  win.top;
        var leftValue =  win.left;
        var widthValue =  win.width;
        var heightValue =  win.height;

        var newWindowWidth = 770;
        var newWindowHeight = 600;
        var newWindowTop = Math.round((heightValue-newWindowHeight)/2+topValue);
        var newWindowLeft = Math.round((widthValue-newWindowWidth)/2+leftValue);

        var url = params?chrome.extension.getURL(pageUrl)+ "?" + $.param(params):chrome.extension.getURL(pageUrl);
        chrome.tabs.create({
            url: url,
            active: false
        }, function(tab) {
            // After the tab has been created, open a window to inject the tab
            chrome.windows.create({
                tabId: tab.id,
                type: 'panel',//popup
                focused: true,
                width:newWindowWidth,
                height:newWindowHeight,
                top:newWindowTop,
                left:newWindowLeft
                // incognito, top, left, ...
            });
            console.log("tab.id="+tab.id);

            dtd.resolve(tab.id);
        });
    });
    return dtd.promise();
}



function prepareConfig() {
    var dtd = $.Deferred();
    $.when(loadConfigData()).then(function(){
        if(isConfigInited()){
            dtd.resolve();
        }else{
            dtd.reject();
        }
    });
    return dtd.promise();
}

function init(){
    $.when(prepareConfig()).done(function(){
        chrome.browserAction.setPopup({popup:"page/popup/overview.html"});
        startLoopRefreshSpeed();
    }).fail(function(){
        chrome.browserAction.setPopup({popup:"page/popup/jumpToFirstRun.html"});
        $.when(openPage('page/config/firstRun.html',null,true))
    });
}

init();


