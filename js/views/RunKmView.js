﻿app.views.RunKmView = Backbone.View.extend({
    initialize: function () {
        this.template = app.templateLoader.get('runKmView');
        this.listenTo(this.model, 'change', this.render);
        this.render();
    },
    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});
