runopoly.views.Home = Backbone.View.extend({
    //events: {
    //    'click li': 'transition'
    //},

    initialize: function () {
        console.log("Home View Initialized");
        this.template = runopoly.templateLoader.get('home');
    },

    render: function () {
        console.log("Home View Rendered");
        this.$el.html(this.template(this.model));
        var winH = $(window).height();
        //var totalH = winH - 27;
        var itemHeight = Math.round(winH / 4);
        $('#homemenu li').each(function () {            
            $(this).height(itemHeight+'px');
        });
        if (winH > 480) $('#menu li .button-header').css("margin-bottom", 30 + "px");
        return this;
    }
});

runopoly.views.Run = Backbone.View.extend({

    events: {
        'click #start-pause': 'start',
        'click #stop-reset': 'stop',
        "click #selectarea a": "selectarea",
    },

    initialize: function () {
        var self = this;
        this.template = runopoly.templateLoader.get('run');
        this.render();
    },

    render: function () {
        this.$el.html(this.template(this.model));
        $('button').prop('disabled', true);
        return this;
    },
    start: function () {
        runopoly.startTracking();
    },
    stop: function () {
        runopoly.stopTracking();
    },
    selectarea: function (ev) {
        var name = $(ev.target).html();
        if (runopoly.setArea(name) != null) $('button').prop('disabled', false);
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
        console.log("Areas View Initialized");
        this.template = runopoly.templateLoader.get('areas');
        this.render();
    },

    render: function () {
        console.log("Areas View Rendered");
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
            zoom: 13,
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
        position5.type = "In fælledparken";
        position5.latitude = 55.696672;
        position5.longitude = 12.568481;

        var position6 = new Object();
        position6.type = "Søerne";
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



runopoly.views.Owners = Backbone.View.extend({

    initialize: function () {
        this.template = runopoly.templateLoader.get('owners');
        this.render();
    },

    render: function () {
        $(this.el).empty();
        this.$el.html(this.template(this.model));
        var pies = $('figure.pie');
        $.each(pies, function () {
            var degree = $(this).attr('data-pie');
            degree = Math.round(degree * 3.6);
            $(this).children('.slice').children('.inner').css({
                '-webkit-transform': 'rotate(' + degree + 'deg)',
                '-moz-transform': 'rotate(' + degree + 'deg)',
                '-o-transform': 'rotate(' + degree + 'deg)',
                'transform': 'rotate(' + degree + 'deg)',
            });
        });
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