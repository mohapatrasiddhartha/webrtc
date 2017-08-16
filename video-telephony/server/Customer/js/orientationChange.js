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

if (isMobile.Android() == "Android") {
    function doOnOrientationChange()
    {
        var localvidoediv = document.getElementById("webRTC_local-video");
        var clientremotevidoediv = document.getElementById("clientremotevidoediv");
        var chatwindow = document.getElementById("chatparentdiv");

        switch (window.orientation)
        {
            case -90:
            case 90:

                localvidoediv.style.width = '200px';
                localvidoediv.style.height = '110px';

                chatwindow.style.width = '200px';
                chatwindow.style.height = '110px';

                clientremotevidoediv.style.width = '250px';
                clientremotevidoediv.style.height = '160px';
                break;
            default:

                localvidoediv.style.width = '150px';
                localvidoediv.style.height = '150px';

                chatwindow.style.width = '150px';
                chatwindow.style.height = '150px';

                clientremotevidoediv.style.width = '200px';
                clientremotevidoediv.style.height = '200px';
                break;
        }
    }
    window.addEventListener('orientationchange', doOnOrientationChange);
    // Initial execution if needed
    doOnOrientationChange();

}