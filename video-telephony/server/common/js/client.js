//sourcevid, remotevid for customer side displaying video 
var sourcevid = document.getElementById('sourcevid');								//source video
var remotevid;								//remote video 1

var getUserMedia = null;
getUserMedia = navigator.mozGetUserMedia || navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.msGetUserMedia;				//a wrapper for getusermedia for all browsers
var stunServer = "stun.l.google.com:19302";												//ice servers list
var socketServer = "ws://" + location.hostname + ":8080";
var PeerConnection = window.mozRTCPeerConnection || window.PeerConnection || window.webkitPeerConnection00 || window.webkitRTCPeerConnection;	//wrapper for RTC peer connection
var IceCandidate = window.mozRTCIceCandidate || window.RTCIceCandidate;						//wrapper for RTCIceCandidate
RTSessionDescription = window.mozRTCSessionDescription || window.RTCSessionDescription;		//wrapper for RTCSessionDescription
var URL = window.URL || window.webkitURL || window.msURL || window.oURL;
var CALL_TRANSFER = "Call Transfering ... Please Wait...";
var CALL_CONNECTING = "Call Connecting ... Please Wait...";	//wrapper for window.URL
var mediaConstraints = {//Constraints for creating offer and answer
    "mandatory": {
        "OfferToReceiveAudio": true,
        "OfferToReceiveVideo": true
    }
};
var chatConstraints = {//Constraints for creating offer and answer
    "mandatory": {
        "OfferToReceiveAudio": false,
        "OfferToReceiveVideo": false
    }
};
if (getUserMedia) {
    getUserMedia = getUserMedia.bind(navigator);
}
var socket = null;																							//socket for websocket
var localStream = null;
var peerConn = null;																				//peer connection object
var available_users = new Array();
var caller_id = null;
var chatwindow = document.getElementById('webRTC_chatwindow');
var chattext = document.getElementById('webRTC_chattext');
var isChatEstablished = false;
var isVideoCallEstablished = false;
//flag to check if the first call was made
var Call_Events = {
    CUST_CALL: 'customer_call',
    CALL_CONNECT: 'connect_call',
    CUST_OFFER: 'offer',
    AGENT_ANSWER: 'answer',
    CANDIDATE: 'candidate',
    AGENT_UNAVAILABLE: 'unavailable',
    NOTIFY: 'notify',
    KEEP_ALIVE: 'keep_alive'
};
var agentId;
var agentname;
var agentCompanyCode;
var agtId = "-1";
var custId = "-1";
var STATES = {WAITING: 'Waiting other client', IN_PROGRESS: 'Connection in progress...', CONNECTED: 'Connected', ERROR_NAV: 'Your navigator is not compatible'};	//enum connection state

var logg = function (s) {//console.log(s);
};															//function for logging
function errorCallback() {																			//errorCallback for createoffer and answer methods
    //console.log("there was an error");
}
;
function updateState(current_state) {																//to update the state of a connection
    //console.log(current_state);
    // status_coonection.innerHTML = current_state;
}
var type = "user";
/**
 * start Video.
 */
