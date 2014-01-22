var runopoly = new MobileApp();
var map = null;
//runopoly.his;
//runopoly.spinner = $("#spinner");
//runopoly.spinner.hide();
runopoly.slider = new PageSlider($('#container'));

runopoly.MobileRouter = Backbone.Router.extend({

    routes: {
        "": "home",
        "run": "run",
        "areas": "areas",
        "area/:id": "area",
        "history": "history",
        "history/:id": "tracked"
    },

    home: function () {
        console.log("Entered home screen");
        //window.localStorage.clear();
        runopoly.homeModel = new runopoly.HomeModel();
        var view = new runopoly.views.Home({ model: runopoly.homeModel });
        runopoly.slider.slidePageFrom(view.$el, "left");
    },

    run: function () {
        console.log("entered run screen");
        //runopoly.his = Backbone.history.fragment
        runopoly.StartGPS();
        if (runopoly.myrunView) {
            runopoly.slider.slidePage(runopoly.myrunView.$el);
            return;
        }
        runopoly.myrunView = new runopoly.views.Run({ template: runopoly.templateLoader.get('run') });
        runopoly.slider.slidePage(runopoly.myrunView.$el)
    },

    areas: function () {
        console.log("entered areas screen");
        var myAreasView = new runopoly.views.Areas({ template: runopoly.templateLoader.get('areas') });
        myAreasView.model = runopoly.getAreas();
        runopoly.slider.slidePage(myAreasView.$el)
        myAreasView.render();
    },

    area: function (id) {
        console.log("entered area screen " + id);
        var view = new runopoly.views.Area({ template: runopoly.templateLoader.get('area'), model: runopoly.getArea(id) });
        //view.model = runopoly.getArea(id);
        runopoly.slider.slidePage(view.$el);
        view.render();
    },

    history: function () {
        console.log("entered history screen");
        //runopoly.historymodel = new runopoly.HistoryModel();

        var myHistoryView = new runopoly.views.History({ template: runopoly.templateLoader.get('history') });
        myHistoryView.model = runopoly.getHistory();
        runopoly.slider.slidePage(myHistoryView.$el)
        myHistoryView.render();
    },

    tracked: function (id) {
        console.log("entered tracked screen");
        var view = new runopoly.views.Tracked({ template: runopoly.templateLoader.get('tracked') });
        runopoly.slider.slidePage(view.$el);
        view.model = runopoly.getTrack(id);
        view.render();
    }
});



/*
$(document).on('ready', function () {

    FastClick.attach(document.body);
    if (navigator.notification) { // Override default HTML alert with native dialog
        window.alert = function (message) {
            navigator.notification.alert(
                message,    // message
                null,       // callback
                "Workshop", // title
                'OK'        // buttonName
            );
        };
    };

    runopoly.templateLoader.load(['home', 'run', 'history', 'tracked'], function () {
        runopoly.router = new runopoly.MobileRouter();
        Backbone.history.start();
        runopoly.router.navigate("", { trigger: true });
    });
});
*/
$(document).on('click', '.button.back', function() {
    window.history.back();
    return false;
});

function onDeviceReady() {
    FastClick.attach(document.body);
    if (navigator.notification) { // Override default HTML alert with native dialog
        window.alert = function (message) {
            navigator.notification.alert(
                message,    // message
                null,       // callback
                "Workshop", // title
                'OK'        // buttonName
            );
        };
    };

    runopoly.templateLoader.load(['home', 'run', 'history', 'tracked', 'areas', 'area'], function () {
        runopoly.router = new runopoly.MobileRouter();
        Backbone.history.start();
        runopoly.router.navigate("", { trigger: true });
    });
};

document.addEventListener("deviceready", onDeviceReady, false);