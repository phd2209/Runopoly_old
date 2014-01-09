window.addEventListener('load', function () {
    new FastClick(document.body);
}, false);

var runopoly = new MobileApp();
runopoly.his;
runopoly.spinner = $("#spinner");
runopoly.spinner.hide();
runopoly.slider = new PageSlider($('#container'));

runopoly.MobileRouter = Backbone.Router.extend({

    routes: {
        "": "home",
        "track": "track",
        "history": "history",
        "history/:id": "tracked"
    },

    home: function () {
        // Reset cached views
        runopoly.myHomeView = null;
        var view = new runopoly.views.Home({ template: runopoly.templateLoader.get('home') });
        runopoly.slider.slidePageFrom(view.$el, "left");
    },

    track: function () {
        runopoly.his = Backbone.history.fragment;
        var self = this;
        if (runopoly.mytrackView) {
            runopoly.slider.slidePage(runopoly.mytrackView.$el);
            return;
        }
        runopoly.mytrackView = new runopoly.views.Track({ template: runopoly.templateLoader.get('track') });
        var slide = runopoly.slider.slidePage(runopoly.mytrackView.$el).done(function () {
            runopoly.spinner.show();
        });

        var call1 = fbWrapper.batch(fb.fetches);

        $.when(slide, call1)
            .done(function (slideResp, callResp) {
                runopoly.mytrackView.model = runopoly.getWelcomeMessage();
                runopoly.mytrackView.render();
            })
            .fail(function () {
                self.showErrorPage();
            })
            .always(function () {
                runopoly.spinner.hide();
            });

    },

    history: function () {
        console.log("Entered Categories");
        var self = this;
        if (fb.myCategoriesView) {
            fb.slider.slidePage(fb.myCategoriesView.$el);
            return;
        }
        fb.myCategoriesView = new fb.views.Categories({ template: fb.templateLoader.get('categories') });
        fb.slider.slidePage(fb.myCategoriesView.$el)
        fb.myCategoriesView.model = fb.getCategories();
        fb.myCategoriesView.render();
    },

    tracked: function (id) {
        var self = this;
        var view = new fb.views.Category({ template: fb.templateLoader.get('category') });
        fb.slider.slidePage(view.$el);
        view.model = fb.getLikes(id);
        view.render();
    }
});

document.addEventListener("deviceready", function () {

    runopoly.templateLoader.load(['home', 'network', 'track', 'history', 'tracked'], function () {
        runopoly.router = new fb.MobileRouter();
        Backbone.history.start();
    });

    if (navigator.network.connection.type == Connection.NONE) {
        runopoly.slider.removeCurrentPage();
        runopoly.router.navigate("network", { trigger: true });
    }

    else {
        runopoly.router.navigate("", { trigger: true });
    }
});

$(document).on('click', '.button.back', function() {
    window.history.back();
    return false;
});