function startVideo() {

    //successcallback for getusermedia
    function successCallback(stream) {
        localStream = stream;
        if (type == "user") {
            document.getElementById('webRTC_localVideo').src = URL.createObjectURL(stream);
        }
        else if (type == "agent") {
            document.getElementById('sourcevid').src = URL.createObjectURL(stream);
        }
        updateState(STATES.WAITING);
        if (type == "user") {
            startCustomerCall();
        } else if (type == "agent") {
            peerConn.addStream(localStream);
            peerConn.createAnswer(setLocalAndSendMessage, errorCallback, mediaConstraints);
        }
        /*if(type == "agent"){
         var mute = document.getElementById('mutelist');
         mute.style.visibility = 'visible';
         }*/
    }
    //error callback for getusermedia
    function errorCallback(error) {
        alert(error);
        var progbar = document.getElementById('webRTC_connectProgressbar');
        progbar.style.visibility = "hidden";
        var status = document.getElementById('webRTC_connectMessageInfo');
        status.style.visibility = "hidden";
        logg('An error occurred: [CODE ' + error.code + ']');
        updateState(STATES.ERROR_NAV);
    }
    try {
        getUserMedia({video: true, audio: true}, successCallback, errorCallback);
    } catch (e) {
        try {
            getUserMedia("video,audio", successCallback, errorCallback);
        } catch (e) {

            updateState(STATES.ERROR_NAV);
        }
    }
}
function enableAudio() {
    var audioicon = document.getElementById('webRTC_audiostatus');
    if (type == "agent") {
        audioicon = document.getElementById('audiostatus');
    }
    if (localStream.getAudioTracks()[0].enabled) {
        audioicon.src = "img/audiostop.png";
    } else {
        audioicon.src = "img/audioplay.png";
    }
    localStream.getAudioTracks()[0].enabled =
            !(localStream.getAudioTracks()[0].enabled);
}
function enableVideo() {
    var videoicon = document.getElementById('webRTC_videostatus');
    if (type == "agent") {
        videoicon = document.getElementById('videostatus');
    }
    if (localStream.getVideoTracks()[0].enabled) {
        videoicon.src = "img/videostop.png";
    } else {
        videoicon.src = "img/videoplay.png";
    }
    localStream.getVideoTracks()[0].enabled =
            !(localStream.getVideoTracks()[0].enabled);

}
/**
 * start User/Agent Session.
 */
function startSession(usertype, mediatype) {
    addEvent(window, "resize", resizeVideo);
    if (usertype == "agent") {
        if (sessionStorage.getItem("authenticated") != "true") {
            window.location = "Agentlogin.html";
            return;
        }
        type = "agent";
        agentname = sessionStorage.getItem("agentname");
        agentId = sessionStorage.getItem("agentid");
        agentCompanyCode = sessionStorage.getItem("agentCompanyCode")
    } else {
        agentId = "-1";//incase of user;
        //alert("inside startsession before : "+sessionStorage.getItem("custid"));
        if (sessionStorage.getItem("custid") == null) {
            custId = generateUUID();
        } else {
            custId = sessionStorage.getItem("custid");
        }
        //alert("inside startsession after: "+custId);
        sessionStorage.setItem("custid", custId);
        type = "user";
    }
    if (socket == null) {
        socket = new WebSocket(socketServer);															//websocket is created and an event listener is added to it
        socket.addEventListener("message", onMessage, false);
        socket.addEventListener('open', function (event) {
            if (usertype == 'agent') {
                var agent = document.getElementById("agentheader");
                agent.innerHTML = "Logged in as :" + "  " + agentname.toUpperCase();

                sendMessage({'type': 'client_info', 'user_type': usertype, 'agentname': agentname, 'agentid': agentId, 'agentCompanyCode': agentCompanyCode});
                sendKeepAliveAgentEvents(agentId);
            } else {
                if (agtId == "-1") {
                    custname = document.getElementById('webRTC_custName').value;
                    //  sendMessage({});
                    sendMessage({'type': 'client_info', 'user_type': usertype, 'custname': custname, 'custid': custId, 'customerWebValue': webRTCVideoPlugin.siteadminID});
                }
                if (mediatype == "chat") {
                    sendMessage({'type': Call_Events.CUST_CALL, 'id': "-1", 'media_type': 'chat'});
                }
            }
        }, false);
    }
}

function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}
/**
 * resize Video.
 */
function resizeVideo() {
    var agenthdr;
    if (type == "user") {
        remoteviddiv = document.getElementById('webRTC_VideoWrapper');
        remotevid = document.getElementById('webRTC_remoteVideo');
        agenthdr = document.getElementById('webRTC_agentHeader');
    } else {
        remoteviddiv = document.getElementById('remotevidoediv');
        remotevid = document.getElementById('remotevid');
        agenthdr = document.getElementById('agentheader');
    }
    remotevid.width = remoteviddiv.offsetWidth;
    remotevid.height = remoteviddiv.offsetHeight - agenthdr.offsetHeight;
}
//function for sending any message to the server
function sendMessage(message) {
    var mymsg = JSON.stringify(message);
    logg("SEND: " + mymsg);
    console.log("****************************************" + mymsg);
    socket.send(mymsg);
}
//function to set local description and send the same to the server
function setLocalAndSendMessage(sessionDescription) {
    sessionDescription['media_type'] = mediaType;
    sessionDescription['id'] = agtId;
    peerConn.setLocalDescription(sessionDescription);
    sendMessage(sessionDescription);
}

