window.addEventListener('load', function () {
    new FastClick(document.body);
}, false);

var tracking_data = [];
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
        runopoly.slider.slidePage(runopoly.mytrackView.$el)
    },

    history: function () {
        var self = this;
        var myHistoryView = new runopoly.views.History({ template: runopoly.templateLoader.get('history') });
        runopoly.slider.slidePage(myHistoryView.$el)
        myHistoryView.model = runopoly.getHistory();
        myHistoryView.render();
    },

    tracked: function (id) {
        var self = this;
        var view = new runopoly.views.Tracked({ template: runopoly.templateLoader.get('tracked') });
        runopoly.slider.slidePage(view.$el);
        view.model = runopoly.getTrack(id);
        view.render();
    }
});

$(document).on('deviceready', function () {
    
    runopoly.templateLoader.load(['home', 'track', 'history', 'tracked'], function () {
        runopoly.router = new runopoly.MobileRouter();
        Backbone.history.start();
        runopoly.router.navigate("", { trigger: true });
    });
    
/*
    if (navigator.network.connection.type == Connection.NONE) {
        runopoly.slider.removeCurrentPage();
        runopoly.router.navigate("network", { trigger: true });
    }

    else {
*/
    
    /*}*/
});
document.addEventListener('deviceready', function () {
    if (navigator.notification) { // Override default HTML alert with native dialog
        window.alert = function (message) {
            navigator.notification.alert(
                message,    // message
                null,       // callback
                "Workshop", // title
                'OK'        // buttonName
            );
        };
    }
}, false);

$(document).on('click', '.button.back', function() {
    window.history.back();
    return false;
});

