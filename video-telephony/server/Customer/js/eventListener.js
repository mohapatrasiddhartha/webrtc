document.getElementById("webRTC_custStartCallButton").addEventListener("click", function () {
    customerCall.enablepreviews();
    customerCall.establishcall();
});
document.getElementById("webRTC_custEndCallButton").addEventListener("click", function () {
    customerCall.custEndCall();
});
document.getElementById("webRTC_openchat").addEventListener("click", function(){
    customerCall.startChat();
});
document.getElementById("webRTC_audiostatus").addEventListener("click", function(){
    enableAudio();
});
document.getElementById("webRTC_videostatus").addEventListener("click", function(){
    enableVideo();
});

document.getElementById("webRTC_chatsendButton").addEventListener("click", function (event) {
    sendMessageInfo();
    event.preventDefault();
});
document.getElementById("webRTC_chatClose").addEventListener("click", function(){
    closeChatWindow();
});

//$(function () {
//    $('body').on('mousedown', '#videodivs', function () {
//        $(this).addClass('video-container-draggable').parents().on('mousemove', function (e) {
//            $('.video-container-draggable').offset({
//                top: e.pageY - 30,
//                left: e.pageX - $('.video-container-draggable').outerWidth()
//            }).on('mouseup', function () {
//                $(this).removeClass('video-container-draggable');
//            });
//            e.preventDefault();
//        });
//    }).on('mouseup', function () {
//        $('.video-container-draggable').removeClass('video-container-draggable');
//    });
//});