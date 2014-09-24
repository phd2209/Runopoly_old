app.views.RunView = Backbone.View.extend({
    initialize: function (options) {
        this.template = app.templateLoader.get('runView');
        this.model.on("change:button_start_text", this.button_text_Changed, this);
        this.options = options || {};
        //this.render();
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
            runid: 0,
            userid: this.options.userid,
            areaid: this.model.selectedArea.get("id"),
            totalkm: this.model.get("totalkm"),
            areakm: this.model.get("areakm"),
            duration: this.model.get("duration"),
            tracking_data: this.model.get("tracking_data"),
            startdate: this.model.track_id,
            creationdate: Date.now()
        });
        this.model.reset();        
        //trackedrun.save(null, {
        //    success: function (model, response) {
        //        app.router.navigate("", true);
                //app.router.navigate('/history/' + response, { trigger: true, replace: true });
       //     },
       //     error: function () {
       //         alert('could not save tracked run');
       //         app.router.navigate("", true);
       //     }
        //});
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