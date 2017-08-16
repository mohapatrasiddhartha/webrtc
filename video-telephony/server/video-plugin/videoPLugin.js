var siteAdminID;
var webRTCVideoPlugin = (function () {
    var localhosturl=window.location.origin;
    var webRTCHostingURL = localhosturl+'/';
    var siteadminID = siteAdminID;
    var webRTC_videoplugin_HTML = '<aside id="webRTC_video-plugin"><section class="webRTC_main-header"><input type="text" id="webRTC_custName" class="webRTC_left" autofocus placeholder="Enter your name"><button name="startCallButton" type="submit" id="webRTC_custStartCallButton" class="webRTC_left webRTC_button">Start Call</button><button type="submit"  id="webRTC_custEndCallButton" class="webRTC_left webRTC_button">End Call</button><img id ="webRTC_openchat" src="'+webRTCHostingURL+'Customer/img/chat.png" class="webRTC_icon left"/><img id ="webRTC_audiostatus" src ="'+webRTCHostingURL+'Customer/img/audioplay.png" class="webRTC_icon left"><img id ="webRTC_videostatus" src ="'+webRTCHostingURL+'Customer/img/videoplay.png" class="webRTC_icon left"></section><section class="webRTC_main-video-wrapper" id="webRTC_VideoWrapper"><h3 class="webRTC_sub-heading" id="webRTC_agentHeader"> Agent</h3><div id="webRTC_connectMessage"><h5 id="webRTC_connectMessageInfo">Connecting ... Please Wait...</h5><img src="'+webRTCHostingURL+'Customer/img/progressbar.gif" id="webRTC_connectProgressbar" /></div><video id = "webRTC_remoteVideo" autoplay></video><div class = "webRTC_local-video" id="webRTC_LocalVideoWrapper"><h3 class="webRTC_sub-heading">Customer</h3><video id = "webRTC_localVideo" autoplay muted="muted"></video></div></section><div id="webRTC_chatparentdiv"><form method="post" action="#"><div id="webRTC_chatdiv" style="display:none"><h3 id="webRTC_chatheader" class="webRTC_sub-heading"><span>CHAT</span><a href="javascript:void(0)" id="webRTC_chatClose">X</a></h3>   <ul id="webRTC_chatwindow" class="webRTC_chat-window"></ul><input id ="webRTC_chattext" type ="text" placeholder="Enter your text here"><button type="submit" class="webRTC_chat-send-btn" id="webRTC_chatsendButton">Send</button></div></form></div></aside>';
    var webRTC_videoplugin_CSS = [
        'common/css/videoPlugin.css'
    ];
    var webRTC_videoplugin_JS = [
        'common/js/jquery-ui.js',
        'Customer/js/customerCall.js',
        'common/js/client.js',
        'Customer/js/eventListener.js'
    ];
    var appendPluginDiv = function () {
        $('body').append('<div id="webRTC_customerVideoPlugin"></div>');
    };
    var appendPluginHTMLCode = function () {
        $('#webRTC_customerVideoPlugin').html(webRTC_videoplugin_HTML);
    };
    var loadPluginCssURL = function (cssURL) {
        var webRTCPluginCssFiles = document.createElement("link")
        webRTCPluginCssFiles.setAttribute("rel", "stylesheet")
        webRTCPluginCssFiles.setAttribute("type", "text/css")
        webRTCPluginCssFiles.setAttribute("href", webRTCHostingURL + cssURL)
        document.body.appendChild(webRTCPluginCssFiles);
    };
    var loadPluginJsURL = function (jsURL) {
        var webRTCPluginJsFiles = document.createElement("script");
        // set the type attribute
        webRTCPluginJsFiles.type = "application/javascript";
        // make the script element load file
        webRTCPluginJsFiles.src = webRTCHostingURL + jsURL;
        // finally insert the element to the body element in order to load the script
        document.body.appendChild(webRTCPluginJsFiles);
    };
    var appendPluginCssURL = function() {
        var webRTC_videoplugin_CSS_length = webRTC_videoplugin_CSS.length;
        for (var i = 0; i < webRTC_videoplugin_CSS_length; i++) {
            loadPluginCssURL(webRTC_videoplugin_CSS[i]);
        }
    };
    var appendPluginJsURL = function() {
        var webRTC_videoplugin_JS_length = webRTC_videoplugin_JS.length;
        for (var i = 0; i < webRTC_videoplugin_JS_length; i++) {
            loadPluginJsURL(webRTC_videoplugin_JS[i]);
        }
    };
    return{
        webRTCHostingURL:webRTCHostingURL,
        siteadminID: siteadminID,
        appendPluginDiv:appendPluginDiv,
        webRTC_videoplugin_HTML:webRTC_videoplugin_HTML,
        webRTC_videoplugin_CSS:webRTC_videoplugin_CSS,
        webRTC_videoplugin_JS:webRTC_videoplugin_JS,
        appendPluginHTMLCode:appendPluginHTMLCode,
        appendPluginCssURL:appendPluginCssURL,
        appendPluginJsURL:appendPluginJsURL,
        
    }
})()
$(function () {
    webRTCVideoPlugin.appendPluginDiv();
    webRTCVideoPlugin.appendPluginHTMLCode();
    webRTCVideoPlugin.appendPluginCssURL();
    webRTCVideoPlugin.appendPluginJsURL();
});