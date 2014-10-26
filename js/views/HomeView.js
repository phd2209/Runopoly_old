app.views.HomeView = Backbone.View.extend({
    initialize: function () {
        this.template = app.templateLoader.get('homeView');
    },
    render: function () {
        this.$el.html(this.template());
        var winH = $(window).height()-49;
        var itemHeight = Math.round(winH / 4);

        $('li.list__item').each(function () {
            $(this).height(itemHeight+'px');
        });
        return this;
    }
});
