document.getElementById("loginAgentBtn").addEventListener("click",function(event){
    validateAgent();
    event.preventDefault();
});
document.getElementById("agentLoginCancel").addEventListener("click",onAgentLoginCancel);
document.getElementById("agentLoginDone").addEventListener("click",onAgentLoginDone);
function isAuthenticated() {
    //alert(sessionStorage.getItem("authenticated"));
    if (sessionStorage.getItem("authenticated") == "true") {
        if (isMobile.Android() != "Android") {
            window.location.replace("index.html");
        } else {
            window.location.replace("mobileindex.html");
        }
    }
}

$(function(){
    isAuthenticated();
});
