app.views.TrackedRunListView = Backbone.View.extend({
    initialize: function () {
        this.template = app.templateLoader.get('trackedRunListView');
        this.render();
    },
    getDate: function (d) {
        if (d != null || d != undefined) {
            var dd = (new Date(d)).getDate();
            var yyyy = (new Date(d)).getFullYear();
            var mm = (new Date(d)).getMonth();
            switch (mm) {
                case 0:
                    x = "Jan";
                    break;
                case 1:
                    x = "Feb";
                    break;
                case 2:
                    x = "Mar";
                    break;
                case 3:
                    x = "Apr";
                    break;
                case 4:
                    x = "May";
                    break;
                case 5:
                    x = "Jun";
                    break;
                case 6:
                    x = "Jul";
                    break;
                case 7:
                    x = "Aug";
                    break;
                case 8:
                    x = "Sep";
                    break;
                case 9:
                    x = "Oct";
                    break;
                case 10:
                    x = "Nov";
                    break;
                case 11:
                    x = "Dec";
                    break;
            }
            return dd + "-" + x + "-" + yyyy;
        }
        return "00-00-0000";
    },
    render: function () {
        that = this;
        $(this.el).empty();
        this.$el.html(this.template());
        this.date = "0-0-0000";
        this.collection.each(function (model) {
            console.log(that.getDate(model.get("startdate")) + "=" + that.date) 
            if (that.getDate(model.get("startdate")) != that.date) {
                that.date = that.getDate(model.get("startdate"));
                that.$(".tracked-runs").append('<h3 class="list__header">' + that.date + '</h3>');
            }
            that.$(".tracked-runs").append(new app.views.TrackedRunItemView({ model: model.toJSON() }).render().el);
        });
        return this;
    }
});