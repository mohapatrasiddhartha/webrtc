var ROLES = 0;
var DEPARTMENTS = 1;
var AGENT_URL = "http://" + location.hostname + ":8088/AgentList";
var PASSWORD_CHANGE_URL = "http://" + location.hostname + ":8088/Login";
var agentCompanyCode = "";
function fetchAndDisplayAgentList(type) {
    sendRequest1(AGENT_URL, type);
}

function fetchAgentRolesAndDepartments() {
//alert("fetching roles...");
    sendRequestTofetchAgentRolesAndDepartments();
}
function sendRequestTofetchAgentRolesAndDepartments() {
    var agentCompanyCode;
    if (type == "admin") {
        agentCompanyCode = sessionStorage.adminId;
    }
    else {
        agentCompanyCode = sessionStorage.getItem("agentCompanyCode");
    }
    var request;
    var response;

    if (window.XMLHttpRequest)
    {
        request = new XMLHttpRequest();
    }
    else
    {
        request = new ActiveXObject("Microsoft.XMLHTTP");
    }

    request.onreadystatechange = function ()
    {

        if (request.readyState == 4 && request.status == 200)
        {
            var agentsRoles = [];
            var agentRoles = [];
            var agentDept = [];
            var agentsDepartments = [];

            var rolesnDeptList = JSON.parse(request.responseText);
            var list = rolesnDeptList.list;
            agentRoles = JSON.parse(list[ROLES])
            agentDept = JSON.parse(list[DEPARTMENTS]);
            //(JSON.parse(request.responseText).AgentList).Agent;
            //alert(agentrolesResponse);
            for (var agentrole in agentRoles) {
                if (agentRoles.hasOwnProperty(agentrole)) {

                    var agentDetails = JSON.stringify(agentRoles[agentrole]);
                    var array = JSON.parse(agentDetails);

                    agentsRoles.push(array);
                    //alert(agentsRolesArray);
                }
            }
            //alert(agentsRoles);
//            addingRolesToDropDown(agentsRoles);

            for (var dept in agentDept) {
                if (agentDept.hasOwnProperty(dept)) {

                    var agentDetails = JSON.stringify(agentDept[dept]);
                    var array = JSON.parse(agentDetails);

                    agentsDepartments.push(array);
                    //alert(agentsRolesArray);
                }
            }
            //alert(agentsRoles);
            addingDeptsToDropDown(agentsDepartments);
        }
    }
    var AGENT_ROLE_URL = "http://" + location.hostname + ":8088/FetchRolesandDepts";
    request.open("GET", AGENT_ROLE_URL, true);
    request.setRequestHeader("Authorization", "Basic " + window.btoa(agentCompanyCode + ":" + agentCompanyCode));
    request.send();
    return request;
}
function addingRolesToDropDown(rolesarry) {
    var agentroledropdown = document.getElementById("agentrole");
    if (rolesarry.length != 0) {
        for (var roleid = 0; roleid < (rolesarry.length); roleid++) {
            var option = document.createElement("option");
            option.text = rolesarry[roleid].AgentRole;
            option.id = "roles";
            agentroledropdown.add(option);
            console.log('ssss');
        }
    } else {
        var option = document.createElement("option");
        option.text = "Default";
        agentroledropdown.add(option);
    }
}
function addingDeptsToDropDown(rolesarry) {
    var agentroledropdown = document.getElementById("agentrole");
    if (rolesarry.length != 0) {
        for (var roleid = 0; roleid < (rolesarry.length); roleid++) {
            var option = document.createElement("option");
            option.text = rolesarry[roleid].departments;
            option.id = "departments";
            agentroledropdown.add(option);
        }

    }
}
function showAgents() {
    var FIELD_COUNT = 1;
    var agentrole = document.getElementById('agentrole');
    var selectedItem = agentrole.options[agentrole.selectedIndex].value;
    var type = agentrole.options[agentrole.selectedIndex].id;
    var agentTbl = document.getElementById('agentListTable');
    var list = agentTbl.getElementsByTagName('tr');
    if (type == "departments") {
        //alert(JSON.stringify(deptAgents[selectedItem.trim()]));
        //formAgentStatusData(deptAgents[selectedItem.trim()],true);

        var agentField;
        for (var agt = FIELD_COUNT; agt < list.length; agt++) {
            agentField = document.getElementById(list[agt].id);

            if (list[agt].id.indexOf(encodeURI(selectedItem)) == -1) {
                //alert("none: "+list[agt].id);			
                agentField.style.display = "none";
            } else {
                //alert(list[agt].id);
                agentField.style.display = "table-row";
            }
        }
    } else {
        for (var agt = FIELD_COUNT; agt < list.length; agt++) {
            agentField = document.getElementById(list[agt].id);
            agentField.style.display = "table-row";
        }
    }
    //updateAgentStatus();
}
function sendRequest1(url, type) {
    var agentCompanyCode;
    if (type == "admin") {
        agentCompanyCode = sessionStorage.adminId;
    }
    else {
        agentCompanyCode = sessionStorage.getItem("agentCompanyCode");
    }
    var request;
    var response;
    if (window.XMLHttpRequest)
    {
        request = new XMLHttpRequest();
    }
    else
    {
        request = new ActiveXObject("Microsoft.XMLHTTP");
    }
    request.onreadystatechange = function ()
    {
        if (request.readyState == 4 && request.status == 200)
        {
            var agentsArray = [];
            var agentLists = [];
            agentLists = JSON.parse(request.responseText);
            for (var agent in agentLists) {
                if (agentLists.hasOwnProperty(agent)) {
                    var agentDetails = JSON.stringify(agentLists[agent]);
                    var array = JSON.parse(agentDetails);
                    agentsArray.push(array);
                }
            }
            //fetchAgentLists(response);
            if (type == 'admin') {
                createtable(agentsArray);
            } else {
                formAgentStatusData(agentsArray);
            }
        }
    }

    request.open("GET", url, true);
    request.setRequestHeader("Authorization", "Basic " + window.btoa(agentCompanyCode + ":" + agentCompanyCode));
    request.send();
    return request;
}

