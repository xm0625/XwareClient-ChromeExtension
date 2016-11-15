currentTarget = "overview";
var loopRefreshInterval = 1000;

var speedRate = {"G/s":1073741824,"M/s":1048576,"K/s":1024,"B/s":1};
var sizeUnit = {"G":1073741824,"M":1048576,"K":1024,"B":1};

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
    return "0B/s";
}

function formatSize(size){
    for(var sizePattern in sizeUnit){
        if(size > sizeUnit[sizePattern]){
            if((round(size/sizeUnit[sizePattern],0)+"").length <2){
                return round(size/sizeUnit[sizePattern],1)+sizePattern;
            }else{
                return round(size/sizeUnit[sizePattern],0)+sizePattern;
            }
        }
    }
    return "0B";
}

function round(dight,pos){
    dight = Math.round(dight*Math.pow(10,pos))/Math.pow(10,pos);
    return dight;
}

function defBind() {
    $(".startAllTaskButton").on("click",function(){
        $.when(startAllTask()).always(function(){
        });
    });
    $(".pauseAllTaskButton").on("click",function(){
        $.when(pauseAllTask()).always(function(){
        });
    });
    $(".nextProfileButton").on("click",function(){
        switchToWait();
        $.when(switchToNextConfig()).always(function(){
        });
    });
    $(".addProfileButton").on("click",function(){
        callPage("bg","openPage",['page/config/addConfig.html',null,true]);
    });
    $(".deleteProfileButton").on("click",function(){
        callPage("bg","deleteConfig",[]);
    });
    $(".addNewTaskButton").on("click",function(){
        callPage("bg","openPage",['page/task/taskCreate.html',null,true]);
    });
}

function init(){
    loopRefreshData();
    defBind();
}


function loopRefreshData(){
    var updateViewWithDataPromise = function(data){
        return $.when(updateViewWithData(data));
    };
    $.when(callPage("bg","getCurrentConfigName",[])).then(function(data){
        $(".configName").text(data);
    });
    $.when(callPage("bg","getConfigValue",["remoteUrl"])).then(function(data){
        $(".configRemoteUrl").text(data);
    });
    $.when(callPage("bg","getConfigValue",["remotePort"])).then(function(data){
        $(".configPort").text(data);
    });
    $.when(callPage("bg","getStatusData",[])).then(updateViewWithDataPromise).always(function(){
        setTimeout(loopRefreshData,loopRefreshInterval);
    });
}

function startTargetTask(taskId){
    return $.when(callPage("bg","startTask",[taskId]));
}
function pauseTargetTask(taskId){
    return $.when(callPage("bg","pauseTask",[taskId]));
}
function deleteTargetTask(taskId){
    return $.when(callPage("bg","deleteTask",[taskId]));
}
function switchToNextConfig(){
    return $.when(callPage("bg","nextConfig",[]));
}

function getAllTaskIdListString(){
    var targetItems = $(".taskList .taskItem");
    if(targetItems.length==0){
        return "";
    }
    var taskIdList = [];
    targetItems.each(function(i){
        taskIdList[taskIdList.length] =$(this).attr("taskId");
    });
    var taskIdListString = taskIdList.join(",");
    return taskIdListString;
}

function startAllTask(){
    var taskIdListString = getAllTaskIdListString();
    if(taskIdListString==""){
        return;
    }
    return $.when(callPage("bg","startTask",[taskIdListString]));
}

function pauseAllTask(){
    var taskIdListString = getAllTaskIdListString();
    if(taskIdListString==""){
        return;
    }
    return $.when(callPage("bg","pauseTask",[taskIdListString]));
}

function switchToFailed(){
    $(".connectionState").text("连接失败");
    $(".statusHintArea").hide();
    $(".lineBelowStatusHintArea").hide();
}

function switchToSuccess(){
    $(".connectionState").text("连接成功");
    $(".statusHintArea").show();
    $(".lineBelowStatusHintArea").show();
}

function switchToWait(){
    $(".configName").text("--");
    $(".configRemoteUrl").text("--");
    $(".configPort").text("");
    $(".connectionState").text("切换中");
}

