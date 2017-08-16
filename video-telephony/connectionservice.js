function renderFile(request, response) {
    
}

/** This function takes id of the client and the users array (which contains a list of users) as parameters.
 *It removes the client from users array.*/

function removeClient(clientId, usersArray) {
    console.log("Remove client called");
    for (var index = 0; index < usersArray.length; ++index) {

        if (usersArray[index]['id'] == clientId) {
            usersArray.splice(index, 1);
            return;
        }
    }
}
function sendCallQueueInfoToCustomers() {
    for (var index = 0; index < waitingCustomers.length; ++index) {
        //console.log("Name "+waitingCustomers[index]['name']+" Queue no"+Math.ceil(index+1/agentCount));
        waitingCustomers[index]['connection'].send(JSON.stringify({'type': Call_Events.AGENT_UNAVAILABLE, 'custPosInQueue': Math.ceil(index + 1 / agentCount)}));
    }
}
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
/** check for the Available agent to take calls from customer */

function matchUser(client, agentId, calltransfer, mediatype) {

    //console.log("Matching AgentId : " +agentId);


    for (var index = 0; index < users.length; index++) {

        if (users[index]['id'].trim() === agentId) {
            //console.log("Partners List length before "+client['partners_list'].length);
            client['partners_list'].splice(0, 1);
            //console.log("Partners List length after "+client['partners_list'].length);
            client['partners_list'].push(users[index]);
            console.log("Partners List " + client['partners_list'][0]['name']);
            var partnersArrayLength = client['partners_list'].length;
            var partner = client['partners_list'][0];
            partner['partners_list'].splice(0, 1);
            partner['partners_list'].push(client);
            if (calltransfer == true) {
                partner['call_type'] = 'transfer';
                console.log("Client name is " + client['name']);
            } else {
                partner['call_type'] = 'normal';
            }
            console.log("Client info during start call " + JSON.stringify(client['id']));
            //console.log("Transfer type "+calltransfer+"Partner calltype"+partner['call_type']);

            client['connection'].send(JSON.stringify({'type': Call_Events.CALL_CONNECT, 'call_type': partner['call_type'], 'name': partner['name'], 'id': partner['id'], 'media_type': mediatype}));

            partner['connection'].send(JSON.stringify({'type': 'will_call', 'name': client['name'], 'id': client['id'], 'media_type': mediatype}));
            break;
            //UpdateAgentStatus(agentId.trim(),Status.BUSY);
        }
    }
}


/** Update Call connection related Info 
 1.Customer details
 2.Agent details
 3.Call StartTime,EndTime,Call Duration
 4.Reason for call termination.
 */
function UpdateConnectionInfo(id, usertype,customerWebValueCode) {
    for (var index = 0; index < callConnectionLists.length; index++) {
        if (callConnectionLists[index]['agentId'].trim() == id) {
            var connInfo = callConnectionLists[index];
            var date = new Date();

            connInfo['callendtime'] = date.getTime().toString();
            if (usertype == "agent") {
                connInfo['terminationreason'] = "Agent Ended the Call"
            } else if (usertype == "user") {
                connInfo['terminationreason'] = "Customer Ended the Call"
            }
            var starttime = (connInfo['callstarttime']);



            //console.log("After Converted Start time : " +newstarttime);
            var callduration = (Number(connInfo['callendtime']) - Number(connInfo['callstarttime']));
            callduration = convertToTime(callduration);

            connInfo['callduration'] = callduration;
            //console.log("Duration : " +callduration);
            //console.log(JSON.stringify(connInfo));
            InsertCallRecord(connInfo,customerWebValueCode);
            callConnectionLists.splice(index, 1);
            break;
        }

    }

}
var Status = {AVAILABLE: "Available", BUSY: "Busy", OFFLINE:"Offline"};
var WebSocketServer = require('websocket').server;
var http = require('http');

var srvrconfig = require("./Config.js");

//Require for static serve file
var path = require("path");
var url = require("url");
var fileSystem = require("fs");


var agentCount = 0;
var users = [];
var waitingCustomers = [];
var agents = [];
var callConnectionLists = [];
var Keep_alive_lists = [];

var server = http.createServer(renderFile);
server.listen(srvrconfig.CONNECTION_SERVER_PORT);//,srvrconfig.SERVER_IP);
// Set the timer for Keep alive functionality in server.
setInterval(function () {
    clearAgentInfo()
}, 600000);
console.log("Connection Service Started");


