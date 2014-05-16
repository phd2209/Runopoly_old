app.views.RunView = Backbone.View.extend({
    initialize: function () {
        this.template = app.templateLoader.get('runView');
        this.render();
    },
    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        var runtimer = new app.views.RunTimerView({ el: this.$('#timer'), model: this.model });
        var runkm = new app.views.RunKmView({ el: this.$('#km-container'), model: this.model });
        return this;
    }
});