//callback for onicecandidate event
function onIceCandidate(event) {
    if (event.candidate) {
        sendMessage({type: 'candidate', sdpMLineIndex: event.candidate.sdpMLineIndex, sdpMid: event.candidate.sdpMid, candidate: event.candidate.candidate});
    } else {
        logg("End of candidates");
    }
}
//callback for onaddstream event
function onRemoteStreamAdded(event) {
    var remoteviddiv;
    // alert(type);
    var header;
    if (type == "user") {
        remoteviddiv = document.getElementById('webRTC_VideoWrapper');
        remotevid = document.getElementById('webRTC_remoteVideo');
        remotevid.style.display = "block";
        header = document.getElementById('webRTC_agentHeader');
    } else {
        remoteviddiv = document.getElementById('remotevidoediv');
        remotevid = document.getElementById('remotevid');
        header = document.getElementById('customerheader');
    }

    remotevid.src = URL.createObjectURL(event.stream);
    //remotevid.style.display="block";

    remotevid.width = remoteviddiv.offsetWidth;
    remotevid.height = remoteviddiv.offsetHeight - header.offsetHeight;
    //alert(remotevid.height);
    if (type == "user") {
        btn = document.getElementById("webRTC_custStartCallButton");
        btn.style.display = "none";
        var btn = document.getElementById("webRTC_custEndCallButton");
        btn.style.display = "block";
    }

    remotevid.autoplay = true;
    if (type == "user") {
        var progbar = document.getElementById('webRTC_connectMessage');
        progbar.style.display = "none";
    }
    updateState(STATES.CONNECTED);
    if (type == "user") {
        var agentheader = document.getElementById('webRTC_agentHeader');
        //agentheader.innerHTML = "AGENT" + " : "+agentname.toUpperCase(); 
        var string = agentheader.innerHTML;
        agentduration('webRTC_agentHeader', agentheader.innerHTML);
    }
}
function sendInfoToServer(usertype, closetype) {
    //alert("Video call established "+isVideoCallEstablished+"Is ChatEstablished "+isChatEstablished);
    //alert(agtId);
    if (usertype == "agent") {
        agtId = agentId;
        socket.send(JSON.stringify({'type': 'rejectcall', 'id': agtId, 'usertype': usertype, 'isVideo': isVideoCallEstablished, 'isChat': isChatEstablished, 'closetype': closetype, 'agentCompanyCode': agentCompanyCode}));
    }
    else {
        socket.send(JSON.stringify({'type': 'rejectcall', 'id': agtId, 'usertype': usertype, 'isVideo': isVideoCallEstablished, 'isChat': isChatEstablished, 'closetype': closetype, 'customerWebValue': webRTCVideoPlugin.siteadminID}));
    }
    if (peerConn == null) {
        agtId = "-1";
    }
}
function closeChatSession() {
    if (type == "agent") {
        agtId = agentId;
    }
    socket.send(JSON.stringify({'type': 'closechat', 'id': agtId, 'usertype': type}));
}
//callback for oniceconnectionstatechange
function onIceConnectionStateChange(event) {

    if (peerConn != null && peerConn.iceConnectionState == 'completed') {

    } else if (peerConn != null && (peerConn.iceConnectionState == 'failed' || peerConn.iceConnectionState == 'disconnected')) {
        //alert("connection disconnected");


    }

}
/**
 * start Customer call.
 */
function startCustomerCall() {
    mediaType = "video";
    //alert("start: "+agtId);
    if (agtId == "-1") {
        socket.send(JSON.stringify({'customerWebValue': webRTCVideoPlugin.siteadminID, 'type': Call_Events.CUST_CALL, 'id': agtId, 'media_type': 'video'}));
    } else {
        //alert("start call after chat");
        //if(peerConn){		
        //alert("Create Offer called ");
        //peerConn.createOffer(setLocalAndSendMessage, errorCallback, mediaConstraints);
        if (peerConn) {
            peerConn.close();
            //agtId = "-1";
        }
        socket.send(JSON.stringify({'customerWebValue': webRTCVideoPlugin.siteadminID, 'type': Call_Events.CUST_CALL, 'id': agtId, 'media_type': 'video'}));
        // }
    }
}

