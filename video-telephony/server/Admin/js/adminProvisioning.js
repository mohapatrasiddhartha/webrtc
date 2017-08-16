document.getElementById("adminLoginBtn").addEventListener("click", function(event){
    validateAdmin();
    event.preventDefault();
});
function isAuthenticated() {
    //alert(sessionStorage.getItem("authenticated"));
    if (sessionStorage.getItem("adminauthenticated") == "true") {
        window.location.replace("adminhome.html");
    }
}
$(function(){
    isAuthenticated();
});