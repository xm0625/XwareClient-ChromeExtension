
function xwareRequest(method,path,params){
    var postData = {};
    postData["method"] = method;
    postData["url"] = "http://"+getConfigValue("xwareUrl")+":"+getConfigValue("xwarePort")+"/"+path;
    postData["password"] = getConfigValue("password");
    if(method == "GET"){
        postData["url"] = postData["url"] + "?" + decodeURIComponent($.param(params));
    }else{
        postData["postDataString"] = $.param(params);
    }
    //timeout
    return $.ajax({
        type: "POST",
        url: "http://"+getConfigValue("remoteUrl")+":"+getConfigValue("remotePort")+"/",
        data: postData,
        timeout: 1000}).then(parseData).promise();
}

function parseData(data){
    var dtd = $.Deferred();
    
    var statusCode;
    var statusMessage;
    try{
        if(typeof(data) == "string"){
            data = $.parseJSON(data);
        }
        statusCode = data["code"];
        statusMessage = data["message"];
    }catch(e){
        dtd.reject("解析数据错误");
        return dtd.promise();
    }
    if(statusCode == "1"){
        try{
            var dataResult = data["result"];
            if(typeof(dataResult) == "string"){
                dataResult = $.parseJSON(dataResult);
            }
            dtd.resolve(dataResult);
            return dtd.promise();
        }catch(e){
            dtd.reject("解析数据错误");
            return dtd.promise();
        }
    }
    if(statusCode == "-1"){
        dtd.reject(statusMessage);
        return dtd.promise();
    }
}

function getList(){
    //RUNNING = 0
    //COMPLETED = 1
    //RECYCLED = 2
    //FAILED_ON_SUBMISSION = 3
    var params = {
        "v":2,
        "type":0,
        "pos":0,
        "number":999999,
        "needUrl":1,
        "abs_path":1,
        "fixed_id":0
    };
    return xwareRequest("GET","list",params);
}

function getCompletedTaskList(){
    var params = {
        "v":2,
        "type":1,
        "pos":0,
        "number":999999,
        "needUrl":1,
        "abs_path":1,
        "fixed_id":0
    };
    return xwareRequest("GET","list",params);
}

function getSettting(){
    var params = {
        "v":2
    };
    return xwareRequest("GET","settings",params);
}

function getBoxSpace(){
    var params = {
        "v":2
    };
    return xwareRequest("GET","boxSpace",params);
}

function urlCheck(type,url){
    //type   1:url   2:BT File
    var params = {
        "v":2,
        "type":type,
        "url":url
    };
    return xwareRequest("GET","urlCheck",params);
}

function createTask(type,url,path,name){
    //type   1:url   2:BT File
    //name 无实际作用 但不能为空
    var params = {
        "v":2,
        "type":type,
        "url":url,
        "path":path,
        "name":name,
        "fixed_id":1
    };
    return xwareRequest("GET","createOne",params);
}

function startTask(taskIdListString){
    var params = {
        "tasks":taskIdListString,
        "v":2
    };
    return xwareRequest("GET","start",params);
}

function pauseTask(taskIdListString){
    var params = {
        "tasks":taskIdListString,
        "v":2
    };
    return xwareRequest("GET","pause",params);
}


function deleteTask(taskIdListString,isDeleteFile){
    //isDeleteFile   1 true  0 false
    var params = {
        "tasks":taskIdListString,
        "v":2,
        "deleteFile":isDeleteFile
    };
    return xwareRequest("GET","del",params);
}
