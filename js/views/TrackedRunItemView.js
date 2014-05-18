app.views.TrackedRunItemView = Backbone.View.extend({
    tagName: 'li',
    className: 'list__item list__item--tappable list__item__line-height',
    initialize: function () {
        this.template = app.templateLoader.get('trackedRunItemView');
        //this.render();
    },
    render: function () {
        console
        this.$el.html(this.template(this.model));
        return this;
    }
});