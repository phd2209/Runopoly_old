app.views.LeadersView = Backbone.View.extend({

    initialize: function () {
        this.template = app.templateLoader.get('leadersView');
        //this.render();
    },

    render: function () {
        $(this.el).empty();
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});