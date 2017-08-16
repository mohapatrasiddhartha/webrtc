//simple Agent Service 

var http = require('http');
var url = require("url");
var querystring = require('querystring');
var srvrconfig = require("./Config.js");
var USER_NAME = 0;
var PASSWORD = 1;
var SITE_ADMIN_CODE = 2;
var server = http.createServer(fetchLists);
server.listen(srvrconfig.AGENT_PORT_NUM);//,srvrconfig.SERVER_IP);
console.log("Agent Service Started");
console.log(srvrconfig.AGENT_PORT_NUM);
var dbinterface = require("./DBInterface.js");
var SHA1Encryp = require("./SHAEncryption.js");
var resp;
function fetchLists(request, response) {
    //console.log(request.url);
    var servicetype = url.parse(request.url).path;
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    resp = response;
    var agentList;
    var authenticated;
    /*
     * Fetching Agent List
     */
    if (servicetype.indexOf('AgentList') > 0) {
        //agentList = loadXMLDoc("agents_list.xml");
        var header = request.headers['authorization'] || '',
                token = header.split(/\s+/).pop() || '',
                auth = new Buffer(token, 'base64').toString(),
                parts = auth.split(/:/),
                siteAdminCode = parts[0];
        console.log(siteAdminCode + ":" + siteAdminCode);
        agentList = retrieveAgentList(response, siteAdminCode);
        //response.end(agentList);
    }
    /*
     * Add Agent.
     */
    else if (servicetype.indexOf('AgentEntry') > 0) {
        var header = request.headers['authorization'] || '',
                token = header.split(/\s+/).pop() || '',
                auth = new Buffer(token, 'base64').toString(),
                parts = auth.split(/:/),
                siteAdminCode = parts[0];
        console.log("FetchRoles" + siteAdminCode + ":" + siteAdminCode);
        var ParamsWithValue = querystring.parse(url.parse(request.url).query);
        insertAgentinfo(ParamsWithValue, response, siteAdminCode);
    }
    /*
     * Update Agent.
     */
    else if (servicetype.indexOf('AgentUpdate') > 0) {
        var ParamsWithValue = querystring.parse(url.parse(request.url).query);
        var header = request.headers['authorization'] || '',
                token = header.split(/\s+/).pop() || '',
                auth = new Buffer(token, 'base64').toString(),
                parts = auth.split(/:/),
                siteAdminCode = parts[0];
        console.log("AgentUpdate" + siteAdminCode + ":" + siteAdminCode);
        updateSelectedAgentinfo(ParamsWithValue, response, siteAdminCode);
    }



    /*
     * Delete Agent.
     */
    else if (servicetype.indexOf('AgentDelete') > 0) {
        var header = request.headers['authorization'] || '',
                token = header.split(/\s+/).pop() || '',
                auth = new Buffer(token, 'base64').toString(),
                parts = auth.split(/:/),
                siteAdminCode = parts[0];
        console.log("AgentDelete" + siteAdminCode + ":" + siteAdminCode);
        var ParamsWithValue = querystring.parse(url.parse(request.url).query);
        deleteAgentinfo(ParamsWithValue, response, siteAdminCode);
    }
    /*
     * Add Roles.
     */
    else if (servicetype.indexOf('NewAgentRole') > 0) {
        var header = request.headers['authorization'] || '',
                token = header.split(/\s+/).pop() || '',
                auth = new Buffer(token, 'base64').toString(),
                parts = auth.split(/:/),
                siteAdminCode = parts[0];
        console.log("NewAgentRole" + siteAdminCode + ":" + siteAdminCode);
        var ParamsWithValue = querystring.parse(url.parse(request.url).query);
        insertRoleinfo(ParamsWithValue, response, siteAdminCode);
    }
    /*
     * Add departments.
     */
    else if (servicetype.indexOf('addAgentdepartment') > 0) {
        var header = request.headers['authorization'] || '',
                token = header.split(/\s+/).pop() || '',
                auth = new Buffer(token, 'base64').toString(),
                parts = auth.split(/:/),
                siteAdminCode = parts[0];
        console.log("addAgentdepartment" + siteAdminCode + ":" + siteAdminCode);
        var ParamsWithValue = querystring.parse(url.parse(request.url).query);
        insertDeptInfo(ParamsWithValue, response, siteAdminCode);
    }
    /*
     * Reset password.
     */
    else if (servicetype.indexOf('Agentpasswordreset') > 0) {
        var header = request.headers['authorization'] || '',
                token = header.split(/\s+/).pop() || '',
                auth = new Buffer(token, 'base64').toString(),
                parts = auth.split(/:/),
                siteAdminCode = parts[0];
        console.log("Agentpasswordreset" + siteAdminCode + ":" + siteAdminCode);
        var ParamsWithValue = querystring.parse(url.parse(request.url).query);
        resetSelectedAgentpassword(ParamsWithValue, response, siteAdminCode);
    }
    /*
     * Add calllogs.
     */
    else if (servicetype.indexOf('calllogs') > 0) {
        var header = request.headers['authorization'] || '',
                token = header.split(/\s+/).pop() || '',
                auth = new Buffer(token, 'base64').toString(),
                parts = auth.split(/:/),
                siteAdminCode = parts[0];
        console.log("calllogs" + siteAdminCode + ":" + siteAdminCode);
        //var ParamsWithValue = querystring.parse(url.parse(request.url).query);
        insertcalllogInfo(response, siteAdminCode);
    }
    else if (servicetype.indexOf('FetchDepts') > 0) {
        var header = request.headers['authorization'] || '',
                token = header.split(/\s+/).pop() || '',
                auth = new Buffer(token, 'base64').toString(),
                parts = auth.split(/:/),
                siteAdminCode = parts[0];
        console.log("FetchDepts" + siteAdminCode + ":" + siteAdminCode);
        retrieveAgentDeptList(response, siteAdminCode);
    }
    /*
     *
     */
    else if (servicetype.indexOf('FetchRolesandDepts') > 0) {
        var header = request.headers['authorization'] || '',
                token = header.split(/\s+/).pop() || '',
                auth = new Buffer(token, 'base64').toString(),
                parts = auth.split(/:/),
                siteAdminCode = parts[0];
        console.log("FetchRolesandDepts" + siteAdminCode + ":" + siteAdminCode);
        retrieveAgentRolesAndDeptList(response, siteAdminCode);
    }
    /*
     * Fetch Roles.
     */
    else if (servicetype.indexOf('FetchRoles') > 0) {
        var header = request.headers['authorization'] || '',
                token = header.split(/\s+/).pop() || '',
                auth = new Buffer(token, 'base64').toString(),
                parts = auth.split(/:/),
                siteAdminCode = parts[0];
        console.log("FetchRoles" + siteAdminCode + ":" + siteAdminCode);
        retrieveAgentRolesList(response, siteAdminCode);
    }

    /*
     * Authentication.
     */
    else if (servicetype.indexOf('Login') > 0) {
        //console.log(request.headers);
        var header = request.headers['authorization'] || '',
                token = header.split(/\s+/).pop() || '',
                auth = new Buffer(token, 'base64').toString(),
                parts = auth.split(/:/),
                username = parts[USER_NAME],
                password = parts[PASSWORD],
                siteAdminCode = parts[SITE_ADMIN_CODE];
        console.log(username + " : " + password + " : " + siteAdminCode);
        console.log(servicetype);
        //response.send();
        if (username != "" && password != undefined) {

            if (servicetype.indexOf('type=admin') > 0) {
                console.log("if : " + username + " : " + password);
                authenticated = verifyIdentity("admin", username, password, siteAdminCode, null);
            } else if (servicetype.indexOf('type=changepwd') > 0) {
                changePassword(username, password, response,siteAdminCode);
            } else if (servicetype.indexOf('type=agentchangepassword') > 0) {
                console.log("Password change1:" + servicetype);
                authenticated = verifyIdentity("agent", username, password, siteAdminCode, 'agentchangepassword');
            } else if (servicetype.indexOf('type=changepwdbyagent') > 0) {
                console.log("Password change2:" + username + " : " + password + " : " + siteAdminCode);
                changePasswordByAgent(username, password, siteAdminCode, response);
            }
            else {
                authenticated = verifyIdentity("agent", username, password, siteAdminCode, null);
            }
        } else {
            //response.writeHead(200,{'Content-Type':'text/plain'});				
            response.end(authenticated);
        }


    }
    /*
     * First Time Authentication.
     */
    else if (servicetype.indexOf('firstTimeAuthentication') > 0) {
        var header = request.headers['authorization'] || '',
                token = header.split(/\s+/).pop() || '',
                auth = new Buffer(token, 'base64').toString(),
                parts = auth.split(/:/),
                siteAdminCode = parts[0];
        console.log("firstTimeAuthentication" + siteAdminCode + ":" + siteAdminCode);
        var ParamsWithValue = querystring.parse(url.parse(request.url).query);
        checkFirstTimeLoginStatus(ParamsWithValue, response, siteAdminCode);
    }

}
/**
 * Insert Role information to database.
 **/
