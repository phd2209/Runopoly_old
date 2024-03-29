//Google chrome dev
// Comment out below + comment out 2 lines "if (window.plugins)" in router.js
/*var StatusBar = {
    show: function () {
        console.log("Showing Statusbar");
    },
    styleLightContent: function () { },
    styleDefault: function () { },
    overlaysWebView: function(bool) {},
    backgroundColorByHexString: function(color) {
        console.log(color);
    }
};*/

var app = {
    
    views: {},
    models: {},
    collections: {},

    // Application Constructor
    initialize: function () {
        this.templateLoader = new this.TemplateLoader();
        this.bindEvents();
    },

    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        //if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
            document.addEventListener('deviceready', this.onDeviceReady, false);
        //} else {
        //    this.onDeviceReady();
        //}
    },

    onDeviceReady: function() {

        // Setup the Fastclick to get rid of the click delay
        FastClick.attach(document.body);

        // Override default HTML alert with native dialog
        //console.log(navigator.notification)
        if (navigator.notification) {
            window.alert = function (message) {
                navigator.notification.alert(
                    message,    // message
                    null,       // callback
                    "Runopoly", // title
                    'OK'        // buttonName
                );
            };
        };

        //Get the device language so that the dictionary can be pulled
        if (navigator.globalization) {
            navigator.globalization.getPreferredLanguage(
                function (language) {
                    console.log('language: ' + language.value + '\n');
                        app.language = language.value;
                },
                function () { alert('Error getting language\n'); }
                );
        }

        //Load the templates
        app.templateLoader.load(['homeView', 'runView', 'runKmView', 'runTimerView', 'leadersView', 'leaderDetailsView', 'AreasView', 'AreaDetailsView', "HistoryView", "Register", "login"], function () {
            app.router = new app.Router();
            Backbone.history.start();
        });
    }
};


//$(document).ready(function () {
$(document).on('deviceready', function() {
    Backbone.View.prototype.close = function () {
        if (this.onClose) {
            this.onClose();
        }
        this.remove();
        this.unbind();
    };

    $(document).on('click', '.btn-back', function () {
        window.history.back();
        return false;
    });

    app.initialize();
});