// create the server
wsServer = new WebSocketServer({
    httpServer: server
});
var dbinterface = require("./DBInterface.js");
var AgentId = "";
var AGENT_TABLE = "agentlist";




/**
 * Get Free Available Agent from DB;
 */
function getFreeAvailableAgent(mclient, role, depts, calltransfer, client, mediatype, customerWebValueCode) {
    var dbobj = dbinterface.initialize();
    console.log("Getting value in getFreeAvailableAgent" + customerWebValueCode);
    var conn = dbinterface.connectDB(dbobj, customerWebValueCode);
    var str;

    if (role != "-1") {
        str = " and AgentRole = '" + role + "'";
    } else if (depts != "-1") {
        str = " and (Department1='" + depts + "' or Department2='" + depts + "' or Department3='" + depts + "')";
    }
    var filter = " where AgentStatus = 'Available' and SessionId!=''";
    filter += str;
    console.log("Available agent is"+filter);
    dbinterface.fetchDataFromTable(dbobj, conn, AGENT_TABLE, filter, "", function (err, data) {
        if (err) {
            // error handling code goes here
            console.log("ERROR : ", err);
        } else {
            // code to execute on data retrieval
             console.log("data length is"+data.length);
            if (data.length > 0) {
                var AgentId = data[0].AgentId.trim();
                UpdateAgentStatus(AgentId, Status.BUSY,customerWebValueCode);

                matchUser(mclient, AgentId, calltransfer, mediatype);
                if (calltransfer) {
                    console.log("Matching Agent Id for transfer " + AgentId);
                    UpdateAgentStatus(client['id'].trim(), Status.AVAILABLE, customerWebValueCode);
                    notifyAllAgents(client['id'].trim(), 'online');
                    client['connection'].send(JSON.stringify({'type': 'transfer_complete'}));
                }
                console.log("Free AgentId is : ", AgentId);
            } else {
                waitingCustomers.push(mclient);
                console.log("Queue no" + waitingCustomers.length / agentCount);
                mclient['connection'].send(JSON.stringify({'type': Call_Events.AGENT_UNAVAILABLE, 'custPosInQueue': Math.ceil(waitingCustomers.length / agentCount)}));
                //return;			 
            }

        }
        dbinterface.endConnection(dbobj, conn);
    });

}
/**
 * Clear Agent Details on timer expiry.
 */
function clearAgentInfo() {
    console.log('Timer Triggered Server');
    for (var key in Keep_alive_lists) {
        if (Keep_alive_lists.hasOwnProperty(key)) {
            //console.log("Server AgentId "+Keep_alive_lists[key].id);
            //console.log("Server Time "+Keep_alive_lists[key].time);
            if (Keep_alive_lists[key].time == "") {
                var id = Keep_alive_lists[key].id.trim();
                //clearSessionId(id);
                //UpdateAgentStatus(id.trim(),Status.AVAILABLE);
            }
            Keep_alive_lists[key].time = "";
        }
    }
}
/**
 * Generate SessionId for Agent;
 */
function generateSessionId(agentId,customerWebValueCode) {
    console.log(customerWebValueCode);
    var d = new Date();
    var sessionId = d.getTime();
    var dbobj = dbinterface.initialize();
    var conn = dbinterface.connectDB(dbobj, customerWebValueCode);
    var filter = "where AgentId = '" + agentId + "' ";
    status = "SessionId = '" + sessionId + "' ";
    console.log(filter + status);
    dbinterface.updateDataToTable(dbobj, conn, AGENT_TABLE, filter, status, function (err, data) {
        if (err) {
            // error handling code goes here
            console.log("ERROR : ", err);
        } else {
            // code to execute on data retrieval

            console.log("Updated");

        }
        dbinterface.endConnection(dbobj, conn);
    });
    return sessionId;
}
/**
 * Clear SessionId for Agent;
 */
function clearSessionId(agentId,agentCompanyCode) {
    console.log("clearing session id");
    var dbobj = dbinterface.initialize();
    var conn = dbinterface.connectDB(dbobj,agentCompanyCode);
    var filter = "where AgentId = '" + agentId + "' ";
    status = "SessionId = '' ";
    console.log(filter + status);
    dbinterface.updateDataToTable(dbobj, conn, AGENT_TABLE, filter, status, function (err, data) {
        if (err) {
            // error handling code goes here
            console.log("ERROR : ", err);
        } else {
            // code to execute on data retrieval

            console.log("Updated Session");

        }
        dbinterface.endConnection(dbobj, conn);
    });

}
/**
 * Update Agent Status;
 */