function insertRoleinfo(ParamsWithValue, response, siteAdminCode) {

    console.log(ParamsWithValue);

    var agentrole = ParamsWithValue.agentrole;

    var dbobj = dbinterface.initialize();
    var AGENT_ROLE_TABLE = "agentroles";
    var values = "('" + agentrole + "' )";

//Open DB connection
    var conn = dbinterface.connectDB(dbobj, siteAdminCode);
    var filter = " where AgentRole = '" + agentrole + "'";
    dbinterface.fetchDataFromTable(dbobj, conn, AGENT_ROLE_TABLE, filter, "", function (err, data) {
        if (err) {
            // error handling code goes here
            console.log("ERROR : ", err);
        } else {
            // code to execute on data retrieval			
            if (data.length > 0) {
                resp.writeHead(200, {'Content-Type': 'text/plain'});
                dbinterface.endConnection(dbobj, conn);
                resp.end("AgentRole already exist");

            } else if (data.length == 0) {
                dbinterface.insertDatatoTable(dbobj, conn, AGENT_ROLE_TABLE, values, function (err, data) {
                    if (err) {
                        // error handling code goes here
                        console.log("ERROR : ", err);
                        //response.end("FAILURE");							
                        response.end("FAILURE");
                    } else {

                        console.log("result from db is : ", data);
                        //response.end("SUCCESS : "+agentrole);
                        response.end("SUCCESS");

                    }
                    dbinterface.endConnection(dbobj, conn);
                });
            }
            else {
                resp.writeHead(401, {'Content-Type': 'text/plain'});
                dbinterface.endConnection(dbobj, conn);
                resp.end("FAILURE");
            }
            console.log("result from db is : ", data);
        }

    });

}

