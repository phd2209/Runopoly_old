app.views.HomeView = Backbone.View.extend({
    initialize: function () {
        this.template = app.templateLoader.get('homeView');
        //this.render();
    },
    render: function () {
        this.$el.html(this.template());
        //var winH = $(window).height();
        //var totalH = winH - 27;
        //var itemHeight = Math.round(winH / 4);
        //$('.list__container li').each(function () {
        //    $(this).height(itemHeight+'px');
        //});
        //if (winH > 480) $('#menu li .button-header').css("margin-bottom", 30 + "px");
        return this;
    }
});