function formAgentStatusData(agentsArray) {
    var htmlBuilder = [];
    htmlBuilder
            .push("<table id='agentListTable' width='100%' ");

    htmlBuilder.push('<tr>');

    htmlBuilder.push('<th style="text-align:center;color:#FFFFFF;padding-Top:5px;padding-Left:10px;background-color:#4682b4;height:30px;width: 30%">' + "AgentName" + '</th>');
    htmlBuilder.push('<th style="text-align:center;color:#FFFFFF;padding-Top:5px;padding-Left:10px;background-color:#4682b4;height:30px;width: 30%">' + "AgentRole" + '</th>');
    htmlBuilder.push('<th style="text-align:center;color:#FFFFFF;padding-Top:5px;padding-Left:5px;background-color:#4682b4;height:30px;width: 20%">' + "Status" + '</th>');

    htmlBuilder.push('</tr>');

    for (var id = 0; id < (agentsArray.length); id++)

    {
        var agtRowId = encodeURI(agentsArray[id].Department1 + '|' + agentsArray[id].Department2 + '|' + agentsArray[id].Department3) + agentsArray[id].AgentId;
        if (id % 2 == 0) {
            htmlBuilder.push('<tr id = ' + agtRowId + ' style="text-align:center;color:#000000;padding-Top:5px;padding-Left:10px;background-color:#e2e4f0;height:50px;width: 30%">');
        } else {
            htmlBuilder.push('<tr id = ' + agtRowId + ' style="text-align:center;color:#000000;padding-Top:5px;padding-Left:10px;background-color:#c5d0e5;height:50px;width: 30%">');
        }

        //alert("Name : "+agentsArray[id].AgentName + "\n" +"Status : "+agentsArray[id].AgentStatus +"\n"+"SessionId : "+agentsArray[id].SessionId);
        htmlBuilder.push('<td  class="firstColumn" >' + agentsArray[id].AgentName + '</td>');
        htmlBuilder.push('<td class="secondColumn">' + agentsArray[id].AgentRole + '</td>');
        //alert(agentsArray[id].SessionId);
        if (agentsArray[id].AgentStatus == "Busy") {
            htmlBuilder.push('<td class="thirdColumn">'
                    + '<img id = img' + agentsArray[id].AgentId + ' style="width:20px;height:20px;" src = "./img/busy.png" id=\"' + "status" + agentsArray[id]
                    + '\"' + '>' + '</td>');
        } else if (agentsArray[id].AgentStatus == "Available" && agentsArray[id].SessionId != "") {
            htmlBuilder.push('<td class="thirdColumn">'
                    + '<img id = img' + agentsArray[id].AgentId + ' style="width:20px;height:20px;" src = "./img/available.png" id=\"' + "status" + agentsArray[id]
                    + '\"' + '>' + '</td>');
        } else {
            htmlBuilder.push('<td class="thirdColumn">'
                    + '<img id = img' + agentsArray[id].AgentId + ' style="width:20px;height:20px;" src = "./img/offline.png" id=\"' + "status" + agentsArray[id]
                    + '\"' + '>' + '</td>');
        }
        //alert('id = img'+agentsArray[id].AgentId);		
        htmlBuilder.push('</tr>');

    }
    htmlBuilder.push("</table>");

    var html;
    html = htmlBuilder.join("");

    //window.localStorage.setItem("allAgentsList", html);
    document.getElementById('userlist').innerHTML = html;
    //populateAgentsList();
    //alert("status updating calling.............");
    updateAgentStatus('online');
}

