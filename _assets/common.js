$(function(){
    document.title = "FrogNotebook";
    if($("#home").length > 0){
        $("#home").attr("href", sessionStorage.getItem("rootPath"));
    }
})

function refreshRootPath(){
    sessionStorage.setItem("rootPath", location.pathname);
}