function updateViewWithData(data){
    console.log(JSON.stringify(data));
    if(!data || data["code"] != "0"){
        switchToFailed();
        return;
    }

    data = data["data"];
    switchToSuccess();

    var currentDownloadTaskNumber = data["dlNum"];
    var allTaskNumber = data["completeNum"];
    var downloadSpeed = data["dlSpeed"];
    var uploadSpeed = data["upSpeed"];

    $(".downloadingTaskNum").text(currentDownloadTaskNumber);
    $(".totalTaskNum").text(allTaskNumber);
    $(".downloadTotalSpeed").text(formatSpeed(downloadSpeed));
    $(".uploadTotalSpeed").text(formatSpeed(uploadSpeed));

    if(!data["tasks"] || data["tasks"].length==0){
        $(".taskList").empty();
        var dataView = $(".taskEmpty:first").clone();
        dataView.show();
        $(".taskList").append(dataView);
    }else{
        var taskIdMap = {};
        for(var i=0;i<data["tasks"].length;i++){
            var taskItemData = data["tasks"][i];
            var taskId = taskItemData["id"];
            taskIdMap[taskId] = "";
            var taskType = taskItemData["state"];
            var taskName = decodeURIComponent(taskItemData["name"]);
            var taskSpeed = formatSpeed(taskItemData["speed"]);
            var taskPercent = round(taskItemData["progress"]/100.0,2);
            var taskSize = formatSize(taskItemData["size"]);
            var taskRemainTime = "--:--:--";

            var targetItems = $(".taskList  .taskItem[taskId='"+taskId+"']");
            if(targetItems.length==0){

                var dataView = $(".taskItem:first").clone();

                var taskProgressBarTypeClassName = "";

                //正在下载
                if(taskType == "0"){
                    taskProgressBarTypeClassName = "progress-bar-success";
                }
                //等待下载
                if(taskType == "8"){
                    taskProgressBarTypeClassName = "progress-bar-info";
                }
                //已暂停
                if(taskType == "9"){
                    taskProgressBarTypeClassName = "progress-bar-warning";
                }
                if(taskProgressBarTypeClassName == ""){
                    taskProgressBarTypeClassName = "progress-bar-danger";
                }


                dataView.find(".taskTitle").text(taskName);
                dataView.find(".taskSpeed").text(taskSpeed);

                dataView.find(".progress-bar").text(taskPercent+"%");
                dataView.find(".progress-bar").css("width",taskPercent+"%");
                switchToTargetProgressType(dataView.find(".progress-bar"),taskProgressBarTypeClassName);

                dataView.find(".taskSize").text(taskSize);
                dataView.find(".taskRemainTime").text(taskRemainTime);
                dataView.find(".startButton").attr("taskId",taskId);
                dataView.find(".pauseButton").attr("taskId",taskId);
                dataView.find(".deleteButton").attr("taskId",taskId);

                dataView.find(".startButton").on("click",function(){
                    $.when(startTargetTask($(this).attr("taskId"))).always(function(){
                    });
                });
                dataView.find(".pauseButton").on("click",function(){
                    $.when(pauseTargetTask($(this).attr("taskId"))).always(function(){
                    });
                });
                dataView.find(".deleteButton").on("click",function(){
                    $.when(deleteTargetTask($(this).attr("taskId"))).then(function(){
                        alert("删除成功");
                    }).always(function(){
                    });
                });

                dataView.attr("taskId",taskId);
                dataView.show();
                $(".taskList").append(dataView);
            }else{
                var dataView = targetItems;

                var taskProgressBarTypeClassName = "";

                //正在下载
                if(taskType == "0"){
                    taskProgressBarTypeClassName = "progress-bar-success";
                }
                //等待下载
                if(taskType == "8"){
                    taskProgressBarTypeClassName = "progress-bar-info";
                }
                //已暂停
                if(taskType == "9"){
                    taskProgressBarTypeClassName = "progress-bar-warning";
                }
                if(taskProgressBarTypeClassName == ""){
                    taskProgressBarTypeClassName = "progress-bar-danger";
                }


                dataView.find(".taskTitle").text(taskName);
                dataView.find(".taskSpeed").text(taskSpeed);

                dataView.find(".progress-bar").text(taskPercent+"%");
                dataView.find(".progress-bar").css("width",taskPercent+"%");
                switchToTargetProgressType(dataView.find(".progress-bar"),taskProgressBarTypeClassName);

                dataView.find(".taskSize").text(taskSize);
                dataView.find(".taskRemainTime").text(taskRemainTime);
                dataView.find(".startButton").attr("taskId",taskId);
                dataView.find(".pauseButton").attr("taskId",taskId);
                dataView.find(".deleteButton").attr("taskId",taskId);
                dataView.attr("taskId",taskId);
            }
        }

        console.log(taskIdMap);
        var taskIdToRemoveList = [];
        $(".taskList .taskItem").each(function(){
            var taskId = $(this).attr("taskId");
            console.log("taskId:"+taskId);
            if(typeof(taskIdMap[taskId])!="string"){
                console.log("taskIdToRemove:"+taskId);
                taskIdToRemoveList[taskIdToRemoveList.length] = taskId;
            }
        });
        for(var index in taskIdToRemoveList){
            console.log("remove");
            console.log(".taskList  .taskItem[taskId='"+taskIdToRemoveList[index]+"']");
            $(".taskList  .taskItem[taskId='"+taskIdToRemoveList[index]+"']").remove();
        }
    }


}

function switchToTargetProgressType(progressObj,progressBarTypeClassName){
    progressObj.removeClass("progress-bar-success");
    progressObj.removeClass("progress-bar-info");
    progressObj.removeClass("progress-bar-warning");
    progressObj.removeClass("progress-bar-danger");
    progressObj.addClass(progressBarTypeClassName);
}

function closeWindow(){
    window.close();
}

init();