function createtable(agentsArray) {
    //alert("table creating start");
    //var arraylist = name.split(",");
    var htmlBuilder = [];
    htmlBuilder
            .push("<table id='agentListTable' width='100%' class='notranslate commonclass tbl-listing'>");

    htmlBuilder.push('<tr>');
    //htmlBuilder.push('<th style="text-align:center;color:#FFFFFF;padding-Top:5px;padding-Left:10px;background-color:#4682b4;height:50px;width: 200px">' + "AgentId" + '</th>');
    htmlBuilder.push('<th style="width:24%">' + "AgentName" + '</th>');

    htmlBuilder.push('<th style="width:24%">' + "AgentRole" + '</th>');
    htmlBuilder.push('<th style="width:24%">' + "Status" + '</th>');
    htmlBuilder.push('<th style="width:24%">' + "Actions" + '</th>');

    htmlBuilder.push('</tr>');

    for (var id = 0; id < (agentsArray.length); id++)

    {
        if (id % 2 == 0) {
            htmlBuilder.push('<tr id = ' + agentsArray[id].AgentId + '>');
        } else {
            htmlBuilder.push('<tr id = ' + agentsArray[id].AgentId + '>');
        }
        //alert("Name : "+agentsArray[id].AgentName + "\n" +"Status : "+agentsArray[id].AgentStatus +"\n"+"SessionId : "+agentsArray[id].SessionId);
        //htmlBuilder.push('<tr>'); // onClick="playerFunction(\''

        //htmlBuilder.push('<td  class="firstColumn" >' + agentsArray[id].AgentId + '</td>');
        htmlBuilder.push('<td  class="firstColumn" >' + agentsArray[id].AgentName + '</td>');
        htmlBuilder.push('<td class="secondColumn">' + agentsArray[id].AgentRole + '</td>');
        if (agentsArray[id].AgentStatus == "Busy") {
            htmlBuilder.push('<td class="thirdColumn">'
                    + '<img id = img' + agentsArray[id].AgentId + ' style="width:20px;height:20px;" src = "./img/busy.png" id=\"' + "status" + agentsArray[id]
                    + '\"' + '>' + '</td>');
        } else if (agentsArray[id].AgentStatus == "Available" && agentsArray[id].SessionId != "") {
            htmlBuilder.push('<td class="thirdColumn">'
                    + '<img  id = img' + agentsArray[id].AgentId + ' style="width:20px;height:20px;" src = "./img/available.png" id=\"' + "status" + agentsArray[id]
                    + '\"' + '>' + '</td>');
        } else {
            htmlBuilder.push('<td class="thirdColumn">'
                    + '<img  id = img' + agentsArray[id].AgentId + ' style="width:20px;height:20px;" src = "./img/offline.png" id=\"' + "status" + agentsArray[id]
                    + '\"' + '>' + '</td>');
        }
        if (agentsArray[id].AgentStatus == "Busy") {

            htmlBuilder.push('<td  class="fourthColumn" ><a id = edit' + agentsArray[id].AgentId + ' style="opacity: 0.2; pointer-events: none;" class=\"editdelete\" href=\"javascript:editAgentinfo(\''
                    + agentsArray[id].AgentId
                    + '\',\'' + agentsArray[id].AgentName + '\',\'' + agentsArray[id].AgentRole + '\',\'' + agentsArray[id].Department1 + '\',\'' + agentsArray[id].Department2 + '\',\'' + agentsArray[id].Department3 + '\');\">   Edit  </a>&nbsp&nbsp<a id = delete' + agentsArray[id].AgentId + ' style="opacity: 0.2; pointer-events: none;" class=\"editdelete\" href=\"javascript:callDelete(\''
                    + agentsArray[id].AgentId
                    + '\',\''
                    + id
                    + '\');\">Delete</a>&nbsp&nbsp<a id = reset' + agentsArray[id].AgentId + ' style="opacity: 0.2; pointer-events: none;" class=\"editdelete\" href=\"javascript:callResetpwd(\''
                    + agentsArray[id].AgentId
                    + '\');\">Reset Pwd</a></td>');

        } else {
            htmlBuilder.push('<td  class="fourthColumn" ><a id = edit' + agentsArray[id].AgentId + ' class=\"editdelete\" href=\"javascript:editAgentinfo(\''
                    + agentsArray[id].AgentId
                    + '\',\'' + agentsArray[id].AgentName + '\',\'' + agentsArray[id].AgentRole + '\',\'' + agentsArray[id].Department1 + '\',\'' + agentsArray[id].Department2 + '\',\'' + agentsArray[id].Department3 + '\');\">   Edit  </a>&nbsp&nbsp<a id = delete' + agentsArray[id].AgentId + ' class=\"editdelete\" href=\"javascript:callDelete(\''
                    + agentsArray[id].AgentId
                    + '\',\''
                    + id
                    + '\');\">Delete</a>&nbsp&nbsp<a id = reset' + agentsArray[id].AgentId + ' class=\"editdelete\" href=\"javascript:callResetpwd(\''
                    + agentsArray[id].AgentId
                    + '\');\">Reset Pwd</a></td>');
        }


        htmlBuilder.push('</tr>');

    }
    if (agentsArray.length == 0) {
        htmlBuilder.push("<tr><td colspan=\"5\" >No Agents Found</td></tr>");
    }
    htmlBuilder.push("</table>");

    var html;
    html = htmlBuilder.join("");
    window.localStorage.setItem("allAgentsList", html);

    populateAgentsList();
}


