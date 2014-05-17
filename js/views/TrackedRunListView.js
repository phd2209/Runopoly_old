app.views.TrackedRunListView = Backbone.View.extend({
    initialize: function () {
        this.template = app.templateLoader.get('trackedRunListView');
        this.render();
    },
    render: function () {
        that = this;
        this.$el.empty();
        this.$el.append(this.template());
        console.log(this);
        this.collection.each(function (model) {
            that.$(".tracked-runs").append(new app.views.TrackedRunItemView({ model: model.toJSON() }));
        });
        return this;
    }
});