/**
 * Insert Department information to database.
 **/
function insertDeptInfo(ParamsWithValue, response, siteAdminCode) {

    console.log(ParamsWithValue);

    var dept = ParamsWithValue.departments;

    var dbobj = dbinterface.initialize();
    var DEPT_TABLE = "departments";
    var values = "('" + dept + "' )";

//Open DB connection
    var conn = dbinterface.connectDB(dbobj, siteAdminCode);
    var filter = " where departments = '" + dept + "'";
    dbinterface.fetchDataFromTable(dbobj, conn, DEPT_TABLE, filter, "", function (err, data) {
        if (err) {
            // error handling code goes here
            console.log("ERROR : ", err);
        } else {
            // code to execute on data retrieval			
            if (data.length > 0) {
                resp.writeHead(200, {'Content-Type': 'text/plain'});
                dbinterface.endConnection(dbobj, conn);
                resp.end("Department already exist");

            } else if (data.length == 0) {
                dbinterface.insertDatatoTable(dbobj, conn, DEPT_TABLE, values, function (err, data) {
                    if (err) {
                        // error handling code goes here
                        console.log("ERROR : ", err);
                        //response.end("FAILURE");							
                        response.end("FAILURE");
                    } else {

                        console.log("result from db is : ", data);
                        //response.end("SUCCESS : "+agentrole);
                        response.end("SUCCESS");

                    }
                    dbinterface.endConnection(dbobj, conn);
                });
            }
            else {
                resp.writeHead(401, {'Content-Type': 'text/plain'});
                dbinterface.endConnection(dbobj, conn);
                resp.end("FAILURE");
            }
            console.log("result from db is : ", data);
        }

    });

}