// populate locally stored files list
function populateAgentsList() {

    var html = window.localStorage.getItem("allAgentsList");

    // alert(html);
    document.getElementById('userlist').innerHTML = html;
}

function changeAgentPassword() {
    showAgentChangePasswordPopUp();
}

function showAgentChangePasswordPopUp() {
    var changepasswordBox;
    $(document).ready(function () {

        changepasswordBox = document.getElementById('changepassword-box');
        $(changepasswordBox).fadeIn(300);

        //Set the center alignment padding + border
        var popMargTop = ($(changepasswordBox).height() + 24) / 2;
        var popMargLeft = ($(changepasswordBox).width() + 24) / 2;

        $(changepasswordBox).css({
            'margin-top': -popMargTop,
            'margin-left': -popMargLeft
        });

        // Add the mask to body
        $('body').append('<div id="mask"></div>');
        $('#mask').fadeIn(300);

        return false;
    });

    // When clicking on the button close or the mask layer the popup closed
    $('a.close, #mask').live('click', function () {

        $('#mask , changepassword-popup').fadeOut(300, function () {
            changepasswordBox.style.display = "none";
            $('#mask').remove();
        });
        return false;
    });
}

function onChangePasswordCancel() {
    cancelPasswordPopup();
}

function onChangePasswordDone() {
    passwordChangeByAgent();
}
function cancelPasswordPopup() {
    var loginBox = document.getElementById('changepassword-box');
    loginBox.style.display = "none";
    $('#mask').remove();
}

