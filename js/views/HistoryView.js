app.views.HistoryView = Backbone.View.extend({

    initialize: function () {
        this.template = app.templateLoader.get('HistoryView');
        //this.render();
    },

    render: function () {
        $(this.el).empty();
        this.model.set(this.model.models.reverse(), { sort: false });
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});