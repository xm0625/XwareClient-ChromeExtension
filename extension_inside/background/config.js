

var configData = {
    "isInit":0,
    "currentConfigName":"home",
    "config":{
        "home":{
            "remoteUrl":"xm0625.f3322.net",
            "remotePort":"8000",
            "xwareUrl":"127.0.0.1",
            "xwarePort":"9000",
            "password":"123456",
            "loopRefreshSpeedInterval":500,
            "savePathList":[
                "TDDOWNLOAD",
                "video"
            ]
        },
        "office":{
            "remoteUrl":"127.0.0.1",
            "remotePort":"8000",
            "xwareUrl":"127.0.0.1",
            "xwarePort":"9000",
            "password":"123456",
            "loopRefreshSpeedInterval":500,
            "savePathList":[
                "TDDOWNLOAD",
                "video"
            ]
        }
    }
};

function loadConfigData(){
    var dtd = $.Deferred();
    chrome.storage.sync.get("configData", function(data) {
        // Notify that we saved.
        configData = data["configData"];
        dtd.resolve();
    });
    return dtd.promise();
}


function saveConfigData(){
    var dtd = $.Deferred();
    chrome.storage.sync.set({"configData":configData}, function() {
        // Notify that we saved.
        dtd.resolve();
    });
    return dtd.promise();
}

function getConfigValue(key){
    return configData["config"][configData["currentConfigName"]][key];
}

function getCurrentConfigName(){
    return configData["currentConfigName"];
}

function nextConfig(){
    var configNameArray = Object.keys(configData["config"]);
    var configLength = configNameArray.length;
    if(configLength < 2){
        return;
    }
    configNameArray = configNameArray.sort();
    var currentConfigIndex = configNameArray.indexOf(configData["currentConfigName"]);
    var  nextIndex = currentConfigIndex+1>=configLength?0:currentConfigIndex+1;
    configData["currentConfigName"] = configNameArray[nextIndex];
    saveConfigData();
}

function deleteConfig(){
    if(configData["isInit"] == 0){
        return;
    }
    var configNameToDelete = configData["currentConfigName"];

    //切换当前配置
    var configNameArray = Object.keys(configData["config"]);
    var configLength = configNameArray.length;
    if(configLength >= 2){
        configNameArray = configNameArray.sort();
        var currentConfigIndex = configNameArray.indexOf(configData["currentConfigName"]);
        var  nextIndex = currentConfigIndex+1>=configLength?0:currentConfigIndex+1;
        configData["currentConfigName"] = configNameArray[nextIndex];
    }

    delete configData["config"][configNameToDelete];
    saveConfigData();
    if(Object.keys(configData["config"]).length == 0){
        stopLoopRefreshSpeed();
        configData["isInit"] = 0;
        saveConfigData();
        callPage("overview","closeWindow",[]);
        chrome.browserAction.setPopup({popup:"page/popup/jumpToFirstRun.html"});
    }
}

function switchToTargetConfigName(configName){
    if(configName in configData["config"]){
        configData["currentConfigName"] = configName;
        saveConfigData();
    }
}

function setConfigValue(key,value){
    configData["config"][configData["currentConfigName"]][key] = value;
    saveConfigData();
}

function isConfigInited(){
    if(configData && configData["isInit"] && configData["isInit"]==1){
        return true;
    }else{
        return false;
    }
}

function createInitConfig(configName,configMap){
    configData = {
        "isInit":1,
        "currentConfigName":configName,
        "config":{}
    };
    configData["config"][configName] = {
        "remoteUrl":"",
        "remotePort":"",
        "xwareUrl":"",
        "xwarePort":"",
        "password":"",
        "loopRefreshSpeedInterval":1000,
        "savePathList":[
            "TDDOWNLOAD"
        ]
    };
    for(var key in configMap){
        configData["config"][configName][key] = configMap[key];
    }
    saveConfigData();
}


function addConfig(configName,configMap){
    configData["config"][configName] = {
        "remoteUrl":"",
        "remotePort":"",
        "xwareUrl":"",
        "xwarePort":"",
        "password":"",
        "loopRefreshSpeedInterval":1000,
        "savePathList":[
            "TDDOWNLOAD"
        ]
    };
    for(var key in configMap){
        configData["config"][configName][key] = configMap[key];
    }
    configData["currentConfigName"] = configName;
    saveConfigData();
}