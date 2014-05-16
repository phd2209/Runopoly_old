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
        if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
            document.addEventListener('deviceready', this.onDeviceReady, false);
        } else {
            this.onDeviceReady();
        }
    },

    onDeviceReady: function() {

        // Setup the Fastclick to get rid of the click delay
        FastClick.attach(document.body);

        //Load the templates
        app.templateLoader.load(['homeView', 'runView', 'runKmView', 'runTimerView'], function () {
            app.router = new app.Router();
            Backbone.history.start();
            Backbone.emulateHTTP = true;
            Backbone.emulateJSON = true;
        });
    }
};

$(document).ready(function () {

    $(document).on('click', '.btn-back', function () {
        window.history.back();
        return false;
    });

    app.initialize();
});