function transferClick()
{
    //console.log("transfering btw "+ caller +" "+ callee);
    var agentrole = document.getElementById('agentrole');
    var selectedItem = agentrole.options[agentrole.selectedIndex].value;
    var type = agentrole.options[agentrole.selectedIndex].id;
    //alert("Transfer call "+custId);
    socket.send(JSON.stringify({'type': 'transfer_call', 'caller': custId, 'transfer_type': type, 'selected': selectedItem,'customerWebValue': agentCompanyCode}));
}
//callback for onremovestream
function onRemoteStreamRemoved(event) {

    next();
}
var timer;
function sendKeepAliveAgentEvents(id) {
    if (type == 'agent') {
        timer = setInterval(function () {
            sendKeepAlive(id)
        }, 45000);
    }
}
function sendKeepAlive(id) {
    var d = new Date();
    var currentTime = d.getTime();
    socket.send(JSON.stringify({'type': Call_Events.KEEP_ALIVE, 'time': currentTime, 'id': id}));
}
function Logout() {
    endCall();
    updateAgentStatus('offline');
    if (socket) {
        socket.close();
        socket.send({typed: 'logout'})
        socket = null;
    }
    clearInterval(timer);
    window.location.replace("Agentlogin.html");
    sessionStorage.removeItem("authenticated");
}
//function to create a new peer connection
function createPeerConnection() {
    try {
        updateState(STATES.IN_PROGRESS);

        //creating peer connection

        peerConn = new PeerConnection({'iceServers': [{'url': 'stun:' + stunServer}]});

        //setting callbacks for peer connection events
        peerConn.onicecandidate = onIceCandidate;
        peerConn.onaddstream = onRemoteStreamAdded;
        peerConn.onremovestream = onRemoteStreamRemoved;
        peerConn.oniceconnectionstatechange = onIceConnectionStateChange;
        //alert("Peer connection created");
        if (type == "agent") {
            //alert("Data channel Added on customer side");
            peerConn.ondatachannel = function (event) {

                console.log("here");
                receiveChannel = event.channel;
                receiveChannel.onmessage = function (event) {
                    //var text = chattext.value;
                    //dataChannel.send(text);
                    var chatdiv = document.getElementById('chatdiv');
                    chatdiv.style.display = 'block';
                    var chaticon = document.getElementById('openchat');
                    chaticon.style.display = "none";
                    isChatEstablished = true;
                    chatwindow.innerHTML += "<li style =\"padding-Left:5px;padding-Top:5px;background-color:#c5d0e5;\">" + custname + " : " + event.data + "</li>";
                    chatwindow.scrollTop = chatwindow.scrollHeight;
                    if (!isMobile.Android()) {
                        chattext.focus();
                    }
                };
                receiveChannel.onopen = function (event) {
                    var chatdiv = document.getElementById('chatdiv');
                    if (chatdiv.style.display == 'block') {
                        isChatEstablished = true;
                    }
                };
                receiveChannel.onclose = function () {

                    isChatEstablished = false;
                };
            };
        }
    }
    catch (e) {
        logg("Failed to create PeerConnection, exception: " + e.message);
    }
}
var message;

function startPeerConnectionForChat() {
    if (peerConn == null) {
        startSession("user", "chat");
    }

}

