if (isMobile.Android() == "Android") {
    function doOnOrientationChange()
    {
        var localvidoediv = document.getElementById("localvidoediv");
        var remotevidoediv = document.getElementById("remotevidoediv");
        var chatwindow = document.getElementById("chatparentdiv");

        switch (window.orientation)
        {
            case -90:
            case 90:

                localvidoediv.style.width = '200px';
                localvidoediv.style.height = '110px';

                chatwindow.style.width = '200px';
                chatwindow.style.height = '110px';

                remotevidoediv.style.width = '250px';
                remotevidoediv.style.height = '160px';
                break;
            default:

                localvidoediv.style.width = '150px';
                localvidoediv.style.height = '150px';

                chatwindow.style.width = '150px';
                chatwindow.style.height = '150px';

                remotevidoediv.style.width = '200px';
                remotevidoediv.style.height = '200px';
                break;
        }
    }

    window.addEventListener('orientationchange', doOnOrientationChange);


    // Initial execution if needed
    doOnOrientationChange();

}
function agentEndCall() {
    var btn = document.getElementById("agentEndCallButton");
    //btn.disabled = true;
    //btn.style.opacity = "0.2";
    btn.style.display = "none";
    endCall();
    sendInfoToServer('agent', 'closevideo');
}
function disableButtons() {

    var btn1 = document.getElementById("acceptCallButton");
    //btn1.disabled = true;
    //btn1.style.opacity = "0.2";
    btn1.style.display = "none";

    var btn = document.getElementById("agentEndCallButton");
    btn.style.display = "none";
    //btn.style.display ="none"
    //btn.disabled = true;
    //btn.style.opacity = "0.2";
}
function preventBack() {
    window.history.forward();
}
setTimeout("preventBack()", 0);
window.onunload = function () {
    null
};