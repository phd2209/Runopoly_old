var runopoly = new MobileApp();
runopoly.his;
runopoly.spinner = $("#spinner");
runopoly.spinner.hide();
runopoly.slider = new PageSlider($('#container'));

runopoly.MobileRouter = Backbone.Router.extend({

    routes: {
        "": "home",
        "register": "register",
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

        //var self = this;
        //runopoly.homeView = new runopoly.views.Home({ model: runopoly.CheckNetwork() });
        //runopoly.slider.slidePageFrom(runopoly.homeView.$el, "left");
        //runopoly.spinner.show();
        /*
        var call = RunopolyAPI.Post("http://o2n.dk/api/Users");
        $.when(call)
            .done(function (callResp) {
                runopoly.spinner.hide();
                runopoly.homeView.model = callResp;
                runopoly.homeView.render();
            })
            .fail(function () {
                runopoly.spinner.hide();
                self.showErrorPage();
            })
            .always(function () {
                runopoly.spinner.hide();
            });
        */
        runopoly.homeView = new runopoly.views.Home({ model: runopoly.CheckNetwork() });
        runopoly.slider.slidePageFrom(runopoly.homeView.$el, "left");
        runopoly.homeView.render();
    },

    register: function () {
        console.log("Entered register screen");
        if (runopoly.startTime == 0 && runopoly.watch_id != null) runopoly.StopGPS();
        runopoly.registerView = new runopoly.views.Register({});
        runopoly.slider.slidePageFrom(runopoly.registerView.$el, "left");
        runopoly.registerView.render();
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

        var call = RunopolyAPI.getJson("http://o2n.dk/api/Areas");
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

    // Setup the fastclick to get rid of the delay
    FastClick.attach(document.body);

    // Push body if iOS version gt 7
    //if (parseFloat(window.device.version) >= 7.0) {
    //    document.body.style.marginTop = "20px";
    //}
    
    // Override default HTML alert with native dialog
    if (navigator.notification) { 
        window.alert = function (message) {
            navigator.notification.alert(
                message,    // message
                null,       // callback
                "Workshop", // title
                'OK'        // buttonName
            );
        };
    };


    if (navigator.globalization) {
        navigator.globalization.getPreferredLanguage(
            function (language) {
                alert('language: ' + language.value + '\n');
                runopoly.language = language.value;
            },
            function () { alert('Error getting language\n'); }
          );
    }

    //Load the templates
    runopoly.templateLoader.load(['register', 'home', 'run', 'history', 'tracked', 'areas', 'area'], function () {
        runopoly.router = new runopoly.MobileRouter();
        Backbone.history.start();

        var user = localStorage["user"];
        if (user != undefined || user != null) {
            //runopoly.router.navigate("", { trigger: true });
            runopoly.router.navigate("register", { trigger: true });
        }
        else {
            runopoly.router.navigate("", { trigger: true });
            //runopoly.router.navigate("register", { trigger: true });
        }
    });
};

document.addEventListener("deviceready", onDeviceReady, false);
