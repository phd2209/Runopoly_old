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
        "owners": "owners",
        "owner/:id": "owner",
        "history": "history",
        "history/:id": "tracked"
    },
    /*
    initialize: function() {
        this.listenTo(Backbone, 'page-animation', this.animate);
    },
    animate: function( id, href) {
        switch (id) {
            case "run": break;
            case "areas": break;
            case "winners":
                $('#run').attr("class", "run transition  ");
                $('#areas').attr("class", "areas transition  ");
                $('#winners').attr("class", "winners transition  ");
                $('#history').attr("class", "history transition  ");
                $('#header').attr("class", "header_subpage transition ");
                break;
            case "history": break;
            default: break;
        }

        $('#winners').on('webkitTransitionEnd', function (e) {
            console.log(e);
            console.log(runopoly);
            window.runopoly.router.navigate(id, { trigger: true });
        });
        return false;
    },
    */
    stopGPS: function () {
        if (runopoly.startTime == 0 && runopoly.watch_id != null) runopoly.StopGPS();
        return false;
    },    
    home: function () {
        
        console.log("Entered home screen");
        this.stopGPS();

        // HomeView has allready been generated                
        if (runopoly.homeView) {
            runopoly.slider.slidePage(runopoly.homeView.$el);
            return;
        }

        // Start creation of homeView
        runopoly.spinner.show();
        runopoly.homeView = new runopoly.views.Home({ template: runopoly.templateLoader.get('home') });
        runopoly.slider.slidePageFrom(runopoly.homeView.$el, "left");
        
        runopoly.localStorageAPI.getUser().done(function(saveduser) {
            // User exists in localStorage    
            if (saveduser != undefined || saveduser != null) {
                var user = new runopoly.models.User(JSON.parse(JSON.stringify(saveduser)));
                console.log(user);
                runopoly.homeView.model = user;
                runopoly.spinner.hide();
                runopoly.homeView.render();
            }
            else {
                //User is new post him to db and store him
                console.log("User is new post him to db and store him");
                var user = new runopoly.models.User();
                user.save(null, {
                    emulateHTTP: true,
                    wait: true,
                    success: function(model, response){
                        console.log("User created: " + model.toJSON());
                        runopoly.localStorageAPI.saveUser(model.toJSON());
                        runopoly.homeView.model = model;
                        runopoly.spinner.hide();
                        runopoly.homeView.render();
                    },
                    error: function () {
                        runopoly.spinner.hide();
                        alert("Sorry, something wrong went with the system");
                    }
                });
            }
        });
    },

    run: function () {
        console.log("entered run screen");
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
        this.stopGPS();

        // AreasView has allready been generated    
        if (runopoly.myAreasView) {
            runopoly.slider.slidePage(runopoly.myAreasView.$el);
            return;
        }

        // Start creation of AreasView
        runopoly.spinner.show();
        runopoly.myAreasView = new runopoly.views.Areas({template: runopoly.templateLoader.get('areas') });
        runopoly.slider.slidePage(runopoly.myAreasView.$el);

        runopoly.localStorageAPI.getUser().done(function(saveduser) {
            var user = new runopoly.models.User(JSON.parse(JSON.stringify(saveduser)));
            var areas = new runopoly.collections.Areas();
            areas.fetch({
                data: {
                    id: user.id
                },
                success: function (data) {
                    runopoly.spinner.hide();
                    console.log(areas);
                    runopoly.myAreasView.model = areas.toJSON();
                    runopoly.myAreasView.render();
                }
            });
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

    owners: function () {
        console.log("entered winners screen");
        this.stopGPS();

        // WinnersView has allready been generated    
        if (runopoly.myOwnersView) {
            runopoly.slider.slidePage(runopoly.myOwnersView.$el);
            return;
        }

        // Start creation of AreasView
        runopoly.spinner.show();
        runopoly.myOwnersView = new runopoly.views.Owners({ template: runopoly.templateLoader.get('owners') });
        runopoly.slider.slidePage(runopoly.myOwnersView.$el);

        runopoly.localStorageAPI.getUser().done(function(saveduser) {
            var user = new runopoly.models.User(JSON.parse(JSON.stringify(saveduser)));
            var owners = new runopoly.collections.Owners();

            owners.fetch({
                data: {
                    id: user.id
                },
                success: function (data) {
                    runopoly.spinner.hide();
                    runopoly.myOwnersView.model = owners.toJSON();
                    runopoly.myOwnersView.render();
                }
            });
        });
    },

    history: function () {
        console.log("entered history screen");
        if (runopoly.startTime == 0 && runopoly.watch_id != null) runopoly.StopGPS();
        if (runopoly.myHistoryView) {
            runopoly.slider.slidePage(runopoly.myHistoryView.$el);
            return;
        }
        //runopoly.myHistoryView = new runopoly.views.History({ model: runopoly.getHistory() });
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
    runopoly.templateLoader.load(['home', 'run', 'history', 'tracked', 'areas', 'area', 'owners'], function () {
        runopoly.router = new runopoly.MobileRouter();
        Backbone.history.start();
        Backbone.emulateHTTP = true;
        Backbone.emulateJSON = true;
        runopoly.router.navigate("", { trigger: true });        
    });
};

document.addEventListener("deviceready", onDeviceReady, false);
