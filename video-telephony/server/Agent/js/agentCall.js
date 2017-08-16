var agentCall = (function () {
    var init = function () {
        disableButtons();
        startSession('agent', 'video');
        fetchAndDisplayAgentList('agent');
        fetchAgentRolesAndDepartments();
        setTimeout(preventBack(), 0);
    };
    var disableButtons = function () {
        var btn1 = document.getElementById("acceptCallButton");
        //btn1.disabled = true;
        //btn1.style.opacity = "0.2";
        btn1.style.display = "none";

        var btn = document.getElementById("agentEndCallButton");
        btn.style.display = "none";
        //btn.style.display ="none"
        //btn.disabled = true;
        //btn.style.opacity = "0.2";
    };
    var agentEndCall = function () {
        var btn = document.getElementById("agentEndCallButton");
        //btn.disabled = true;
        //btn.style.opacity = "0.2";
        btn.style.display = "none";
        endCall();
        sendInfoToServer('agent', 'closevideo');
    };
    var preventBack = function () {
        window.history.forward();
    };
    return{
        init: init,
        agentEndCall: agentEndCall
    }
})();
agentCall.init();
window.onunload = function () {
    null;
};