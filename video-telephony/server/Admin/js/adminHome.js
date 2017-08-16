var socketServer = "ws://" + location.hostname + ":8080";
var socket;
var agentCompanyCode=sessionStorage.adminId;
var adminHome = (function () {
    var openSocketConnection = function () {
        socket = new WebSocket(socketServer);															//websocket is created and an event listener is added to it
        socket.addEventListener("message", onMessage, false);
        socket.addEventListener('open', function (event) {
            sendMessage({'type': 'client_info', 'user_type': 'admin'});
        }, false);
    };
    var checkAuthentication = function () {
        if (sessionStorage.getItem("adminauthenticated") != "true") {
            window.location.replace("AdminProvisioning.html");
            return;
        }
    };
    var sendMessage = function (message) {
        var mymsg = JSON.stringify(message);
        socket.send(mymsg);
    };
    var addNewAgent = function () {
        var addbutton = document.getElementById('addAgentbutton');
        addbutton.style.display = "inline-block"
        var updatebutton = document.getElementById('updateAgentbutton');
        updatebutton.style.display = "none";
        var agentNametxt = document.getElementById('agentname');
        agentNametxt.value = "";
        fetchAgentDepartments();
        var agentroledropdown = document.getElementById("agentrole");
        for (var id = agentroledropdown.options.length - 1; id >= 0; id--)
        {
            agentroledropdown.remove(id);
        }
        sendRequestToFetchAgentRoles();
        showAgentPopup();
        disableAllCheckBoxes();
    };
    var addDepartment = function () {
        showDepartmentPopup();
    }
    var showDepartmentPopup = function () {
        var addDepartmentBox = document.getElementById('department-box');
        $(addDepartmentBox).fadeIn(300);
        var popMargTop = ($(addDepartmentBox).height() + 24) / 2;
        var popMargLeft = ($(addDepartmentBox).width() + 24) / 2;
        $(addDepartmentBox).css({
            'margin-top': -popMargTop,
            'margin-left': -popMargLeft
        });
        $('body').append('<div id="mask"></div>');
        $('#mask').fadeIn(300);
        return false;
        $('a.close, #mask').live('click', function () {
            $('#mask , addRole-popup').fadeOut(300, function () {
                hideDepartmentPopup();
            });
            return false;
        });
    };
    var hideDepartmentPopup = function () {
        var adddepartment = document.getElementById('department-box');
        adddepartment.style.display = "none";
        $('#mask').remove();
    };
    var addDepartInfo = function () {
        var addAgentdepartment = document.getElementById('addAgentdepartment').value;
        if (addAgentdepartment == null || addAgentdepartment == "") {
            alert("please enter valid role value");
            return;
        }

        RequestToAgentServiceToaddNewDepartment(addAgentdepartment);
        document.getElementById('addAgentdepartment').value = "";
    };
    var RequestToAgentServiceToaddNewDepartment = function (addAgentdepartment) {
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
                response = request.responseText;

                if (response == "SUCCESS") {
                    /*var roles = localStorage.getItem("roles");
                     if(roles!=null){
                     roles += "," +newagentrole;
                     }else{
                     roles = newagentrole;
                     }
                     localStorage.setItem("roles",roles);*/

                    //alert("Role added successfully");
                } else if (response == "FAILURE") {
                    alert("department adding failed");
                } else {
                    alert(response);
                }
            }
            hideDepartmentPopup();
        }
        var url = "http://" + location.hostname + ":8088/addAgentdepartment";
        url = url + "?departments=" + addAgentdepartment;
        //alert(url);
        request.open("GET", url, true);
        request.setRequestHeader("Authorization", "Basic " + window.btoa(agentCompanyCode + ":" + agentCompanyCode));
        request.send();
        return request;
    };
    var addNewRole = function () {
        showRolePopup();
    };
    var showRolePopup = function () {
        addRoleBox = document.getElementById('role-box');
        $(addRoleBox).fadeIn(300);
        var popMargTop = ($(addRoleBox).height() + 24) / 2;
        var popMargLeft = ($(addRoleBox).width() + 24) / 2;
        $(addRoleBox).css({
            'margin-top': -popMargTop,
            'margin-left': -popMargLeft
        });
        $('body').append('<div id="mask"></div>');
        $('#mask').fadeIn(300);
        $('a.close, #mask').live('click', function () {
            $('#mask , addRole-popup').fadeOut(300, function () {
                hideRolePopup();
            });
            return false;
        });
    };
    var hideRolePopup = function () {
        var addroleBox = document.getElementById('role-box');
        addroleBox.style.display = "none";
        $('#mask').remove();
    };
    var addRoleInfo = function () {
        var addAgentRoleValue = document.getElementById('addagentrole').value;
        if (addAgentRoleValue == null || addAgentRoleValue == "") {
            alert("please enter valid role value");
            return;
        }
        sendRequestToAgentServiceToaddNewRole(addAgentRoleValue);
    };
    var sendRequestToAgentServiceToaddNewRole = function (newagentrole) {
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
                response = request.responseText;
                if (response == "SUCCESS") {
                    /*var roles = localStorage.getItem("roles");
                     if(roles!=null){
                     roles += "," +newagentrole;
                     }else{
                     roles = newagentrole;
                     }
                     localStorage.setItem("roles",roles);*/

                    //alert("Role added successfully");
                } else if (response == "FAILURE") {
                    alert("Agent role adding failed");
                } else {
                    alert(response);
                }
            }
            hideRolePopup();
        }
        populateAgentList();
        var url = "http://" + location.hostname + ":8088/NewAgentRole";
        url = url + "?agentrole=" + newagentrole;
        //alert(url);
        request.open("GET", url, true);
        request.setRequestHeader("Authorization", "Basic " + window.btoa(agentCompanyCode + ":" + agentCompanyCode));
        request.send();
        return request;
    };

    var init = function () {
        openSocketConnection();
        checkAuthentication();
        fetchAgentRoles();
        fetchAgentDepartments();
        fetchAndDisplayAgentList('admin');
    };
    return{
        openSocketConnection: openSocketConnection,
        addNewAgent: addNewAgent,
        addDepartment: addDepartment,
        hideDepartmentPopup: hideDepartmentPopup,
        addDepartInfo: addDepartInfo,
        addNewRole: addNewRole,
        hideRolePopup: hideRolePopup,
        addRoleInfo: addRoleInfo,
        init: init
    }
})();
$(function () {
    adminHome.init();
});
function onMessage(event) {
    var msg = JSON.parse(event.data);
    var status = msg.status;

    if (msg.type == "notify") {
        var img = document.getElementById('img' + msg.id.trim());
        if (status == 'online') {
            img.src = "./img/available.png"
            var editbutton = document.getElementById('edit' + msg.id.trim());
            editbutton.style.pointerEvents = 'auto';
            editbutton.style.opacity = "1.0";
            var deletebutton = document.getElementById('delete' + msg.id.trim());
            deletebutton.style.pointerEvents = 'auto';
            deletebutton.style.opacity = "1.0";
            var resetbutton = document.getElementById('reset' + msg.id.trim());
            resetbutton.style.pointerEvents = 'auto';
            resetbutton.style.opacity = "1.0";
        } else if (status == 'offline') {
            img.src = "./img/offline.png";
            var editbutton = document.getElementById('edit' + msg.id.trim());
            editbutton.style.pointerEvents = 'auto';
            editbutton.style.opacity = "1.0";
            var deletebutton = document.getElementById('delete' + msg.id.trim());
            deletebutton.style.pointerEvents = 'auto';
            deletebutton.style.opacity = "1.0";
            var resetbutton = document.getElementById('reset' + msg.id.trim());
            resetbutton.style.pointerEvents = 'auto';
            resetbutton.style.opacity = "1.0";
        } else if (status == 'busy') {
            img.src = "./img/busy.png";
            var editbutton = document.getElementById('edit' + msg.id.trim());
            editbutton.style.pointerEvents = 'none';
            editbutton.style.opacity = "0.2";
            var deletebutton = document.getElementById('delete' + msg.id.trim());
            deletebutton.style.pointerEvents = 'none';
            deletebutton.style.opacity = "0.2";
            var resetbutton = document.getElementById('reset' + msg.id.trim());
            resetbutton.style.pointerEvents = 'none';
            resetbutton.style.opacity = "0.2";
        }
    }
}
/** add department popup stuff **/
/** add department popup stuff end **/
/** add agent role */
/** add agent role end */

