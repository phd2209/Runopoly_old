app.views.TrackedRunListView = Backbone.View.extend({
    initialize: function () {
        this.template = app.templateLoader.get('trackedRunListView');
        this.render();
    },
    render: function () {
        that = this;
        $(this.el).empty();
        this.$el.html(this.template());        
        this.collection.each(function (model) {
            console.log(model);
            that.$(".tracked-runs").append(new app.views.TrackedRunItemView({ model: model.toJSON() }).render().el);
        });
        return this;
    }
});