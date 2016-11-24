currentTarget = "taskCreate";

//获取url参数
function getQueryString(name) {
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null) {
        return decodeURIComponent(r[2]);
    }
    return null;
}


function init(){
    if(getQueryString("taskUrl") && getQueryString("taskUrl").length > 0){
        $("#downloadLink").val(getQueryString("taskUrl"));
        detectTaskName();
    }
    reloadSpaceInfo();
    $("#downloadLink").on("blur",function(){
        detectTaskName();
    });
    $("#addTask").on("click",function(){
        onAddTaskButtonClicked();
    })
}

function detectTaskName(){
    var downloadLink = $("#downloadLink").val();
    if(!downloadLink || downloadLink.length == 0){
        $("#taskName").val("unknown");
    }
    if(downloadLink.startsWith("magnet:")){
        if(downloadLink.indexOf("&dn=") == -1){
            $("#taskName").val("unknown");
        }else{
            $("#taskName").val(decodeURIComponent(downloadLink.substring(downloadLink.indexOf("&dn=")+"%dn=".length,downloadLink.length)));
        }
    }
    if(downloadLink.startsWith("ed2k://")){
        var splitArray = downloadLink.split("|");
        if(splitArray.length<5){
            $("#taskName").val("unknown");
        }
        try{
            $("#taskName").val(decodeURIComponent(splitArray[2]));
        }catch(e){
            $("#taskName").val(splitArray[2]);
        }
    }
}

function getRealDownloadUrl(){
    var downloadLink = $("#downloadLink").val();
    if(!downloadLink || downloadLink.length == 0){
        return "";
    }
    if(downloadLink.startsWith("magnet:")){
        if(downloadLink.indexOf("&") == -1){
            return downloadLink;
        }else{
            return downloadLink.substring(0, downloadLink.indexOf("&"));
        }
    }
    return downloadLink;
}

function onAddTaskButtonClicked() {
    $("#addTask").button("loading");
    $.when(callPage("bg","checkDownloadUrlExist",[getRealDownloadUrl()])).then(function(data){
        var dtd = $.Deferred();
        if(data["exist"] == "1"){
            if(data["kind"]=="running"){
                dtd.reject("下载任务中已经存在相同的任务啦");
            }
            if(data["kind"]=="completed"){
                if(confirm("已下载任务中已经存在相同的任务,是否删除任务并创建下载(仅删除任务,不删除已下载的文件)?")){
                    $.when(callPage("bg","deleteTask",[data["id"], 0])).then(function(){
                        dtd.resolve();
                    }).fail(function(){
                        dtd.reject("添加失败");
                    })
                }else{
                    dtd.reject("任务创建已取消");
                }
            }
        }else{
            dtd.resolve();
        }
        return dtd;
    }).then(function(){
        return callPage("bg","createTask",[1,$("#downloadLink").val(),$("#driverSelect").val()+$("#savePath").val(),$("#taskName").val()]);
    }).then(function(){
        alert("添加成功");
        callPage("bg","closeTargetWindow",["page/task/taskCreate.html"]);
    }).fail(function(reason){
        if(!reason || reason.length==0){
            reason = "请重试";
        }
        alert("添加失败,"+reason);
    }).always(function(){
        $("#addTask").button("reset");
    });
}


var defaultLeftSpaceFontColor = $(".leftSpaceSize").css("color");

function reloadSpaceInfo(){

    var showSpaceInfoPromise = function(data){
        var dtd = $.Deferred();

        var spaceList = data["space"];
        if(spaceList.length == 0){
            $(".leftSpaceSize").text("未检测到存储");
            $(".leftSpaceSize").css("color","red");
            dtd.resolve();
        }else{
            $(".leftSpaceSize").css("color",defaultLeftSpaceFontColor);

            //填充space信息
            $("#driverSelect").empty();
            for(var i=0;i<spaceList.length;i++){
                $("#driverSelect").append("<option value='"+spaceList[i]["path"]+":'>"+spaceList[i]["path"]+":</option>");
            }

            var leftSpaceRaw = parseInt(spaceList[0]["remain"]);
            $.when(callPage("bg","formatSpeed",[leftSpaceRaw])).then(function(data){
                $(".leftSpaceSize").text(data);
                dtd.resolve();
            });
        }
        return dtd.promise();
    };

    return $.when(callPage("bg","getBoxSpace",[])).then(showSpaceInfoPromise);
}

init();