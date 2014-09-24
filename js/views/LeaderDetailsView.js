app.views.LeaderDetailsView = Backbone.View.extend({

    initialize: function () {
        this.template = app.templateLoader.get('leaderDetailsView');
        this.render();
    },

    render: function () {
        $(this.el).empty();
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});