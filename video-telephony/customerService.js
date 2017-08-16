var dbinterface = require("./DBInterface.js");
var srvrconfig = require("./Config.js");
var http = require('http');
var server = http.createServer(webRTCCustomerSignUp);
server.listen(srvrconfig.WEBRTC_CUST_SIGNUP);//,srvrconfig.SERVER_IP);
console.log("WebRTC Customer Service Started  :"+srvrconfig.WEBRTC_CUST_SIGNUP);

function webRTCCustomerSignUp(){
    
}