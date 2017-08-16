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
function launchCustomerPage() {
    if (isMobile.Android() == "Android") {
        window.location.href = "../Customer/mobileClientHome.html";
    } else {
        window.location.href = "../Customer/ClientHome.html";
    }
}
function launchAgentPage() {
    window.location.href = "../Agent/Agentlogin.html";

}
function launchAdminPage() {
    window.location.href = "../Admin/Adminprovisioning.html";
}
function launchCustomerSignUpPage() {
    window.location.href = "../signUp/customerSignUpPage.html";
}