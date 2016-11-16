currentTarget = "contentScript";

init();

function init(){
    sniffSpecialLink();
}

function sniffSpecialLink(){
    $("a").each(function(){
        if(!$(this).attr("href") || (!$(this).attr("href").startsWith("magnet:") && !$(this).attr("href").startsWith("ed2k://"))){
            return;
        }

        $(this).click(function(event){
            event.preventDefault();
            var downloadUrl = $(this).attr("href");
            console.log("downloadUrl:\t"+downloadUrl);
            callPage("bg","showTaskCreate",[downloadUrl]);
        });
    });
}


