document.getElementById("adminAddAgent").addEventListener("click", function(){
    adminHome.addNewAgent()
});
document.getElementById("addAgentbutton").addEventListener("click", addAgentInfo);
document.getElementById("updateAgentbutton").addEventListener("click", updateAgentInfo);
document.getElementById("cancelAgentButton").addEventListener("click", cancelagentPopup);
document.getElementById("closeAgentbutton").addEventListener("click", cancelagentPopup);


document.getElementById("adminAddDepartment").addEventListener("click", function(){
    adminHome.addDepartment();
});
document.getElementById("closeDepartmentbutton").addEventListener("click", function(){
    adminHome.hideDepartmentPopup()
});
document.getElementById("cancelDepartmentbutton").addEventListener("click", function(){
    adminHome.hideDepartmentPopup();
});
document.getElementById("addDepartmentbutton").addEventListener("click", function(){
    adminHome.addDepartInfo();
});

document.getElementById("adminAddNewRole").addEventListener("click", function(){
    adminHome.addNewRole();
});
document.getElementById("closeRuleBoxButton").addEventListener("click", function(){
    adminHome.hideRolePopup();
});
document.getElementById("cancelRoleButton").addEventListener("click", function(){
    adminHome.hideRolePopup();
});
document.getElementById("addRolebutton").addEventListener("click", function(){
    adminHome.addRoleInfo();
});



document.getElementById("adminLogout").addEventListener("click",adminLogout);
document.getElementById("viewAgentCallLogs").addEventListener("click",DisplayCallLogs);
document.getElementById("viewAgentLists").addEventListener("click",populateAgentList);