/** fetch agent role  */
function fetchAgentRoles() {
//alert("fetching roles...");
    sendRequestToFetchAgentRoles();
}

function fetchAgentDepartments() {
    sendRequestToFetchAgentDepartments();
}
function sendRequestToFetchAgentRoles() {
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
            var agentrolesResponse = [];
            //agentLists = request.responseText;
            //alert("response :"+request.responseText);
            agentrolesResponse = JSON.parse(request.responseText);//(JSON.parse(request.responseText).AgentList).Agent;
            //alert(agentrolesResponse);
            for (var agentrole in agentrolesResponse) {
                if (agentrolesResponse.hasOwnProperty(agentrole)) {

                    var agentDetails = JSON.stringify(agentrolesResponse[agentrole]);
                    var array = JSON.parse(agentDetails);

                    agentsRoles.push(array);
                    //alert(agentsRolesArray);
                }
            }
            //alert(agentsRoles);
            addingRolesToDropDown(agentsRoles);

        }
    }
    var AGENT_ROLE_URL = "http://" + location.hostname + ":8088/FetchRoles";
    request.open("GET", AGENT_ROLE_URL, true);
    request.setRequestHeader("Authorization", "Basic " + window.btoa(agentCompanyCode + ":" + agentCompanyCode));
    request.send();
    return request;
}