function updateAgentStatus(status) {
//alert(sessionStorage.getItem("agentid"));
    var img = document.getElementById('img' + sessionStorage.getItem("agentid").trim());
//alert(img);
    if (status == 'online') {
        img.src = "./img/available.png"
        //alert("online : "+ agentId);
    } else if (status == 'offline') {
        img.src = "./img/offline.png";
        //alert("ofline : "+ agentId);
    } else if (status == 'busy') {
        img.src = "./img/busy.png";
        //alert("Busy : "+ agentId);
    }

}
var mediaType;
//callback for socket event listener
function onMessage(event) {
    logg("RECEIVED: " + event.data);

    //console.log("received a message");

    var msg = JSON.parse(event.data);
    //alert(JSON.stringify(msg));
    //updating the number of clients connected
    //alert(msg.type);
    if (msg.type == 'transfer_complete') {
        //peerConn.close();
        var chatdiv = document.getElementById('chatdiv');
        chatdiv.style.display = 'none';
        chatwindow.innerHTML = "";

        endCall();
        var endCallbtn = document.getElementById('agentEndCallButton');
        endCallbtn.style.display = "none";
        if (type == "agent") {
            fetchAndDisplayAgentList('agent');
            document.getElementById("agentrole").selectedIndex = "0";
        }

    } else if (msg.type == Call_Events.NOTIFY) {

        //alert("Status :::::: " +msg.status);
        if (type == "agent") {

            var status = msg.status;
            var agentId = msg.id;

            var img = document.getElementById('img' + agentId);
            if (img != null) {
                if (status == 'online') {
                    img.src = "./img/available.png"

                } else if (status == 'offline') {
                    img.src = "./img/offline.png";

                } else if (status == 'busy') {
                    img.src = "./img/busy.png";

                }
            }
        }
    }
    else if (msg.type == Call_Events.AGENT_UNAVAILABLE) {
        //alert("Agent unavailable");
        if (type == "user") {
            var custalert = document.getElementById('webRTC_connectMessageInfo');
            //alert("Agent unavailable");
            if (msg.custPosInQueue != null) {
                custalert.innerHTML = "Call is in Queue <br>" + msg.custPosInQueue;
            } else {
                custalert.innerHTML = "Agents are not available";
            }

            //var progbar = document.getElementById('progressbar');
            //progbar.style.visibility="hidden";
            //var sourcevid = document.getElementById('sourcevid');	
            //sourcevid.src="";
        }
    }
    else if (msg.type == 'rejectcall') {

        endCall();
        if (type == "agent") {
            var endCallbtn = document.getElementById('agentEndCallButton');
            endCallbtn.style.display = "none";
        } else {
            customerCall.disableendcall();
        }
        //alert(msg.closetype);
        if (msg.closetype == "chatclose") {
            var chatdiv = document.getElementById('chatdiv');
            if (type == "user") {
                chatdiv = document.getElementById('webRTC_chatdiv');
            }
            chatdiv.style.display = 'none';
            chatwindow.innerHTML = "";
            var chatimg = document.getElementById('openchat');
            if (type == "user") {
                chatimg = document.getElementById('webRTC_openchat');
            }
            chatimg.style.display = "inline-block";
            isChatEstablished = false;
        }

    } else if (msg.type == 'closechat') {
        var chatdiv = document.getElementById('chatdiv');
        chatdiv.style.display = 'none';
        chatwindow.innerHTML = "";
        var chatimg = document.getElementById('openchat');
        chatimg.style.display = "inline-block";
        isChatEstablished = false;
        if (!isVideoCallEstablished) {

            if (type == "user") {
                if (peerConn) {
                    peerConn.close();
                }
                agtId = "-1";
                peerConn = null;

            }
            //alert(agtId);
        }
    }
    else if (msg.type == 'client_count') {




    }	//initiating the call
    else if (msg.type == 'will_call') {
        var name = msg.name.trim();
        mediaType = msg.media_type;
        custname = name;
        if (custname == "") {
            custname = "GUEST";
        }
        var customerheader = document.getElementById('customerheader');
        customerheader.innerHTML = "CUSTOMER" + " : " + custname;
        custId = msg.id.trim();
        //alert("customer Id in Will Call "+custId);
    }
    else if (msg.type == Call_Events.CALL_CONNECT) {
        if (type == "user") {

            if (msg.call_type == "transfer") {
                showCallTypeInProgress(CALL_TRANSFER);
            } else if (msg.call_type == "normal") {
                showCallTypeInProgress(CALL_CONNECTING);
            }
            agentname = msg.name;
            agtId = msg.id;
            //alert(agtId);
            var agentheader = document.getElementById('webRTC_agentHeader');
            agentheader.innerHTML = "AGENT" + " : " + agentname;
        }
        mediaType = msg.media_type;
        createPeerConnection();

        //console.log("added stream initiator :");
        /*if(typeof receiveChannel != 'undefined'){
         receiveChannel.close();
         }
         if(typeof dataChannel != 'undefined'){
         dataChannel.close();
         }*/
        createChatDataChannel();
        //mediaType = msg.media_type;
        //alert("Media Type ::: "+ mediaType);

        if (mediaType == "chat") {
            isVideoCallEstablished = false;
            peerConn.createOffer(setLocalAndSendMessage, errorCallback, chatConstraints);

        } else if (mediaType == "video") {
            isVideoCallEstablished = true;
            //alert("Local Strem added");
            peerConn.addStream(localStream);
            peerConn.createOffer(setLocalAndSendMessage, errorCallback, mediaConstraints);
        }

        //console.log("created offer initiator :");
    }
    else if (msg.type == 'wait') {
        if (peerConn) {
            peerConn.close();
        }
        agtId = "-1";
        peerConn = null;
        remotevid.src = '';
        updateState(STATES.WAITING);
    } else if (msg.type == Call_Events.CUST_OFFER) {
        message = msg;
        if (mediaType == "video") {
            var acceptbtn = document.getElementById('acceptCallButton');
            acceptbtn.style.display = "block";
            document.getElementById('acceptCallButton');
            var ringing = document.getElementById('ringing');
            ringing.style.display = 'block';
            var ringingimgdiv = document.getElementById('ringingimgdiv');
            ringingimgdiv.style.display = 'block';
            var audioplay = document.getElementById('audioplay');
            audioplay.play();
            audioplay.volume = 0.9;
        }
        //if(peerConn==null){
        createPeerConnection();
        //alert('Peer connection opened again');
        //}
        peerConn.setRemoteDescription(new RTSessionDescription(msg));

        //alert(JSON.stringify(msg));
        remotevid = document.getElementById('remotevid');
        remotevid.style.display = "none";
        //alert("Media Type "+msg.media_type);
        if (mediaType == "chat") {
            peerConn.createAnswer(setLocalAndSendMessage, errorCallback, mediaConstraints);
        }
    } else if (peerConn) {
        if (msg.type == 'answer') {
            peerConn.setRemoteDescription(new RTSessionDescription(msg));
            //console.log("set remote initiator :"+peerConn.iceGatheringState);
        } else if (msg.type == 'candidate') {
            var candidate = new IceCandidate({sdpMLineIndex: msg.sdpMLineIndex, candidate: msg.candidate, sdpMid: msg.sdpMid});
            peerConn.addIceCandidate(candidate);
            //console.log("added candidates");
        }
    }
}
function showCallTypeInProgress(calltype) {
    if (remotevid) {
        remotevid.src = '';
        remotevid.style.display = 'none';
    }
    var status = document.getElementById('webRTC_connectMessageInfo');
    status.style.visibility = "visible";
    status.innerHTML = calltype;
    var progbar = document.getElementById('webRTC_connectProgressbar');
    progbar.style.visibility = "visible";
    var progbar = document.getElementById('webRTC_connectMessage');
    progbar.style.display = "block";
    /** when transfering call from one agent to another agent need to reset customer duration **/
    var agentheader = document.getElementById('webRTC_agentHeader');
    agentheader.innerHTML = "AGENT";
    if (typeof h1 != 'undefined') {
        h1.innerHTML = agentheader.innerHTML;
        clearTimeout(t);
    }
}
/**
 * Accept Customer CAll.
 */
