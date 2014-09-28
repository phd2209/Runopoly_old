app.Router = Backbone.Router.extend({

    routes: {
        "": "home",
        "run": "run",
        "areas": "areas",
        "areas/:id": "area",
        "leaders": "leaders",
        "leaders/:id": "leader"
    },

    initialize: function () {
        app.userid = 17;
        app.slider = new PageSlider($('#container'));

        /*************************************************/
        app.areas = new app.collections.Areas(areas);
        app.run = new app.models.RunViewModel();
        /*************************************************/

        /*
        app.areas = new app.collections.Areas();
        app.areas.fetch({
            data: {
                id: 0
            },
            success: function () {
                app.run = new app.models.RunViewModel();
            },
            error: function() {
                window.alert("Access to runopoly servers not acquired");
            }
        });
        */
    },

    stopGPS: function () {
        console.log("Stopping GPS");
        if (app.run.startTime == 0 && app.run.watch_id != null) app.run.StopGPS();
        return false;
    },

    keepAlive: function () {
        // prevent device from sleeping
        window.plugins.insomnia.keepAwake();
    },
    allowSleep: function() {
        // allow device to sleep
        window.plugins.insomnia.allowSleepAgain();
    },

    showView: function (view) {
        if (this.currentView)
            this.currentView.close();
        this.currentView = view;
        return view.$el;
    },

    home: function () {
        console.log("home view");

        //Change status bar
        StatusBar.show();
        StatusBar.styleLightContent();
        StatusBar.overlaysWebView(false);        
        StatusBar.backgroundColorByHexString("#282a30");

        this.allowSleep();
        var homeView = new app.views.HomeView({ template: app.templateLoader.get('homeView') });
        homeView.render();
        app.slider.slidePageFrom(homeView.$el, "page-left");
    },

    run: function () {
        console.log("run view");

        //Change status bar
        StatusBar.show();
        StatusBar.styleDefault();
        StatusBar.overlaysWebView(false);
        StatusBar.backgroundColorByHexString("#FFF");

        // Start GPS and make sure screen does not go to sleep
        this.keepAlive();
        if (app.run) app.run.StartGPS();

        var runView = new app.views.RunView({ model: app.run, userid: app.userid });
        runView.render();
        app.slider.slidePageFrom(runView.$el, "page-right")
    },

    areas: function () {
        console.log("areas view");

        StatusBar.show();
        StatusBar.styleDefault();
        StatusBar.overlaysWebView(false);
        StatusBar.backgroundColorByHexString("#FFF");

        //Stop GPS and make sure that screen can go to sleep
        //this.stopGPS();
        this.allowSleep();
        /*************************************************/
        var AreasCollection = new app.collections.Areas(areas);
        var areasView = new app.views.AreasView({ model: AreasCollection, userid: app.userid });
        areasView.render();
        app.slider.slidePageFrom(areasView.$el, "page-right")
        /*************************************************/
        //Fetch the areas from the webapi and load the view
        /*
        var areas = new app.collections.Areas();
        areas.fetch({
            data: {
                id: app.userid
            },
            success: function () {
                var areasView = new app.views.AreasView({ model: areas, userid: app.userid });
                app.slider.slidePageFrom(app.router.showView(areasView), "page-right")
            },
            error: function () {
                window.alert("Access to runopoly servers not acquired");
            }
        });
        */
    },

    area: function(id){

        console.log("area: " + id);
        var AreadetailsView = new app.views.AreaDetailsView({ model: app.areas.get(id) });
        app.slider.slidePageFrom(AreadetailsView.$el, "page-right")
        AreadetailsView.render();
    },

    leaders: function () {
        console.log("leaders view");

        StatusBar.show();
        StatusBar.styleDefault();
        StatusBar.overlaysWebView(false);
        StatusBar.backgroundColorByHexString("#FFF");


        //Stop GPS and make sure that screen can go to sleep
        //this.stopGPS();
        this.allowSleep();
        /*************************************************/
        var leaders = new app.collections.Areas(areas);
        var leadersView = new app.views.LeadersView({ model: leaders, userid: app.userid });
        leadersView.render();
        app.slider.slidePageFrom(leadersView.$el, "page-right")
        /*************************************************/
        //Fetch the areas from the webapi and load the view
        /*
        var leaders = new app.collections.Areas();
        leaders.fetch({
            data: {
                id: app.userid
            },
            success: function () {
                var leadersView = new app.views.LeadersView({ model: leaders, userid: app.userid });
                app.slider.slidePageFrom(app.router.showView(leadersView), "page-right")
            },
            error: function () {
                window.alert("Access to runopoly servers not acquired");
            }
        });
        */
    },

    leader: function (id) {
        console.log("leaders: " + id);

        //Fetch the leaders from the webapi and load the view
        var leaders = new app.collections.Leaders();
        leaders.fetch({
            data: {
                id: id
            },
            success: function () {
                console.log(app.views.LeaderDetailsView);
                var leaderdetailsView = new app.views.LeaderDetailsView({ model: leaders, userid: app.userid });
                app.slider.slidePageFrom(app.router.showView(leaderdetailsView), "page-right")
            },
            error: function () {
                window.alert("Access to runopoly servers not acquired");
            }
        });

    }
});