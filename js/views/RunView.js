app.views.RunView = Backbone.View.extend({
    initialize: function (options) {
        this.template = app.templateLoader.get('runView');
        this.model.on("change:button_start_text", this.button_text_Changed, this);
        this.options = options || {};
    },
    events: {
        'click #start-pause': 'start',
        'click #stop-reset': 'stop'
    },
    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        this.$('#stop-reset').attr('disabled', true);
        this.runtimer = new app.views.RunTimerView({ el: this.$('#timer'), model: this.model });
        this.runkm = new app.views.RunKmView({ el: this.$('#km-container'), model: this.model });
        return this;
    },
    onClose : function(){
        if (this.runtimer)
            this.runtimer.close();
        if (this.runkm)
            this.runkm.close();
    },
    start: function () {
        this.model.startTracking();
    },

    stop: function () {
        this.model.stopTracking();
        var trackedrun = new app.models.TrackedRun({
            id: this.model.track_id.toISOString().substring(0,16),
            userid: this.options.userid,
            username: app.user.get('username'), 
            areaid: this.model.selectedArea.get("id"),
            areaname: this.model.selectedArea.get("name"),
            totalkm: this.model.get("totalkm"),
            areakm: this.model.get("areakm")
        });
        var details = new app.models.TrackedRun({
            id: this.model.track_id.toISOString().substring(0, 16),
            tracking_data: this.model.get("tracking_data")
        });
        app.runs.add(trackedrun);
        app.rundetails.add(details);
        this.model.reset();
        app.router.navigate("history", { trigger: true });
    },
    button_text_Changed: function () {
        var status = this.model.get('button_start_text');
        this.$('#start-pause').text(status);
        if (status === "Start")
            this.$('#stop-reset').attr('disabled', false);
        else
            this.$('#stop-reset').attr('disabled', true);
    },
});