function agentAcceptCall() {
    startVideo();

    var chaticon = document.getElementById('openchat');
    chaticon.style.display = "inline-block";

    var ringing = document.getElementById('ringing');
    ringing.style.display = 'none';
    var ringingimgdiv = document.getElementById('ringingimgdiv');
    ringingimgdiv.style.display = 'none';
    var audio = document.getElementById('audioplay');

    audio.pause();
    audio.currentTime = 0;
    var acceptbtn = document.getElementById('acceptCallButton');

    acceptbtn.style.display = "none";
    var endCallbtn = document.getElementById('agentEndCallButton');
    endCallbtn.style.display = "block";
    var remotevid = document.getElementById('remotevid');
    remotevid.style.display = "block";

    var localvideodiv = document.getElementById('localvidoediv');
    localvideodiv.style.display = "block";
    var remotevideodiv = document.getElementById('remotevidoediv');
    remotevideodiv.style.display = "block";
    var customerheader = document.getElementById('customerheader');
    var string = customerheader.innerHTML;

    agentduration('customerheader', string);
    updateAgentStatus('busy');
    var transferoption = document.getElementById('agentrole');
    transferoption.style.display = "inline-block";
    var transferCallButton = document.getElementById('transferCallButton');
    transferCallButton.style.display = "inline-block";

    isVideoCallEstablished = true;
}
/** agent call duration **/
var h1;
function agentduration(id, userinfo) {
    h1 = document.getElementById(id);
    seconds = 0, minutes = 0, hours = 0, t = 0;

    function add() {
        seconds++;
        if (seconds >= 60) {
            seconds = 0;
            minutes++;
            if (minutes >= 60) {
                minutes = 0;
                hours++;
            }
        }
        h1.innerHTML = userinfo + "    " + "    " + (hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds);
        timer();
    }
    function timer() {
        t = setTimeout(add, 1000);
    }
    timer();
}

