runopoly.views.Home = Backbone.View.extend({

    initialize: function () {
        this.template = runopoly.templateLoader.get('home');
        this.render();
    },

    render: function () {
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
    }
});

runopoly.views.History = Backbone.View.extend({

    initialize: function () {
        this.template = runopoly.templateLoader.get('history');
        this.render();
    },

    render: function () {
        this.$el.html(this.template());
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

runopoly.views.Areas = Backbone.View.extend({

    initialize: function () {
        this.template = runopoly.templateLoader.get('areas');
        this.render();
    },

    render: function () {
        this.$el.html(this.template(this.model));
        return this;
    }
});

runopoly.views.Area = Backbone.View.extend({

    initialize: function () {
        this.template = runopoly.templateLoader.get('area');
        this.render();
    },

    render: function () {
        this.$el.html(this.template(this.model));

        var myLatLng = new google.maps.LatLng(this.model[0].coords[0].latitude, this.model[0].coords[0].longitude);
        // Google Map options
        var myOptions = {
            zoom: 15,
            center: myLatLng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        
        // Create the Google Map, set options
        window.map = new google.maps.Map(document.getElementById('map_canvas'), myOptions);
        
        var trackCoords = [];

        // Add each GPS entry to an array
        for (i = 0; i < this.model[0].coords; i++) {
            console.log(this.model[0].coords[i]);
            trackCoords.push(new google.maps.LatLng(this.model[0].coords[i].latitude, this.model[0].coords[i].longitude));
        }

        // Plot the GPS entries as a line on the Google Map
        var trackPath = new google.maps.Polyline({
            path: trackCoords,
            strokeColor: "#FF0000",
            strokeOpacity: 1.0,
            strokeWeight: 2
        });

        // Apply the line to the map
        trackPath.setMap(window.map);
        
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