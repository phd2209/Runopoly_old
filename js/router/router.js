app.Router = Backbone.Router.extend({

    routes: {
        "": "home",
        "run": "run"
    },

    initialize: function () {
        app.slider = new PageSlider($('#container'));
        app.areas = new app.collections.Areas();
        app.areas.fetch({
            data: {
                id: 0
            },
            success: function () {
                app.run = new app.models.RunViewModel();
                console.log(app.run);
            }
        });
    },

    home: function () {
        console.log(app.areas);
        console.log("Entered home screen");
        app.homeView = new app.views.HomeView({ template: app.templateLoader.get('homeView') });
        app.slider.slidePageFrom(app.homeView.$el, "left");
    },

    run: function () {
        console.log("entered run screen");
        var runView = new app.views.RunView(app.run);
        app.slider.slidePageFrom(runView.$el, "page-right")
    }
});