/**
 * Insert calllog  information to database.
 **/
function insertcalllogInfo(response, siteAdminCode) {

    var dbobj = dbinterface.initialize();
    var CALL_RECORD_TABLE = "callrecordlist";

    //Open DB connection
    var conn = dbinterface.connectDB(dbobj, siteAdminCode);
    var filter = "";
    var orderby = ' ORDER BY ID DESC';
    dbinterface.fetchDataFromTable(dbobj, conn, CALL_RECORD_TABLE, filter, orderby, function (err, data) {
        if (err) {
            // error handling code goes here
            console.log("ERROR : ", err);
        } else {
            response.end(JSON.stringify(data));

        }
        dbinterface.endConnection(dbobj, conn);
    });

}

/**
 * Update Agent Information to database.
 **/
function updateSelectedAgentinfo(ParamsWithValue, response, siteAdminCode) {
    var AGENT_TABLE = "agentlist";
    var dbobj = dbinterface.initialize();
    var conn = dbinterface.connectDB(dbobj, siteAdminCode);
    console.log("update called");
    var agentname = ParamsWithValue.agentname;
    var agentrole = ParamsWithValue.agentrole;
    var agentId = ParamsWithValue.agentid;
    var dept1 = ParamsWithValue.dept1;
    var dept2 = ParamsWithValue.dept2;
    var dept3 = ParamsWithValue.dept3;
    console.log("update called : " + agentname + " : " + agentrole + " : " + agentId);
    var filter = "where AgentId = '" + agentId + "' ";
    //var pwd = SHA1Encryp.SHA1(password);
    var status = " AgentName = '" + agentname + "', AgentRole = '" + agentrole + "', Department1 = '" + dept1 + "', Department2 = '" + dept2 + "', Department3 = '" + dept3 + "' ";

    dbinterface.updateDataToTable(dbobj, conn, AGENT_TABLE, filter, status, function (err, data) {
        if (err) {
            // error handling code goes here
            response.end("FAILURE");
            console.log("ERROR : ", err);
        } else {
            // code to execute on data retrieval
            response.end("SUCCESS");
            console.log("Agent Details Updated Successfully");

        }
        dbinterface.endConnection(dbobj, conn);
    });

}

/**
 * Update Agent Information to database.
 **/
function resetSelectedAgentpassword(ParamsWithValue, response, siteAdminCode) {
    var AGENT_TABLE = "agentlist";
    var dbobj = dbinterface.initialize();
    var conn = dbinterface.connectDB(dbobj, siteAdminCode);

    var pwd = SHA1Encryp.SHA1("password");
    var status = " Password = '" + pwd + "' ";
    var agentId = ParamsWithValue.agentid;
    var filter = "where AgentId = '" + agentId + "' ";
    dbinterface.updateDataToTable(dbobj, conn, AGENT_TABLE, filter, status, function (err, data) {
        if (err) {
            // error handling code goes here
            response.end("FAILURE");
            console.log("ERROR : ", err);
        } else {
            // code to execute on data retrieval
            response.end("SUCCESS");
            console.log("Agent Details Updated Successfully");

        }
        dbinterface.endConnection(dbobj, conn);
    });

}
/**
 * Change password on first time login.
 **/
