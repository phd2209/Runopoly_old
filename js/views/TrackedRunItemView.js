app.views.TrackedRunItemView = Backbone.View.extend({
    tagName: 'li',
    className: 'tracked-run',
    initialize: function () {
        this.template = app.templateLoader.get('trackedRunItemView');
        this.render();
    },
    render: function () {
        this.$el.html(this.template({ item: this.model }));
        return this;
    }
});