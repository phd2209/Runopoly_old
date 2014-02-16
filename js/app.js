var runopoly = new MobileApp();

runopoly.his;
runopoly.spinner = $("#spinner");
runopoly.spinner.hide();
runopoly.slider = new PageSlider($('#container'));
runopoly.url = "http://o2n.dk/api/";
//runopoly.url = "http://localhost:54837/api/";

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
        var self = this
        if (runopoly.startTime == 0 && runopoly.watch_id != null) runopoly.StopGPS();

        // HomeView has allready been generated                
        if (runopoly.homeView) {
            runopoly.slider.slidePage(runopoly.homeView.$el);
            return;
        }

        // Start creation of homeView
        runopoly.spinner.show();
        runopoly.homeView = new runopoly.views.Home({template: runopoly.templateLoader.get('home') });
        runopoly.slider.slidePageFrom(runopoly.homeView.$el, "left");

        // User exists in localStorage
        var saveduser = localStorage["user"];
        if (saveduser != undefined || saveduser != null) {
            var user = JSON.parse(saveduser);
            console.log("User Allready exists with : " + user);
            var call = RunopolyWebAPI.Put(runopoly.url + "Users", user);

            $.when(call)
                .done(function (callResp) {
                    console.log(callResp);
                    runopoly.spinner.hide();
                    runopoly.homeView.model = JSON.parse(JSON.stringify(callResp));
                    runopoly.homeView.render();
                })
                .fail(function () {
                    runopoly.spinner.hide();
                    self.showErrorPage();
                })
                .always(function () {
                    runopoly.spinner.hide();
            });
        }
        
        //User is new post him to db and store him
        else {
            console.log("User is new - save him to db");

            var user = {
                "nick_name": "New Runner",
                "first_name": "",
                "last_name": "",
                "gender": "",
                "email": ""
            };

            var call = RunopolyWebAPI.Post(runopoly.url + "Users", user);

            $.when(call)
                .done(function (callResp) {
                    console.log(callResp);
                    runopoly.spinner.hide();
                    localStorage["user"] = JSON.stringify(callResp);
                    runopoly.homeView.model = JSON.parse(JSON.stringify(callResp));
                    runopoly.slider.slidePageFrom(runopoly.homeView.$el, "left");
                    runopoly.homeView.render();
                })
                .fail(function () {
                    runopoly.spinner.hide();
                    self.showErrorPage();
                })
                .always(function () {
                    runopoly.spinner.hide();
                });
        }
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
        var self = this
        if (runopoly.startTime == 0 && runopoly.watch_id != null) runopoly.StopGPS();

        // AreasView has allready been generated    
        if (runopoly.myAreasView) {
            runopoly.slider.slidePage(runopoly.myAreasView.$el);
            return;
        }

        // Start creation of AreasView
        runopoly.spinner.show();
        runopoly.myAreasView = new runopoly.views.Areas({template: runopoly.templateLoader.get('areas') });
        runopoly.slider.slidePage(runopoly.myAreasView.$el)
        var user = runopoly.homeView.model;
        console.log(user);

        var call = RunopolyWebAPI.Get(runopoly.url + "Areas", user.id);

        $.when(call)
            .done(function (callResp) {
                console.log(callResp);
                runopoly.spinner.hide();
                runopoly.myAreasView.model = JSON.parse(JSON.stringify(callResp));
                runopoly.myAreasView.render();
            })
            .fail(function () {
                runopoly.spinner.hide();
                self.showErrorPage();
            })
            .always(function () {
                runopoly.spinner.hide();
            });
    },

    area: function (id) {
        console.log("entered area screen " + id);
        var self = this
        if (runopoly.startTime == 0 && runopoly.watch_id != null) runopoly.StopGPS();

        // AreaView has allready been generated
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
    //    aleret(window.device);
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

    //Get the device language so that the dictionary can be pulled
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
    runopoly.templateLoader.load(['home', 'run', 'history', 'tracked', 'areas', 'area'], function () {
        runopoly.router = new runopoly.MobileRouter();
        Backbone.history.start();
        runopoly.router.navigate("", { trigger: true });        
    });
};

document.addEventListener("deviceready", onDeviceReady, false);