function passwordChangeByAgent() {

    var agentoldpassword = document.getElementById('agentoldpasswordforchange').value;
    if (agentoldpassword == null || agentoldpassword == "") {
        alert("please enter valid old password");
    }
    var sha1oldpassword = SHA1(agentoldpassword);
    var username = sessionStorage.getItem("agentname");
    //alert(username +" : "+sha1newpassword)
    sendRequest(PASSWORD_CHANGE_URL + "?type=agentchangepassword", username, sha1oldpassword, CHANGE_PASSWORD_AGENT);
}

var CHANGE_PASSWORD_AGENT = 'changepwdbyagent';

function authenticateChangePassword() {
    var agentnewpassword = document.getElementById('agentnewpasswordforchange').value;
    var agentconfirmpassword = document.getElementById('agentconfirmpasswordforchange').value;
    if (agentnewpassword != agentconfirmpassword) {
        alert("New password AND Confirm password don`t match");
        return;
    } else {
        var sha1newpassword = SHA1(agentnewpassword);
        var username = sessionStorage.getItem("agentname");

        sendRequest(PASSWORD_CHANGE_URL + "?type=changepwdbyagent", username, sha1newpassword, null);

    }
}
function sendRequest(url, username, password, type) {
    var request;
    var response;
    var agentCompanyCode;
    if (type == "admin") {
        agentCompanyCode = sessionStorage.adminId;
    }
    else {
        agentCompanyCode = sessionStorage.getItem("agentCompanyCode");
    }
    if (window.XMLHttpRequest)
    {
        request = new XMLHttpRequest();
    }
    else
    {
        request = new ActiveXObject("Microsoft.XMLHTTP");
    }

    request.onreadystatechange = function ()
    {

        if (request.readyState == 4 && request.status == 200)
        {
            response = request.responseText;
            //if(response == "SUCCESS"){
            if (response != undefined || response != "") {


                if (response.split(':')[0].trim() == 'agent') {
                    var agentId = response.split(':')[1];
                    sessionStorage.setItem("agentid", agentId);
                    sessionStorage.setItem("authenticated", true);
                    if (type == CHANGE_PASSWORD_AGENT) {
                        authenticateChangePassword();
                    }
                    else {
                        alert("change password fail")
                    }
                } else if (response.split(':')[0].trim() == 'changepwdbyagent') {

                    alert("password successfully changed")
                } else {
                    alert(response);
                }
            }
            //}	

        } else if (request.readyState == 4 && request.status == 401) {
            alert("change password fail");
        }
        cancelPasswordPopup();
    }

    request.open("GET", url, true);

    request.setRequestHeader("Authorization", "Basic " + window.btoa(username + ":" + password+ ":" + agentCompanyCode));
    request.send();
    return request;
}