function sendRequestToFetchAgentDepartments() {
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
            var agentsDepts = [];
            var agentdeptresponse = [];
            //agentLists = request.responseText;
            //alert("response :"+request.responseText);
            agentdeptresponse = JSON.parse(request.responseText);//(JSON.parse(request.responseText).AgentList).Agent;
            //alert(agentrolesResponse);
            for (var dept in agentdeptresponse) {
                if (agentdeptresponse.hasOwnProperty(dept)) {

                    var agentDetails = JSON.stringify(agentdeptresponse[dept]);
                    var array = JSON.parse(agentDetails);

                    agentsDepts.push(array);
                    //alert(agentsRolesArray);
                }
            }
            //alert(agentsRoles);
            formDeptCheckBox(agentsDepts);

        }
    }
    var AGENT_ROLE_URL = "http://" + location.hostname + ":8088/FetchDepts";
    request.open("GET", AGENT_ROLE_URL, true);
    request.setRequestHeader("Authorization", "Basic " + window.btoa(agentCompanyCode + ":" + agentCompanyCode));
    request.send();
    return request;
}
function formDeptCheckBox(deptarray) {
    var container = document.getElementById('depts');
    var tbl = document.createElement("table");
    tbl.setAttribute("style", "overflow-y: auto");
    tbl.setAttribute("style", "height: 100px");
    for (var deptid = 0; deptid < (deptarray.length); deptid++) {
        var row = document.createElement("tr");
        var cell = document.createElement("td");
        var checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.name = "name";
        checkbox.value = deptarray[deptid].departments;
        checkbox.id = deptarray[deptid].departments;
        cell.appendChild(checkbox);
        var cell2 = document.createElement("td");
        var label = document.createElement('label')
        label.htmlFor = "dept" + deptid;
        label.appendChild(document.createTextNode(deptarray[deptid].departments));

        //container.appendChild(checkbox);
        cell2.appendChild(label);
        row.appendChild(cell);
        row.appendChild(cell2);
        tbl.appendChild(row);
    }
    tbl.setAttribute("border", "0");
    container.innerHTML = "";
    container.appendChild(tbl);
}
function addingRolesToDropDown(rolesarry) {
//alert(rolesarry.length);
    var agentroledropdown = document.getElementById("agentrole");
    if (rolesarry.length != 0) {
        for (var roleid = 0; roleid < (rolesarry.length); roleid++) {
            var option = document.createElement("option");
            option.text = rolesarry[roleid].AgentRole;
            agentroledropdown.add(option);
            //localStorage.setItem("roles",roles);
            //alert(rolesarry[roleid].AgentRole);
        }

    } else {
        var option = document.createElement("option");
        option.text = "Default";
        agentroledropdown.add(option);
    }
}

/** fetch agent role end */