function UpdateAgentStatus(agentId, status, customerWebValueCode) {
    var dbobj = dbinterface.initialize();
    var conn = dbinterface.connectDB(dbobj, customerWebValueCode);
    var filter = "where AgentId = '" + agentId + "' ";
    status = "AgentStatus = '" + status + "' ";
    console.log(filter);
    dbinterface.updateDataToTable(dbobj, conn, AGENT_TABLE, filter, status, function (err, data) {
        if (err) {
            // error handling code goes here
            console.log("ERROR : ", err);
        } else {
            // code to execute on data retrieval
            console.log("Updated");
        }
        dbinterface.endConnection(dbobj, conn);
    });

}
/**
 * Notify All agents about login status.
 */
function notifyAllAgents(id, status) {
    for (var index = 0; index < users.length; index++) {
        if (users[index]['usertype'] == "agent" || users[index]['usertype'] == "admin") {
            //console.log(JSON.stringify({'type': Call_Events.NOTIFY,'id':users[index]['id'],'status':status}));
            users[index]['connection'].send(JSON.stringify({'type': Call_Events.NOTIFY, 'id': id, 'status': status}));
        }
    }
}
/**
 * Insert call record into callRecordList table
 */
function InsertCallRecord(coninfo,customerWebValueCode) {
    var Call_Record_Table = "callrecordlist";
    var dbobj = dbinterface.initialize();
    var conn = dbinterface.connectDB(dbobj, customerWebValueCode);
    var starttime = convertTimeZone(coninfo['callstarttime']);
    var endtime = convertTimeZone(coninfo['callendtime']);
    var columns = "(AgentName,CustomerName,CallStartTime,CallEndTime,CallDuration,TerminationReason)";
    var values = "('" + coninfo['agentname'] + "','" +
            coninfo['custname'] + "','" +
            starttime + "','" +
            endtime + "','" +
            coninfo['callduration'] + "','" +
            coninfo['terminationreason'] + "')";
//console.log(filter);
    dbinterface.insertColumnDatatoTable(dbobj, conn, Call_Record_Table, columns, values, function (err, data) {
        if (err) {
            // error handling code goes here
            console.log("ERROR : ", err);
        } else {
            // code to execute on data retrieval
            console.log("Inserted new record properly");
        }
        dbinterface.endConnection(dbobj, conn);
    });

}
//Require for websocket server

