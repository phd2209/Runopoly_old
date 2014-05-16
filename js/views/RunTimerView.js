app.views.RunTimerView = Backbone.View.extend({
    initialize: function () {
        this.template = app.templateLoader.get('runTimerView');
        this.listenTo(this.model, 'change', this.render);
        this.render();
    },
    events: {
        'click #start-pause': 'start',
        'click #stop-reset': 'stop'
    },
    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },
    start: function () {
        this.model.startTracking();
    },

    stop: function () {
        this.model.stopTracking();
        var trackedrun = new app.models.TrackedRun({
            runid: 0,
            userid: this.options.userid,
            areaid: this.model.selectedArea.get("id"),
            totalkm: this.model.get("totalkm"),
            areakm: this.model.get("areakm"),
            duration: this.model.get("duration"),
            tracking_data: this.model.get("tracking_data"),
            startdate: this.model.track_id
        });
        this.model.reset();
        //trackedrun.save(null, {
        //    success: function (model, response) {
        //        app.router.navigate('/history/' + response, { trigger: true, replace: true });
        //    },
        //    error: function () {
        //        alert('error');
        //    }
        //});
    }
});