function adminLogout() {
    window.location.replace("AdminProvisioning.html");
    sessionStorage.removeItem("adminauthenticated");
    if (socket != undefined || socket != null)
        socket.close();

}
function showAgentPopup() {
    $(document).ready(function () {

        addAgentBox = document.getElementById('addAgent-box');

        $(addAgentBox).fadeIn(300);


        var popMargTop = ($(addAgentBox).height() + 24) / 2;
        var popMargLeft = ($(addAgentBox).width() + 24) / 2;

        $(addAgentBox).css({
            'margin-top': -popMargTop,
            'margin-left': -popMargLeft
        });


        $('body').append('<div id="mask"></div>');
        $('#mask').fadeIn(300);

        return false;
    });


    $('a.close, #mask').live('click', function () {

        $('#mask , addAgent-popup').fadeOut(300, function () {
            cancelagentPopup();
        });
        return false;
    });
}
function cancelagentPopup() {
    var addAgentBox = document.getElementById('addAgent-box');
    addAgentBox.style.display = "none";
    $('#mask').remove();
    populateAgentList();
}

function addAgentInfo() {
    var agentname = document.getElementById('agentname').value;
    if (agentname == null || agentname == "") {
        alert("please enter valid Agent name");
        return;
    }
    var agentdept = document.getElementById('depts');
    var depts = agentdept.getElementsByTagName('input');
    var departments = [];
    var selectedCnt = 0;
    for (index = 0; index < depts.length; ++index) {
        if (depts[index].checked == true) {
            selectedCnt++;
            departments.push(depts[index].value);
        }
    }
    if (selectedCnt > 3) {
        alert("Agents can be mapped to 3 departments only !!!");
        departments = [];
    }
    var agentrole = document.getElementById('agentrole');
    var selected = agentrole.options[agentrole.selectedIndex].value;
    var agentId = generateUUID();
    populateAgentList();
    sendRequestToAgentService(agentname, selected, agentId, departments)

}

function updateAgentInfo() {
    var agentname = document.getElementById('agentname').value;
    var agentrole = document.getElementById('agentrole');
    var selected = agentrole.options[agentrole.selectedIndex].value;
    var agentid = document.getElementById('hiddenAgentId').value;
    var agentdept = document.getElementById('depts');
    var depts = agentdept.getElementsByTagName('input');
    var departments = [];
    var selectedCnt = 0;
    for (index = 0; index < depts.length; ++index) {
        if (depts[index].checked == true) {
            selectedCnt++;
            departments.push(depts[index].value);
        }
    }
    if (selectedCnt > 3) {
        alert("Agents can be mapped to 3 departments only !!!");
        departments = [];
    }
    populateAgentList();
    cancelagentPopup();
    //alert(agentname+":"+selected+":"+agentid);
    sendRequestToUpdateAgentInfo(agentname, selected, agentid, departments)
}
function sendRequestToAgentService(agentname, agentrole, agentId, depts) {
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
            response = request.responseText;
            cancelagentPopup();
            if (response == "SUCCESS") {
                fetchAndDisplayAgentList('admin');
            } else if (response == "FAILURE") {
                alert("Agent Details not inserted");
            } else {
                alert(response);
            }

        }
    }
    var dept1, dept2, dept3;
    dept1 = depts.length > 0 ? depts[0] : "";
    dept2 = depts.length > 1 ? depts[1] : "";
    dept3 = depts.length > 2 ? depts[2] : "";
    //alert(dept1 + " : " +dept2+" : " +dept3); 
    var url = "http://" + location.hostname + ":8088/AgentEntry";
    url = url + "?agentname=" + agentname + "&agentrole=" + agentrole + "&agentId=" + agentId + "&dept1=" + dept1 + "&dept2=" + dept2 + "&dept3=" + dept3;
    //alert(url);
    request.open("GET", url, true);
    request.setRequestHeader("Authorization", "Basic " + window.btoa(agentCompanyCode + ":" + agentCompanyCode));
    request.send();
    return request;
}
/*
 * AgentDetails edit and update into DB.
 */
