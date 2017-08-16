var path = require("path");
var url = require("url");
var fileSystem = require("fs");
var dbinterface = require("./DBInterface.js");
var custInfodataValue = "";
var conn;

function renderFile(request, response) {
    var myPath = url.parse(request.url).pathname;
    //console.log(request.url);
    if (myPath == "" || myPath == "/") {
        myPath = "/Application/ApplicationHome.html";
    }
    var fullPath = path.join(process.cwd(), '/server', myPath);
    fileSystem.exists(fullPath, function (exists) {
        if (!exists) {
            response.writeHeader(404, {"Content-Type": "text/plain"});
            response.end();
        }
        else {
            fileSystem.readFile(fullPath, "binary", function (err, file) {
                if (err) {
                    response.writeHeader(500, {"Content-Type": "text/plain"});
                    response.write(err + "\n");
                    response.end();
                }
                else {
                    response.setHeader('Access-Control-Allow-Origin', '*');
                    response.setHeader('Access-Control-Allow-Methods', 'GET, POST');
                    response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
                    response.writeHeader(200);
                    response.write(file, "binary");
                    response.end();
                }
            });
        }
    });
}
var srvrconfig = require("./Config.js");
var WebSocketServer = require('websocket').server;
var http = require('http');

createDB();
var server = http.createServer(renderFile);
server.listen(srvrconfig.SERVER_PORT);//,srvrconfig.SERVER_IP);
console.log("App Server Started on :" + srvrconfig.SERVER_PORT);
//create the server
wsServer = new WebSocketServer({
    httpServer: server
});

wsServer.on('request', function (request) {
    var connection = request.accept(null, request.origin);
    connection.on('message', function (message) {
        var custInfo = message.utf8Data;
        var custInfoData = JSON.parse(custInfo);
        custInfodataType=custInfoData['type'];
        custInfodataValue = custInfoData['value'];
        if(custInfodataType=="customerId"){
            console.log("#####################Message " + custInfoData['value']);
        }
        createwebRTCCustomerDB();
    });
});
function createDB() {
    var dbobj = dbinterface.initialize();
    conn = dbinterface.createDB(dbobj);
    console.log('Creating Database ...');
}
function createwebRTCCustomerDB() {
    var dbobj = dbinterface.initialize();
    conn = dbinterface.createwebRTCCustomerDB(dbobj, custInfodataValue);
    console.log('Creating webRTC Customer Database ...');
}