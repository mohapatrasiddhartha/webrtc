describe("Test Class webRTCVideoPlugin loading js and CSS URLS ", function () {
    it("To check the customer id of the website", function () {
        expect(webRTCVideoPlugin.siteadminID).toEqual(120);
    });
    it("To check webRTC_customerVideoPlugin div is loaded or not", function () {
        var length = $('#webRTC_customerVideoPlugin').length;
        expect(length).toEqual(1);
    });
    it("To check that the CSS URLS is loaded or not", function () {
        var hostingUURL = webRTCVideoPlugin.webRTCHostingURL;
        function UrlExists(url) {
            url = hostingUURL + url;
            var http = new XMLHttpRequest();
            http.open('HEAD', url, false);
            http.send();
            return http.status != 404;
        }
        for (var i = 0; i < webRTCVideoPlugin.webRTC_videoplugin_CSS.length; i++) {
            var status = UrlExists(webRTCVideoPlugin.webRTC_videoplugin_CSS[i]);
            expect(status).toEqual(true);
        }

    });
    it("To check that the JS URLS is loaded or not", function () {
        var hostingUURL = webRTCVideoPlugin.webRTCHostingURL;
        function UrlExists(url) {
            url = hostingUURL + url;
            var http = new XMLHttpRequest();
            http.open('HEAD', url, false);
            http.send();
            return http.status != 404;
        }
        for (var i = 0; i < webRTCVideoPlugin.webRTC_videoplugin_JS.length; i++) {
            var status = UrlExists(webRTCVideoPlugin.webRTC_videoplugin_JS[i]);
            expect(status).toEqual(true);
        }
    });
});

describe("Test Class webRTCVideoPlugin loading HTML elements and its attributes", function () {
    it("To check that Plugin Main is present or not", function () {
        var length = $('#webRTC_video-plugin').length;
        expect(length).toEqual(1);
    });
    it("To check that local video div is present or not", function () {
        var length = $('#webRTC_localVideo').length;
        expect(length).toEqual(1);
    });
    it("To check that remote video div is present or not", function () {
        var length = $('#webRTC_remoteVideo').length;
        expect(length).toEqual(1);
    });
    it("To check that Local video is muted or not", function () {
        var muteProperty = $('#webRTC_localVideo').attr('muted');
        expect(muteProperty).toEqual("muted");
    });
    it("To check that start call button present or not", function () {
        var length = $('#webRTC_custStartCallButton').length;
        expect(length).toEqual(1);
    });
    it("To check that Chat Div present or not", function () {
        var length = $('#webRTC_chatparentdiv').length;
        expect(length).toEqual(1);
    });
    it("To check that Chat Div has none property or not", function () {
        var displayProperty = $('#webRTC_chatdiv').css('display');
        expect(displayProperty).toEqual('none');
    });
});