function sendRequestToUpdateAgentInfo(agentname, agentrole, agentId, depts) {
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
            response = request.responseText;
            cancelagentPopup();
            if (response == "SUCCESS") {
                fetchAndDisplayAgentList('admin');
            } else if (response == "FAILURE") {
                alert("Agent Details not inserted");
            } else {
                alert(response);
            }

        }
    }
    var dept1, dept2, dept3;
    dept1 = depts.length > 0 ? depts[0] : "";
    dept2 = depts.length > 1 ? depts[1] : "";
    dept3 = depts.length > 2 ? depts[2] : "";
    var url = "http://" + location.hostname + ":8088/AgentUpdate";
    url = url + "?agentname=" + agentname + "&agentrole=" + agentrole + "&agentid=" + agentId + "&dept1=" + dept1 + "&dept2=" + dept2 + "&dept3=" + dept3;
    //alert(url);
    request.open("GET", url, true);
    request.setRequestHeader("Authorization", "Basic " + window.btoa(agentCompanyCode + ":" + agentCompanyCode));
    request.send();
    return request;
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
;
function editAgentinfo(agentId, agentName, agentRole, dept1, dept2, dept3) {
    var addbutton = document.getElementById('addAgentbutton');
    addbutton.style.display = "none";
    var updatebutton = document.getElementById('updateAgentbutton');
    updatebutton.style.display = "inline-block"
    //var agentdetails = document.getElementById(id);
    //alert(agentdetails);
    disableAllCheckBoxes();
    populateAgentinfo(agentId, agentName, agentRole);
    showAgentPopup();
    if (dept1 != null && dept1 !== "") {
        enableCheckBox(dept1);
    }
    if (dept2 != null && dept2 !== "") {
        enableCheckBox(dept2);
    }
    if (dept3 != null && dept3 !== "") {
        enableCheckBox(dept3);
    }
}
function enableCheckBox(id) {
    var deptchkbox = document.getElementById(id);
    deptchkbox.checked = true;
}
function disableAllCheckBoxes() {
    var agentdept = document.getElementById('depts');
    var depts = agentdept.getElementsByTagName('input');
    var departments = [];
    for (index = 0; index < depts.length; ++index) {
        depts[index].checked = false;

    }
}
function populateAgentinfo(agentId, agentName, agentRole) {
    var agentNametxt = document.getElementById('agentname');
    agentNametxt.value = agentName;
    var agentrole = document.getElementById('agentrole');
    agentrole.value = agentRole;

    var agentid = document.getElementById('hiddenAgentId');
    agentid.value = agentId;
}
/** to delete agents in admin console **/
function callDelete(id) {
    var result = confirm("Are you sure you want to delete? ");
    if (result) {
        sendRequestToAgentDelete(id);
    }
}
/**to reset agents pasword in admin console **/
function callResetpwd(agentId) {
//var result = confirm("Are you sure you want to delete? ");
    alert(agentId);
    sendRequestToResetPassword(agentId);
}

function sendRequestToResetPassword(agentId) {
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
            response = request.responseText;
            //cancelagentPopup();	
            if (response == "SUCCESS") {
                //fetchAndDisplayAgentList('admin');
                alert("Password changed sucessfully");
            }
        }
    }
    var url = "http://" + location.hostname + ":8088/Agentpasswordreset";
    url = url + "?agentid=" + agentId;
    //alert(url);
    request.open("GET", url, true);
    request.setRequestHeader("Authorization", "Basic " + window.btoa(agentCompanyCode + ":" + agentCompanyCode));
    request.send();
    return request;
}
function sendRequestToAgentDelete(agentId) {
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
            response = request.responseText;
            //cancelagentPopup();	
            if (response == "SUCCESS") {
                fetchAndDisplayAgentList('admin');
            }

        }
    }
    var url = "http://" + location.hostname + ":8088/AgentDelete";
    url = url + "?agentId=" + agentId;
    //alert(url);
    request.open("GET", url, true);
    request.setRequestHeader("Authorization", "Basic " + window.btoa(agentCompanyCode + ":" + agentCompanyCode));
    request.send();
    return request;
}

/**table to display call logs**/

function DisplayCallLogs() {
    var calllogtable = document.getElementById('calllogtable')
    sendRequestToGetCallLoginfo();
}


/*
 * AgentDetails edit and update into DB.
 */
