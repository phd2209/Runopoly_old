app.Router = Backbone.Router.extend({

    routes: {
        "": "home",
        "run": "run"
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

    home: function () {
        console.log("home view");
        if (app.homeView) {
            this.stopGPS();
            app.slider.slidePageFrom(app.homeView.$el, "page-left");
            app.homeView.render();
            return;
        }

        app.homeView = new app.views.HomeView({ template: app.templateLoader.get('homeView') });
        app.slider.slidePageFrom(app.homeView.$el, "page-left");
    },

    run: function () {
        console.log("run view");
        var runView = new app.views.RunView({ model: app.run, userid: app.userid });
        app.slider.slidePageFrom(runView.$el, "page-right")
    }
});