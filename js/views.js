runopoly.views.Home = Backbone.View.extend({

    initialize: function () {
        var self = this;
        this.template = runopoly.templateLoader.get('home');
        this.render();
    },

    render: function () {
        console.log(this.model);
        this.$el.html(this.template(this.model));
        return this;
    }
});

runopoly.views.Run = Backbone.View.extend({

    events: {
        'click #start-pause': 'start',
        'click #stop-reset': 'stop',
    },

    initialize: function () {
        var self = this;
        this.template = runopoly.templateLoader.get('run');
        this.render();
    },

    render: function () {
        this.$el.html(this.template());
        return this;
    },
    start: function () {
        runopoly.startTracking();
    },
    stop: function () {
        runopoly.stopTracking();
    },
    pause: function () {
        runopoly.pauseTracking();
    }
});


runopoly.views.History = Backbone.View.extend({

    initialize: function (options) {
        this.options = options || {};
        this.render();
    },

    render: function () {
        this.$el.html(this.options.template(this.model));
        return this;
    }
});

runopoly.views.Tracked = Backbone.View.extend({

    initialize: function () {
        var self = this;
        this.template = runopoly.templateLoader.get('tracked');
        this.render();
    },

    render: function () {
        this.$el.html(this.template(this.model));
        return this;
    }

});

runopoly.views.Error = Backbone.View.extend({

    initialize: function () {
        this.template = _.template(runopoly.templateLoader.get('error'));
        this.render();
    },

    render: function () {
        this.$el.html(this.template());
        return this;
    },

    events: {
        'click .retry': 'retry'
    },

    retry: function () {
        Backbone.history.loadUrl(Backbone.history.fragment);
    }

});