function changePassword(username, password, response,siteAdminCode) {
    var AGENT_TABLE = "agentlist";
    var dbobj = dbinterface.initialize();
    var conn = dbinterface.connectDB(dbobj,siteAdminCode);
    var filter = "where AgentName = '" + username + "' ";
    //var pwd = SHA1Encryp.SHA1(password);
    var status = " Password = '" + password + "', FirstTimeLogin = 0 ";

    dbinterface.updateDataToTable(dbobj, conn, AGENT_TABLE, filter, status, function (err, data) {
        if (err) {
            // error handling code goes here
            console.log("ERROR : ", err);
        } else {
            // code to execute on data retrieval
            response.end("changepwd : password updated successfully");
            console.log("password updated successfully");

        }
    });
    dbinterface.endConnection(dbobj, conn);
}
/**
 * Change password By agent.
 **/
function changePasswordByAgent(username, password, siteAdminCode, response) {
    var AGENT_TABLE = "agentlist";
    var dbobj = dbinterface.initialize();
    var conn = dbinterface.connectDB(dbobj, siteAdminCode);
    var filter = "where AgentName = '" + username + "' ";
    //var pwd = SHA1Encryp.SHA1(password);
    var status = " Password = '" + password + "' ";

    dbinterface.updateDataToTable(dbobj, conn, AGENT_TABLE, filter, status, function (err, data) {
        if (err) {
            // error handling code goes here
            console.log("ERROR : ", err);
        } else {
            // code to execute on data retrieval
            response.end("changepwdbyagent : password changed successfully");
            console.log("password changed successfully");

        }
    });
    dbinterface.endConnection(dbobj, conn);
}

/**
 * retrieve agent Roles list.
 **/
function retrieveAgentRolesList(response, siteAdminCode) {
    var AGENT_ROLES_TABLE = "agentroles";
    var dbobj = dbinterface.initialize();
    var conn = dbinterface.connectDB(dbobj, siteAdminCode);
    dbinterface.fetchDataFromTable(dbobj, conn, AGENT_ROLES_TABLE, "", "", function (err, data) {
        if (err) {
            // error handling code goes here
            console.log("ERROR : ", err);
        } else {
            // code to execute on data retrieval			

            //console.log("result from db is : ",data);   
            response.end(JSON.stringify(data));
        }
        dbinterface.endConnection(dbobj, conn);
    });

}
/**
 * retrieve agent Dept list.
 **/
function retrieveAgentDeptList(response, siteAdminCode) {
    var DEPARTMENTS = "departments";
    var dbobj = dbinterface.initialize();
    var conn = dbinterface.connectDB(dbobj, siteAdminCode);
    dbinterface.fetchDataFromTable(dbobj, conn, DEPARTMENTS, "", "", function (err, data) {
        if (err) {
            // error handling code goes here
            console.log("ERROR : ", err);
        } else {
            // code to execute on data retrieval			

            //console.log("result from db is : ",data);   
            response.end(JSON.stringify(data));
        }
        dbinterface.endConnection(dbobj, conn);
    });

}

/**
 *	Retrieve Agent Roles and Dept List
 **/
function retrieveAgentRolesAndDeptList(response, siteAdminCode) {
    var AGENT_ROLES_TABLE = "agentroles";
    var DEPARTMENTS = "departments";
    var dbobj = dbinterface.initialize();
    var conn = dbinterface.connectDB(dbobj, siteAdminCode);
    var deptlist = [];
    var rolesnDeptList = {"list": deptlist};
    var filter = " where AgentRole!= 'Agent'";
    dbinterface.fetchDataFromTable(dbobj, conn, AGENT_ROLES_TABLE, filter, "", function (err, data) {
        if (err) {
            // error handling code goes here
            console.log("ERROR : ", err);
        } else {
            // code to execute on data retrieval			

            console.log("result from db is : ", data);
            //response.end(JSON.stringify(data));
            deptlist.push(JSON.stringify(data));
            dbinterface.fetchDataFromTable(dbobj, conn, DEPARTMENTS, "", "", function (err, data) {
                if (err) {
                    // error handling code goes here
                    console.log("ERROR : ", err);
                } else {
                    // code to execute on data retrieval			

                    console.log("result from db is : ", data);
                    deptlist.push(JSON.stringify(data));
                    rolesnDeptList.list = deptlist;
                    response.end(JSON.stringify(rolesnDeptList));
                }
                dbinterface.endConnection(dbobj, conn);
            });
        }


    });

}
/**
 * retrieve Agent list.
 **/
