var LOGIN_URL = "http://" + location.hostname + ":8088/Login";
var LOGIN = "login";
var PASSWORD_CHANGE = "pwdchange";
var agentCompanyCode="";
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
function validateAgent() {


    var username = document.getElementById('agent').value;
    var password = document.getElementById('password').value;
    agentCompanyCode = document.getElementById('agentCompanyCode').value;
    //alert(username +" : " + password);

    if (username == "") {
        alert("please enter valid user name");
        return;
    } else if (password == "") {
        alert("password should not null");
        return;
    }
    sessionStorage.setItem("agentname", username);
    sessionStorage.setItem("agentCompanyCode", agentCompanyCode);
    var status = checkFirstTimeLogin(username, password, agentCompanyCode);



}
function onAgentLoginCancel() {
    cancelLoginPopup();
}

function checkFirstTimeLogin(username, password, agentCompanyCode) {
    firstTimeLoginsendRequest(username, password, agentCompanyCode);
}

function onAgentLoginDone() {
    cancelLoginPopup();

    var username = document.getElementById('agent').value;
    var agentoldpassword = document.getElementById('agentoldpassword').value;
    var shapassword = SHA1(agentoldpassword);
    var agentnewpassword = document.getElementById('agentnewpassword').value;
    var agentconfirmpassword = document.getElementById('agentconfirmpassword').value;
    if (agentnewpassword == agentconfirmpassword) {

        validateUsernameAndPassword(LOGIN_URL, username, shapassword, PASSWORD_CHANGE);
    } else
    {
        alert("New password AND Confirm password don`t match");
    }
}

function cancelLoginPopup() {
    var loginBox = document.getElementById('login-box');
    loginBox.style.display = "none";
    $('#mask').remove();
}
function validateAdmin() {
    var username = document.getElementById('admin').value;
    var password = document.getElementById('password').value;
    agentCompanyCode = document.getElementById('agentCompanyCode').value;
    if (username == "") {
        alert("please enter valid user name");
        return;
    } else if (password == "") {
        alert("password should not null");
        return;
    }
    //password = SHA1(password);
    if (username != null && username != "" && password != null && password != "") {
        //alert(username +" : "+password);
        var success = validateUsernameAndPassword(LOGIN_URL + "?type=admin", username, password, LOGIN);

    } else {
        alert("Agent Name / password should not null");
        return;
    }
}

function validateUsernameAndPassword(url, username, password, type) {

    sendRequest(url, username, password, type);
}

function sendRequest(url, username, password, type) {
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

            //if(response == "SUCCESS"){
            if (response != undefined || response != "") {

                if (response == "SUCCESS" && type == LOGIN) {
                    sessionStorage.setItem("adminId", agentCompanyCode);
                    sessionStorage.setItem("adminauthenticated", true);
                    window.location = "AdminHome.html";
                }
                else if (response.split(':')[0].trim() == 'agent') {
                    var agentId = response.split(':')[1];
                    sessionStorage.setItem("agentid", agentId);
                    sessionStorage.setItem("authenticated", true);
                    if (type == PASSWORD_CHANGE) {
                        changePassword();
                    }
                    else {

                        if (isMobile.Android() != "Android") {

                            window.location = "index.html";
                        } else {
                            window.location = "mobileindex.html";
                        }


                    }
                } else if (response.split(':')[0].trim() == 'changepwd') {

                    if (isMobile.Android() != "Android") {

                        window.location = "index.html";
                    } else {
                        window.location = "mobileindex.html";
                    }

                } else {
                    alert(response);
                }
            }

            //}	

        } 
        if (request.readyState == 4 && request.status == 401) {
            alert("You are not authorized to login");
        }
    }

    request.open("GET", url, true);
    request.setRequestHeader("Authorization", "Basic " + window.btoa(username + ":" + password + ":" + agentCompanyCode));
    request.send();
    return request;
}



function changePassword() {
    var agentnewpassword = document.getElementById('agentnewpassword').value;
    var sha1newpassword = SHA1(agentnewpassword);
    var username = document.getElementById('agent').value;

    sendRequest(LOGIN_URL + "?type=changepwd", username, sha1newpassword, null);
    if(agentnewpassword==""){
        
    }
    else{
        
    }
}

function showChangePasswordPopUp() {
    $(document).ready(function () {
        //$('a.login-window').click(function() {

        // Getting the variable's value from a link 
        //var loginBox = $(this).attr('href');
        loginBox = document.getElementById('login-box');
        //alert("start2");
        //Fade in the Popup and add close button
        $(loginBox).fadeIn(300);

        //Set the center alignment padding + border
        var popMargTop = ($(loginBox).height() + 24) / 2;
        var popMargLeft = ($(loginBox).width() + 24) / 2;

        $(loginBox).css({
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

        $('#mask , login-popup').fadeOut(300, function () {
            loginBox.style.display = "none";
            $('#mask').remove();
        });
        return false;
    });
}
function firstTimeLoginsendRequest(username, password, agentCompanyCode) {
    var request;
    var response;
    var loginBox;
    var url = "http://" + location.hostname + ":8088/firstTimeAuthentication";
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
            response = parseInt(request.responseText);
            //alert(response);
            //if(response == "SUCCESS"){
            if (response == 1) {
                showChangePasswordPopUp();

            } else {
                password = SHA1(password);
                if (username != null && username != "" && password != null && password != "") {

                    var success = validateUsernameAndPassword(LOGIN_URL, username, password, LOGIN);

                } else {
                    alert("Agent Name / password should not null");
                    return;
                }
            }

            //}	

        } else if (request.readyState == 4 && request.status == 401) {
            alert("You are not authorized to login");
        }
    }

    request.open("GET", url + "?agentname=" + username, true);
    request.setRequestHeader("Authorization", "Basic " + window.btoa(agentCompanyCode + ":" + agentCompanyCode));
    request.send();
    return request;
}