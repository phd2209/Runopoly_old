app.Router = Backbone.Router.extend({

    routes: {
        "": "home",
        "run": "run"
    },

    initialize: function () {
        app.slider = new PageSlider($('#container'));
    },

    home: function () {
        console.log("Entered home screen");
        // Start creation of homeView
        app.homeView = new app.views.HomeView({ template: app.templateLoader.get('homeView') });
        app.slider.slidePageFrom(app.homeView.$el, "left");
    },
    run: function () {
        console.log("entered run screen");
    }
});