function retrieveAgentList(response, siteAdminCode) {
    var AGENT_TABLE = "agentlist";
    var dbobj = dbinterface.initialize();
    console.log("Agent List initiated" + siteAdminCode)
    var conn = dbinterface.connectDB(dbobj, siteAdminCode);
    dbinterface.fetchDataFromTable(dbobj, conn, AGENT_TABLE, "", "", function (err, data) {
        if (err) {
            // error handling code goes here
            console.log("ERROR : ", err);
        } else {
            // code to execute on data retrieval			

            //console.log("result from db is : ",data);   
            response.end(JSON.stringify(data));
        }
        dbinterface.endConnection(dbobj, conn);
    });

}
/**
 * get First time login status of agent.
 **/
function checkFirstTimeLoginStatus(ParamsWithValue, response, firstTimeAuthentication) {
    var AGENT_TABLE = "agentlist";
    var dbobj = dbinterface.initialize();
    var agentname = ParamsWithValue.agentname;
    var conn = dbinterface.connectDB(dbobj, firstTimeAuthentication);
    var filter = " where AgentName = '" + agentname + "'";
    console.log(filter);
    dbinterface.fetchDataFromTable(dbobj, conn, AGENT_TABLE, filter, "", function (err, data) {
        if (err) {
            // error handling code goes here
            console.log("ERROR : ", err);
        } else {
            // code to execute on data retrieval			

            //console.log("result from db is : ",data);   
            if (data.length > 0) {
                console.log("DATA : " + data);

                //var resultdata = JSON.stringify(data);
                console.log("DATA 1 : " + data[0].FirstTimeLogin);

                response.end(data[0].FirstTimeLogin.toString());
            } else {
                response.end(0);
            }
        }
        dbinterface.endConnection(dbobj, conn);
    });

}
/**
 * Insert agent Information to database.
 **/
function insertAgentinfo(ParamsWithValue, response, siteAdminCode) {
    var pwd = "password";
    console.log(ParamsWithValue);
    var agentname = ParamsWithValue.agentname;
    var agentrole = ParamsWithValue.agentrole;
    var agentId = ParamsWithValue.agentId;
    var dept1 = ParamsWithValue.dept1;
    var dept2 = ParamsWithValue.dept2;
    var dept3 = ParamsWithValue.dept3;
    var password = SHA1Encryp.SHA1(pwd);
    var dbobj = dbinterface.initialize();
    var AGENT_TABLE = "agentlist";
    var values = "('" + agentId + "','" + agentname + "','Available','-1','" + password + "','','" + agentrole + "',1,'" + dept1 + "','" + dept2 + "','" + dept3 + "')";

//Open DB connection
    var conn = dbinterface.connectDB(dbobj, siteAdminCode);
    var filter = " where AgentName = '" + agentname + "'";
    dbinterface.fetchDataFromTable(dbobj, conn, AGENT_TABLE, filter, "", function (err, data) {
        if (err) {
            // error handling code goes here
            console.log("ERROR : ", err);
            dbinterface.endConnection(dbobj, conn);
        } else {
            // code to execute on data retrieval			
            if (data.length > 0) {
                resp.writeHead(200, {'Content-Type': 'text/plain'});
                dbinterface.endConnection(dbobj, conn);
                resp.end("Agent already exist");
            } else if (data.length == 0) {
                dbinterface.insertDatatoTable(dbobj, conn, AGENT_TABLE, values, function (err, data) {
                    if (err) {
                        // error handling code goes here
                        console.log("ERROR : ", err);
                        response.end("FAILED");
                    } else {

                        console.log("result from db is : ", data);
                        response.end("SUCCESS");

                    }
                    dbinterface.endConnection(dbobj, conn);
                });
            }
            else {
                resp.writeHead(401, {'Content-Type': 'text/plain'});
                dbinterface.endConnection(dbobj, conn);
                resp.end("FAILURE");
            }
            console.log("result from db is : ", data);
        }

    });


}
/**
 * Delete Agent information from database.
 **/