wsServer.on('request', function (request) {


    var connection = request.accept(null, request.origin);

    var client = {'usertype': 'user', 'id': '0', 'name': 'guest', 'connection': connection, 'partners_list': [], 'offer_count': 0, 'sessionId': '-1', 'call_type': 'direct','agentCompanyCode':'','customerWebValue':''};
    var callconn = {'sessionId': '-1', 'custname': 'guest', 'agentname': '', 'callstarttime': '0', 'callendtime': '0', 'callduration': '0', 'terminationreason': '', 'agentId': '-1'};
    users.push(client);

    /* This function updates the number of users connected to the server every 15 seconds*/
    function sendState() {
        // client['connection'].send(JSON.stringify({'type': 'client_count', 'value': users.length, 'list': userId, 'your_id':client['id']}));
        // setTimeout(sendState, 15000);
    }

    //sendState();
    connection.on('message', function (message) {
        var temp = message;
        var incomingData;
        if (temp.type === 'utf8') {

            incomingData = message.utf8Data;
            var data = JSON.parse(incomingData);
            if ((data['type'] == 'client_info')) {
                var agentCompanyCode = data['agentCompanyCode'];
                client['customerWebValue'] = data['customerWebValue'];
                console.log("UserType : " + data['user_type']);
                if (data['user_type'] == 'user') {
                    client['id'] = data['custid'].trim();
                    if (data['custname'].trim() != "") {
                        client['name'] = data['custname'];
                    }
                    //client['user_type'] = 'user';
                    //lastClientId += 1;
                } else if (data['user_type'] == 'agent') {
                    client['id'] = data['agentid'].trim();
                    client['name'] = data['agentname'];
                    client['agentCompanyCode'] = data['agentCompanyCode'];
                    //client['user_type'] = 'agent';	
                    console.log("Agent Session Id generated"+agentCompanyCode);
                    var id = generateSessionId(client['id'].trim(),agentCompanyCode);
                    client['sessionId'] = id;
                    UpdateAgentStatus(client['id'].trim(), Status.AVAILABLE, agentCompanyCode);
                    notifyAllAgents(client['id'], 'online');
                    agentCount += 1;
                    if (waitingCustomers.length > 0) {
                        //waitingCustomers[0]['connection'].send(JSON.stringify({'type': Call_Events.AGENT_UNAVAILABLE,'custPosInQueue':Math.ceil(waitingCustomers.length/agentCount)}));
                        setTimeout(function () {
                            UpdateAgentStatus(client['id'], Status.BUSY, customerWebValueCode);
                            matchUser(waitingCustomers[0], client['id'], false, 'video');
                            waitingCustomers.splice(0, 1);
                            sendCallQueueInfoToCustomers();
                        }, 500);
                    }
                }
                //client = {'usertype':data['type'],'id': lastClientId, 'connection': connection, 'partners_list': [],'offer_count':0};
                client['usertype'] = data['user_type'];

            }
            if (data['type'] == Call_Events.KEEP_ALIVE) {
                var agentInfo = {'id': data['id'].trim(), 'time': data['time']};
                for (var index = 0; index < Keep_alive_lists.length; ++index) {

                    if (Keep_alive_lists[index]['id'] == agentInfo.id) {
                        Keep_alive_lists.splice(index, 1);
                        break;
                    }
                }
                Keep_alive_lists.push(agentInfo);
                console.log(JSON.stringify(Keep_alive_lists));
            }
            if (data['type'] == 'sessioninfo') {
                var agentCompanyCode = data['agentCompanyCode'];
                var agentid = data['id'].trim();
                console.log("id is " + data['id']);
                if (agentid != undefined && agentid != "-1") {
                    UpdateAgentStatus(agentid, Status.AVAILABLE, agentCompanyCode);
                    notifyAllAgents(agentid, 'online');
                    console.log("OnLine in SessionInfo : " + agentid);
                }
            }/*
             * Call Request from Customer.
             */
            if ((data['type'] == Call_Events.CUST_CALL)) {
                var customerWebValueCode = data['customerWebValue'];
                console.log("######################################" + customerWebValueCode);
                var mediatype = data['media_type'];
                var agentid = data['id'].trim();
                if (agentid == "-1")
                    getFreeAvailableAgent(client, 'Agent', "-1", false, null, mediatype, customerWebValueCode);
                else {
                    matchUser(client, agentid, false, 'video');
                }
                console.log("client : " + client['usertype']);

            }

            if ((data['type'].trim() == 'rejectcall')) {

                id = data['id'].trim();
                var isVideo = Boolean(data['isVideo']);
                var isChat = Boolean(data['isChat']);
                var closetype = data['closetype'];
                var agentCompanyCode="";
                console.log(isVideo + "  :::  " + isChat);
                console.log(data['usertype'] + " ended the call" + "ID........ " + id);
                if(data['usertype']=="agent"){
                     agentCompanyCode = data['agentCompanyCode'];
                }
                else{
                    agentCompanyCode = data['customerWebValue'];
                }
                //if(data['usertype'] == "agent"){
                if (isChat == false && isVideo == false) {
                    console.log("inside if : " + isVideo + "  :::  " + isChat);
                    UpdateAgentStatus(id, Status.AVAILABLE, agentCompanyCode);
                    notifyAllAgents(id, 'online');
                }
                //}
                UpdateConnectionInfo(id, data['usertype'],agentCompanyCode);
                //console.log("clinet partners length "+client['partners_list'].length);
                client['partners_list'][0]['connection'].send(JSON.stringify({'type': 'rejectcall', 'closetype': closetype}));

                if (isChat == false && isVideo == false) {
                    if (waitingCustomers.length > 0) {
                        setTimeout(function () {
                            UpdateAgentStatus(id, Status.BUSY, agentCompanyCode);
                            matchUser(waitingCustomers[0], id, false, 'video');
                            waitingCustomers.splice(0, 1);
                            sendCallQueueInfoToCustomers();
                            console.log('siddhartha');
                        }, 500);
                    }
                }
            }
            if ((data['type'].trim() == 'closechat')) {
                client['partners_list'][0]['connection'].send(JSON.stringify({'type': 'closechat'}));
            }
        }
        /*
         * Transfer Call logic.(TBD)
         */

        if (message.type === 'utf8') {

            data = message.utf8Data;
            json = JSON.parse(data);

            /* Customer Create offer and send it to agent.
             *  Agent create answer and send it back to customer.
             */
            if (json['type'] == Call_Events.CUST_OFFER || json['type'] == Call_Events.AGENT_ANSWER || json['type'] == Call_Events.CANDIDATE) {
                console.log(json['type']);
                var partnersArrayLength = client['partners_list'].length;

                /*if(json['type'] == Call_Events.CUST_OFFER){
                 var agentid = json['id'].trim();
                 console.log(json['id']);
                 if(agentid!="-1" && partnersArrayLength == 0){
                 /* for(var index = 0; index < users.length ; index++) {
                 console.log("User 1"+users[index]['id']);
                 if(users[index]['id'].trim() === agentid){	
                 console.log("Matching Agent Id found");
                 client['partners_list'].push(users[index]);		
                 }
                 }
                 matchUser(client,agentid,false,'video');
                 return;
                 }
                 }*/
                partnersArrayLength = client['partners_list'].length;
                //console.log("Client Partner length"+partnersArrayLength);
                if (json['type'] == Call_Events.AGENT_ANSWER) {
                    callconn['sessionId'] = client['sessionId'];
                    callconn['agentname'] = client['name'];
                    callconn['custname'] = client['partners_list'][partnersArrayLength - 1]['name'];
                    var date = new Date();
                    callconn['callstarttime'] = date.getTime().toString();
                    callconn['agentId'] = client['id'];
                    callConnectionLists.push(callconn);
                    //console.log(JSON.stringify(callconn));
                }
                //console.log(JSON.stringify(data));
                //console.log("Call to agent : "+client['partners_list'][partnersArrayLength - 1]['name']);
                //offer is sent from Customer to Agent ,answer is sent from Agent to Customer and ICE candidates are sent by both.
                client['partners_list'][partnersArrayLength - 1]['connection'].send(data);

                if (json['type'] == Call_Events.AGENT_ANSWER) {
                    //UpdateAgentStatus(client['id'].trim(),Status.BUSY);
                    notifyAllAgents(client['id'].trim(), 'busy');
                    console.log("Busy : ");
                }

            } else if (json['type'] == 'transfer_call') {
                var custId = json['caller'];
                var type = json['transfer_type'];
                var role;
                var depts;
                if (type == "roles") {
                    role = json['selected'];
                    depts = "-1";
                } else {
                    depts = json['selected'];
                    role = "-1";
                }
                //console.log("Role is "+role+" Department is "+depts);
                //var role = json['role'];					
                var agentId;
                var  customerWebValueCode= json['customerWebValue'];
                for (var find in  users)
                {
                    if (users[find]['id'] === custId) {
                        
                        console.log("Customer name " + users[find]['name']+'customer Id'+customerWebValueCode);
                        getFreeAvailableAgent(users[find], role, depts, true, client, 'video', customerWebValueCode);
                        //matchUser( users[find] ,agentId);							
                        break;
                    }
                }

            }

            else {
                console.log("Message type unknown: " + json['type']);
            }
        }

    });


    /* this function closes the client connection*/
    connection.on('close', function (connection) {


        if (client['partners_list'].length > 0)
            client['partners_list'][0]['connection'].send(JSON.stringify({'type': 'rejectcall'}));

        if (client['usertype'].trim() == "agent") {
            agentCount -= 1;
            var id = client['id'].trim();
            console.log("On closing agent"+client['agentCompanyCode']);
            UpdateAgentStatus(id, Status.AVAILABLE,client['agentCompanyCode']);
            clearSessionId(id,client['agentCompanyCode']);
            notifyAllAgents(id, 'offline');
            console.log("Connection closed " + id);
        } else if (client['usertype'].trim() == "user") {
            if (client['partners_list'].length > 0) {
                var id = client['partners_list'][0]['id'].trim();
                UpdateAgentStatus(id, Status.AVAILABLE,client['customerWebValue']);
                //clearSessionId(id);
                //notifyAllAgents(id,'offline');
            }
        }
        console.log("Connection closed called");
        removeClient(client['id'].trim(), users);

    });
});

function convertTimeZone(timestamp) {
    //console.log("TimeStamp Converted DateTime : "+timestamp);
    //var d = new Date(timestamp);
    var myDate = new Date(Number(timestamp));
    //document.write(myDate.toGMTString()+"<br>"+myDate.toLocaleString());
    //console.log("Converted DateTime : "+myDate.toLocaleString());
    return myDate.toLocaleString();

}
function convertToTime(duration) {
//console.log("MilliSec : "+duration);
    var milliseconds = parseInt((duration % 1000) / 100)
            , seconds = parseInt((duration / 1000) % 60)
            , minutes = parseInt((duration / (1000 * 60)) % 60)
            , hours = parseInt((duration / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds;
}