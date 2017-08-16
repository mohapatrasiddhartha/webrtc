//This is use for customer admin js 

var socketsignalingServer = "ws://" + location.hostname + ":8040";//websocket server to use
var socketSignalingServer = new WebSocket(socketsignalingServer);															//websocket is created and an event listener is added to it
//socket.addEventListener("message", onMessage, false);
socketSignalingServer.addEventListener('open', function (event) {
    socketSignalingServer.send(JSON.stringify({type:'customerId',value:'122'}));
});