function deleteAgentinfo(ParamsWithValue, response, siteAdminCode) {

    var agentId = ParamsWithValue.agentId.trim();

    var dbobj = dbinterface.initialize();
    var AGENT_TABLE = "agentlist";
    var filter = "where AgentId = '" + agentId + "'";

    console.log(filter);
//Open DB connection
    var conn = dbinterface.connectDB(dbobj, siteAdminCode);
    dbinterface.deleteFromTable(dbobj, conn, AGENT_TABLE, filter, function (err, data) {
        if (err) {
            // error handling code goes here
            console.log("ERROR : ", err);
            response.end("FAILED");
        } else {

            console.log("result from db is : ", data);
            response.end("SUCCESS");

        }
        dbinterface.endConnection(dbobj, conn);
    });

}
/**
 * Admin  Authentication.
 **/
function verifyIdentity(type, username, password, siteAdminCode, method) {
    var ADMIN_TABLE = "admininfo";
    var AGENT_TABLE = "agentlist";
//initialize
    var dbobj = dbinterface.initialize();
//console.log(dbobj);
//Open DB connection
    var conn = dbinterface.connectDB(dbobj, siteAdminCode);
    var table;
    var flag = (method == 'agentchangepassword') ? true : false;
//Select password from DB
    if (type == "admin") {
        filter = "where AdminName = '" + username + "'";
        table = ADMIN_TABLE;
        //console.log(filter);

    } else {
        filter = "where AgentName = '" + username + "'";
        table = AGENT_TABLE;
    }
    dbinterface.fetchDataFromTable(dbobj, conn, table, filter, "", function (err, data) {
        if (err) {
            // error handling code goes here
            console.log("ERROR : ", err);
            dbinterface.endConnection(dbobj, conn);
            resp.writeHead(401, {'Content-Type': 'text/plain'});
            resp.end("FAILURE");
        } else {
            // code to execute on data retrieval			
            if (data.length > 0 && data[0].Password.trim() == password.trim()) {
                resp.writeHead(200, {'Content-Type': 'text/plain'});
                dbinterface.endConnection(dbobj, conn);
                //resp.end("SUCCESS");
                if (type == "agent") {
                    if (data[0].SessionId != "" && !flag) {
                        resp.end("AGENT ALREADY LOGGEDIN!!");
                        console.log('code to execute on data retrieval');
                    } else {
                        resp.end("agent : " + data[0].AgentId);
                    }
                } else {
                    resp.end("SUCCESS");
                }
            } else {
                dbinterface.endConnection(dbobj, conn);
                resp.writeHead(401, {'Content-Type': 'text/plain'});
                resp.end("FAILURE");
            }
            //console.log("result from db is : ",data);   
        }

    });
//Authenticate

}
/**
 * Agent Authentication.
 **/
function verifyAgentIdentity(agentsList, username, password) {
    var list = (JSON.parse(agentsList).AgentList).Agent;
    for (var agent in list) {
        if (list.hasOwnProperty(agent)) {

            var agentDetails = JSON.stringify(list[agent]);
            var array = JSON.parse(agentDetails);

            if (array.AgentId == username && array.Password == password && array.SessionId != "") {
                return "SUCCESS:AGENT ALREADY LOGGEDIN";

            } else if (array.AgentId == username && array.Password == password) {
                return "SUCCESS";
            }
            else {
                return "UNAUTHORIZED";
            }

        }
    }
}
function loadXMLDoc(filePath, response) {
    var fs = require('fs');
    var xml2js = require('xml2js');
    var json;
    try {
        var fileData = fs.readFileSync(filePath, 'ascii');

        var parser = new xml2js.Parser();
        parser.parseString(fileData.substring(0, fileData.length), function (err, result) {

            json = JSON.stringify(result);
            //response.end(json);
            //console.log(JSON.stringify(result));
        });

        //console.log("File '" + filePath + "/ was successfully read.\n");
        return json;
    } catch (ex) {
        console.log(ex)
    }
}
	