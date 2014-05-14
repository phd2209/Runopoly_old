app.views.RunView = Backbone.View.extend({
    initialize: function () {
        this.template = app.templateLoader.get('runView');
        this.render();
    },
    render: function () {
        this.$el.html(this.template(this.model));
        return this;
    }
});