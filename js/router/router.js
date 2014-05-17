app.Router = Backbone.Router.extend({

    routes: {
        "": "home",
        "run": "run",
        "tracked": "tracked"
    },

    initialize: function () {
        app.userid = 17;
        app.slider = new PageSlider($('#container'));
        app.areas = new app.collections.Areas();
        app.areas.fetch({
            data: {
                id: 0
            },
            success: function () {
                app.run = new app.models.RunViewModel();
            }
        });
    },

    stopGPS: function () {
        if (app.run.startTime == 0 && app.run.watch_id != null) app.run.StopGPS();
        return false;
    },

    showView: function (view) {
        if (this.currentView)
            this.currentView.close();
        this.currentView = view;
        return view.$el;
    },

    home: function () {
        console.log("home view");

        var homeView = new app.views.HomeView({ template: app.templateLoader.get('homeView') });
        app.slider.slidePageFrom(app.router.showView(homeView), "page-left");
    },

    run: function () {
        console.log("run view");

        var runView = new app.views.RunView({ model: app.run, userid: app.userid });
        app.slider.slidePageFrom(app.router.showView(runView), "page-right")
    },

    tracked: function () {
        console.log("tracked view");

        var trackedRuns = new app.collections.TrackedRuns();
        trackedRuns.fetch({
            data: {
                id: app.userid
            },
            success: function () {
                var trackedView = new app.views.TrackedRunListView({ collection: trackedRuns});
                app.slider.slidePageFrom(app.router.showView(trackedView), "page-right")
            }
        });
    }
});