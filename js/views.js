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
        'click #setarea a': 'selectArea'

    },

    initialize: function () {
        var self = this;
        this.template = runopoly.templateLoader.get('run');
        this.render();
    },

    render: function () {
        this.$el.html(this.template(this.model));
        return this;
    },
    start: function () {
        runopoly.startTracking();
    },
    stop: function () {
        runopoly.stopTracking();
    },
    selectArea: function (ev) {
        var ac = $(ev.target).html();
        console.log(ac);
        //runopolit.setArea(id);
    }
});

runopoly.views.History = Backbone.View.extend({

    initialize: function () {
        this.template = runopoly.templateLoader.get('history');
        this.render();
    },

    render: function () {
        this.$el.html(this.template(this.model));
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
    },

    activate: function () {
        this.myLatLng = new google.maps.LatLng(this.model[0].latitude, this.model[0].longitude);
        // Google Map options
        this.myOptions = {
            zoom: 14,
            center: this.myLatLng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        var id = 'map_canvas';
        this.map = new google.maps.Map(document.getElementById(id), this.myOptions);
    },

    render: function () {
        this.$el.html(this.template(this.model));
        this.activate();
            
        // === Ellipse ===
        var ellipse = google.maps.Polygon.Ellipse(this.myLatLng, this.model[0].radius1, this.model[0].radius2,
                                                    this.model[0].rotation, this.model[0].color, this.model[0].weight,
                                                    this.model[0].opacity1, this.model[0].fill, this.model[0].opacity2);
        
        ellipse.setMap(this.map);
        
        var position = new Object();
        position.type = "Not in ellipse";
        position.latitude = 55.707602;
        position.longitude = 12.486084;

        var position1 = new Object();
        position1.type = "In utterslev";
        position1.latitude = 55.714082;
        position1.longitude = 12.49325;

        var position2 = new Object();
        position2.type = "Not in ellipse";
        position2.latitude = 55.708267;
        position2.longitude = 12.486709;

        var position3 = new Object();
        position3.type = "In utterslev";
        position3.latitude = 55.716125;
        position3.longitude = 12.504197;

        var position4 = new Object();
        position4.type = "In utterslev";
        position4.latitude = 55.720053;
        position4.longitude = 12.519679;

        var position5 = new Object();
        position5.type = "In f�lledparken";
        position5.latitude = 55.696672;
        position5.longitude = 12.568481;

        var position6 = new Object();
        position6.type = "S�erne";
        position6.latitude = 55.685182;
        position6.longitude = 12.562337

        runopoly.PointInEllipse(this.model[0], position);
        runopoly.PointInEllipse(this.model[0], position1);
        runopoly.PointInEllipse(this.model[0], position2);
        runopoly.PointInEllipse(this.model[0], position3);
        runopoly.PointInEllipse(this.model[0], position4);
        runopoly.PointInEllipse(this.model[0], position5);
        runopoly.PointInEllipse(this.model[0], position6);
        
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