function sendRequestToGetCallLoginfo() {
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

            var callListArray = [];
            var callLists = [];
            response = request.responseText;
            callLists = JSON.parse(request.responseText);

            for (var list in callLists) {
                if (callLists.hasOwnProperty(list)) {
                    var callDetails = JSON.stringify(callLists[list]);
                    var array = JSON.parse(callDetails);
                    //alert(array);
                    callListArray.push(array);

                    createcalllisttable(callListArray);
                }
            }
            if (response == "SUCCESS") {
                //fetchAndDisplayAgentList('admin');
            } else if (response == "FAILURE") {
                alert("unable to get call log details");
            } else {

            }

        }
    }

    var url = "http://" + location.hostname + ":8088/calllogs";
    //alert(url);
    request.open("GET", url, true);
    request.setRequestHeader("Authorization", "Basic " + window.btoa(agentCompanyCode + ":" + agentCompanyCode));
    request.send();
    return request;
}
function createcalllisttable(callListArray) {
    //alert("table creating start");
    //var arraylist = name.split(",");
    var htmlBuilder = [];
    htmlBuilder
            .push("<table id='calllogtable' width='100%' class='notranslate commonclass tbl-listing'>");

    htmlBuilder.push('<tr>');
    //htmlBuilder.push('<th style="text-align:center;color:#FFFFFF;padding-Top:5px;padding-Left:10px;background-color:#4682b4;height:50px;width: 200px">' + "AgentId" + '</th>');
    htmlBuilder.push('<th style="width: 15%">' + "AgentName" + '</th>');
    htmlBuilder.push('<th style="width: 15%">' + "CustomerName" + '</th>');
    htmlBuilder.push('<th style="width: 15%">' + "CallStartTime" + '</th>');
    htmlBuilder.push('<th style="width: 15%">' + "CallEndTime" + '</th>');
    htmlBuilder.push('<th style="width: 15%">' + "CallDuration" + '</th>');
    htmlBuilder.push('<th style="width: 15%">' + "TerminationReason" + '</th>');
    htmlBuilder.push('</tr>');
    for (var id = 0; id < (callListArray.length); id++)
    {
        if (id % 2 == 0) {
            htmlBuilder.push('<tr id = ' + callListArray[id].AgentName + '>');
        } else {
            htmlBuilder.push('<tr id = ' + callListArray[id].AgentName + '>');
        }

        htmlBuilder.push('<td  class="firstColumn" >' + callListArray[id].AgentName + '</td>');
        htmlBuilder.push('<td class="secondColumn">' + callListArray[id].CustomerName + '</td>');
        htmlBuilder.push('<td class="secondColumn">' + callListArray[id].CallStartTime + '</td>');
        htmlBuilder.push('<td class="secondColumn">' + callListArray[id].CallEndTime + '</td>');
        htmlBuilder.push('<td class="secondColumn">' + callListArray[id].CallDuration + '</td>');
        htmlBuilder.push('<td class="secondColumn">' + callListArray[id].TerminationReason + '</td>');
        htmlBuilder.push('</tr>');
    }
    if (callListArray.length == 0) {
        htmlBuilder.push("<tr><td colspan=\"5\" >No Call records Found</td></tr>");
    }
    htmlBuilder.push("</table>");

    var html;
    html = htmlBuilder.join("");
    window.localStorage.setItem("callrecordList", html);
    populatecallRecordList();
}
// populate locally stored files list
function populatecallRecordList() {
    var html = window.localStorage.getItem("callrecordList");
    var calllisttablediv = document.getElementById('calllisttablediv');
    calllisttablediv.style.display = "block";
    var agentlisttablediv = document.getElementById('agentlisttablediv');
    agentlisttablediv.style.display = "none";
    var userlist = document.getElementById('userlist');
    userlist.style.display = "none";
    document.getElementById('calllist').style.display = "block";
    document.getElementById('calllist').innerHTML = html;
}

// populate locally stored files list
function populateAgentList() {
    var agentlist = document.getElementById('userlist');

    agentlist.style.display = "block";
    var agentlisttablediv = document.getElementById('agentlisttablediv');
    agentlisttablediv.style.display = "block";


    var calllisttablediv = document.getElementById('calllisttablediv');
    calllisttablediv.style.display = "none";
    document.getElementById('calllist').style.display = "none";
}

/**table to display call logs end**/
window.onunload = function () {
    alert('dsds');
};
function checkAuthentication() {

}
function preventBack() {
    window.history.forward();
}
setTimeout(preventBack(), 0);