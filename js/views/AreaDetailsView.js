app.views.AreaDetailsView = Backbone.View.extend({

    initialize: function () {
        this.template = app.templateLoader.get('AreaDetailsView');
        //this.render();
    },

    activate: function () {
        this.myLatLng = new google.maps.LatLng(this.model.get("latitude"), this.model.get("longitude"));

        // Google Map options
        this.myOptions = {
            zoom: 13,
            center: this.myLatLng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        var id = "map_canvas";
        console.log(document.getElementById(id));
        this.map = new google.maps.Map(document.getElementById(id), this.myOptions);
    },

    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        this.activate();

        // === Ellipse ===
        var path = [];
        for (var i = 0; i < this.model.get("coords").length; i++) {
            var coords = this.model.get("coords")[i];
            path.push(new google.maps.LatLng(coords.latitude, coords.longitude));
        }

        var polygons = new google.maps.Polygon({
            path: path,
            map: this.map
        });

        polygons.setMap(this.map);
        return this;
    }
});