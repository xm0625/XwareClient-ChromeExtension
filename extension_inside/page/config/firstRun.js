currentTarget = "firstRun";


function onSaveConfigButtonClicked() {
    $("#saveConfigButton").button("loading");
    $.when(saveNewConfig()).done(function(){
        alert("保存成功");
        callPage("bg","init",[]);
        callPage("bg","closeTargetWindow",["page/config/firstRun.html"]);
    }).always(function(){
        $("#saveConfigButton").button("reset");
    });
}

function saveNewConfig(){
    var configName = $("#configNameInput").val();
    var configMap = {
        "remoteUrl":$("#remoteUrlInput").val(),
        "remotePort":$("#remotePortInput").val(),
        "xwareUrl":$("#xwareUrlInput").val(),
        "xwarePort":$("#xwarePortInput").val(),
        "password":$("#passwordInput").val(),
    };

    return callPage("bg","createInitConfig",[configName,configMap]);
}

function init(){
    $("#saveConfigButton").on("click",function(){
        onSaveConfigButtonClicked();
    })
}

init();