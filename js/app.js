var runopoly = new MobileApp();
runopoly.his;
runopoly.spinner = $("#spinner");
runopoly.spinner.hide();
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
        if (runopoly.startTime == 0 && runopoly.watch_id != null) runopoly.StopGPS();
        if (runopoly.homeView) {
            runopoly.slider.slidePage(runopoly.homeView.$el);
            return;
        }
        runopoly.homeView = new runopoly.views.Home({ model: runopoly.CheckNetwork() });
        runopoly.slider.slidePageFrom(runopoly.homeView.$el, "left");
        runopoly.homeView.render();
    },

    run: function () {
        console.log("entered run screen");
        if (runopoly.startTime == 0 && runopoly.watch_id != null) runopoly.StopGPS();
        runopoly.StartGPS();
        if (runopoly.myrunView) {
            runopoly.slider.slidePage(runopoly.myrunView.$el);
            return;
        }
        runopoly.myrunView = new runopoly.views.Run({ model: runopoly.getAreas() });
        runopoly.slider.slidePage(runopoly.myrunView.$el);
    },

    areas: function () {
        console.log("entered areas screen");
        
        var self = this;
        var view = new runopoly.views.Areas();
        runopoly.slider.slidePage(view.$el);
        runopoly.spinner.show();

        var call = RunopolyAPI.api("http://o2n.dk/api/Areas");
        $.when(call)
            .done(function (callResp) {
                runopoly.spinner.hide();
                view.model = callResp;
                view.render();
            })
            .fail(function () {
                runopoly.spinner.hide();
                self.showErrorPage();
            })
            .always(function () {
                runopoly.spinner.hide();
            });
        
        /*
        if (runopoly.startTime == 0 && runopoly.watch_id != null) runopoly.StopGPS();

        if (runopoly.myAreasView) {
            runopoly.slider.slidePage(runopoly.myAreasView.$el);
            return;
        }
        runopoly.myAreasView = new runopoly.views.Areas({ model: runopoly.getAreas() });
        runopoly.slider.slidePage(runopoly.myAreasView.$el)
        runopoly.myAreasView.render();
        */
    },

    area: function (id) {
        console.log("entered area screen " + id);
        if (runopoly.startTime == 0 && runopoly.watch_id != null) runopoly.StopGPS();
        if (runopoly.myAreaView) {
            runopoly.myAreaView.model = runopoly.getArea(id);
            runopoly.slider.slidePage(runopoly.myAreaView.$el);
            runopoly.myAreaView.render();
            return;
        }
        runopoly.myAreaView = new runopoly.views.Area({ model: runopoly.getArea(id) });
        runopoly.slider.slidePage(runopoly.myAreaView.$el);
        runopoly.myAreaView.render();
    },

    history: function () {
        console.log("entered history screen");
        if (runopoly.startTime == 0 && runopoly.watch_id != null) runopoly.StopGPS();
        if (runopoly.myHistoryView) {
            runopoly.slider.slidePage(runopoly.myHistoryView.$el);
            return;
        }
        runopoly.myHistoryView = new runopoly.views.History({ model: runopoly.getHistory() });
        runopoly.slider.slidePage(runopoly.myHistoryView.$el)
        //runopoly.myHistoryView.render();
    },

    tracked: function (id) {
        console.log("entered tracked screen");
        if (runopoly.startTime == 0 && runopoly.watch_id != null) runopoly.StopGPS();
        var view = new runopoly.views.Tracked({ template: runopoly.templateLoader.get('tracked') });
        runopoly.slider.slidePage(view.$el);
        view.model = runopoly.getTrack(id);
        view.render();
    }
});

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
var debug = false;
if (!debug) {
    document.addEventListener("deviceready", onDeviceReady, false);
}
else {
    $(document).ready(function () {
        onDeviceReady();
    });
}