function next() {
    if (peerConn) {
        peerConn.close();
    }
    peerConn = null;
    remotevid.src = '';

    if (socket) {
        socket.close();
        socket = null;
    }

    socket = new WebSocket(socketServer);
    socket.addEventListener();
    socket.addEventListener("message", onMessage, false);
    updateState(STATES.WAITING);

    document.getElementById('next').href = "javascript:true;";
    setTimeout(onOpen, 2000);
}
/**
 * End Ongoing Call.
 */
function endCall() {
    var chatdiv = document.getElementById('chatdiv');
    if (!isChatEstablished) {
        if (peerConn) {
            peerConn.close();
            //agtId = "-1";
        }
        peerConn = null;
    }
    if (remotevid)
        remotevid.src = '';
    isVideoCallEstablished = false;
    //var mute = document.getElementById('mutelist');
    //mute.style.visibility = 'hidden';
    if (type == 'agent') {
        socket.send(JSON.stringify({'type': 'sessioninfo', 'id': agentId, 'agentCompanyCode': agentCompanyCode}));
        var chaticon = document.getElementById('openchat');
        chaticon.style.display = "none";

        var customerheader = document.getElementById('customerheader');
        customerheader.innerHTML = "CUSTOMER";
        if (typeof h1 != 'undefined') {
            h1.innerHTML = customerheader.innerHTML;
            clearTimeout(t);
        }
        if (!isChatEstablished && !isVideoCallEstablished) {
            updateAgentStatus('online');
        }
        var transferoption = document.getElementById('agentrole');
        transferoption.style.display = "none";
        var transferCallButton = document.getElementById('transferCallButton');
        transferCallButton.style.display = "none";
    } else {
        //socket.send(JSON.stringify({'type': 'rejectcall	','id':agentId,'usertype':'user'}));
        var agentheader = document.getElementById('webRTC_agentHeader');
        agentheader.innerHTML = "AGENT";
        //agtId = "-1";
        if (typeof h1 != 'undefined') {
            h1.innerHTML = agentheader.innerHTML;
            clearTimeout(t);
        }

    }
    if (type == "user") {
        var sourcevid = document.getElementById('webRTC_localVideo');
    }
    else if (type == "agent") {
        var sourcevid = document.getElementById('sourcevid');
    }
    sourcevid.src = "";


    seconds = 0;
    minutes = 0;
    hours = 0;
}
var isMobile = {
    Android: function () {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function () {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function () {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function () {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function () {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function () {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};
function onOpen() {
    document.getElementById('next').href = "javascript:next();";
}
var dataChannel;
var receiveChannel;
var channelName = "chat";
function createChatDataChannel() {
    // Establish your peer connection using your signaling channel here
    dataChannel =
            peerConn.createDataChannel(channelName, {reliable: false});
    //socket.send(JSON.stringify({'type': "chat"}));

    dataChannel.onerror = function (error) {
        console.log("Data Channel Error:", error);
    };

    dataChannel.onmessage = function (event) {
        isChatEstablished = true;
        var chatdiv = document.getElementById('webRTC_chatdiv');
        if (type == "agent") {
            chatdiv = document.getElementById('chatdiv');
        }
        chatdiv.style.display = 'block';
        chatwindow.innerHTML += "<li style =\"padding-Left:5px;padding-Top:5px;background-color:#c5d0e5;\">" + agentname + " : " + event.data + "</li>";
        chatwindow.scrollTop = chatwindow.scrollHeight;
        var chaticon = document.getElementById('webRTC_openchat');
        chaticon.style.display = "none";
        if (!isMobile.Android()) {
            chattext.focus();
        }
    };

    dataChannel.onopen = chatConnectionOpened;

    dataChannel.onclose = function () {
        isChatEstablished = false;
    };
    //peerConn.createOffer(setLocalAndSendMessage, errorCallback, mediaConstraints);
}
function chatConnectionOpened(event) {

    var readystate = dataChannel.readyState;
    if (readystate == "open") {
        var chatdiv = document.getElementById('webRTC_chatdiv');
        if (type == "agent") {
            chatdiv = document.getElementById('chatdiv');
        }
        if (chatdiv.style.display == 'block') {
            isChatEstablished = true;
        }
    }
}
function startChatWindow() {
    chatwindow.innerHTML = "";
    var chatdiv = document.getElementById('webRTC_chatdiv');
    if (type == "agent") {
        chatdiv = document.getElementById('chatdiv');
    }
    chatdiv.style.display = 'block';
    startPeerConnectionForChat();
    isChatEstablished = true;
    var chatimg = document.getElementById('webRTC_openchat');
    if (type == "agent") {
        chatimg = document.getElementById('openchat');
    }
    chatimg.style.display = "none";
    chattext.focus();
}
function closeChatWindow() {
    var chatdiv = document.getElementById('webRTC_chatdiv');
    if (type == "agent") {
        chatdiv = document.getElementById('chatdiv');
    }
    chatdiv.style.display = 'none';
    chatwindow.innerHTML = "";
    //alert(isVideoCallEstablished);

    //if(!isVideoCallEstablished){
    isChatEstablished = false;
    if (!isVideoCallEstablished) {
        if (peerConn) {
            peerConn.close();
        }
        //agtId = "-1";
        peerConn = null;
        sendInfoToServer(type, 'chatclose');
    } else {
        closeChatSession();
    }
    //}

    //if(type == "user"){
    var chatimg = document.getElementById('webRTC_openchat');
    if (type == "agent") {
        chatimg = document.getElementById('openchat');
    }
    chatimg.style.display = "inline-block";
    if (type == "user") {
        var connectingMessage = document.getElementById('webRTC_connectMessage');
        connectingMessage.style.display = "none";
    }
    //}
}


function sendMessageInfo() {

    var text = chattext.value;
    //alert(chatwindow.innerHTML);
    if (type == "user") {
        //alert(dataChannel.readyState);
        if (dataChannel.readyState == "open") {

            dataChannel.send(text);
            if (custname == "") {
                custname = "GUEST";
            }
            chatwindow.innerHTML = chatwindow.innerHTML + "<li style =\"padding-Left:5px;padding-Top:5px;background-color:#e2e4f0;\">" + custname + " : " + text + "</li>";
        }
    }
    else if (type == "agent") {
        receiveChannel.send(text);
        chatwindow.innerHTML = chatwindow.innerHTML + "<li style =\"padding-Left:5px;padding-Top:5px;background-color:#DADDEF;\">" + agentname + " : " + text + "</li>";
    }

    chattext.value = "";
    //var objDiv = document.getElementById("your_div");
    chatwindow.scrollTop = chatwindow.scrollHeight;
}

var addEvent = function (elem, type, eventHandle) {
    if (elem == null || typeof (elem) == 'undefined')
        return;
    if (elem.addEventListener) {
        elem.addEventListener(type, eventHandle, false);
    } else if (elem.attachEvent) {
        elem.attachEvent("on" + type, eventHandle);
    } else {
        elem["on" + type] = eventHandle;
    }
};

