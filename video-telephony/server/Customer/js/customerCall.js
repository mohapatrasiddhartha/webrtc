var customerCall = (function () {
    var establishcall = function () {
        startSession("user", "video");
        startVideo("user");    
    };
    var custEndCall = function () {
        sendInfoToServer('user', 'closevideo');
        endCall();
        disableendcall();
    };
    var startChat= function(){
        startChatWindow();
    }
    var enablepreviews = function () {
        var remotediv = document.getElementById("webRTC_VideoWrapper");
        remotediv.style.visibility = "visible";
        var localdiv = document.getElementById("webRTC_LocalVideoWrapper");
        localdiv.style.visibility = "visible";
        var divprogbar = document.getElementById('webRTC_connectMessage');
        divprogbar.style.display = "block";
        var status = document.getElementById('webRTC_connectMessageInfo');
        status.style.visibility = "visible";
        status.innerHTML = "Connecting ... Please Wait...";
        var progbar = document.getElementById('webRTC_connectProgressbar');
        progbar.style.visibility = "visible";
        var remotevid = document.getElementById('webRTC_remoteVideo');
        remotevid.style.display = "none";
    };
    var disableendcall = function () {
        var btn = document.getElementById("webRTC_custEndCallButton");
        btn.style.display = "none";
        var btn1 = document.getElementById("webRTC_custStartCallButton");
        btn1.style.display = "block";
    };
    var updateCustomerDesign = function () {
        $.ajax({url: "../video-plugin/chatService.json", success: function (response) {
                var newCustomedPlugin= JSON.parse(response);
                var customedNewMainHeaderClass=newCustomedPlugin.mainHeaderClass;
                var customedNewSubHeaderClass=newCustomedPlugin.subHeaderClass;
                $('.webRTC_main-header').removeClass('webRTC_main-header').addClass(customedNewMainHeaderClass);
                $('.webRTC_sub-heading').removeClass('webRTC_sub-heading').addClass(customedNewSubHeaderClass);
            }
        });
    };
    var pluginMovable = function() {
      $('#webRTC_video-plugin').draggable({
          containment: "body", 
          scroll: false
      });  
    };
    var custAdminId="";
    var init = function() {
//        updateCustomerDesign();
//        pluginMovable();
    };
    return{
        establishcall: establishcall,
        custEndCall: custEndCall,
        enablepreviews: enablepreviews,
        disableendcall: disableendcall,
        custAdminId:custAdminId,
        startChat:startChat,
        init:init
    }
})();
