app.models.RunViewModel = Backbone.Model.extend({
    startTime: 0,
    stopTime: 0,
    tracking: 0,
    track_id: "",
    watch_id: null,
    startdate: null,
    tracking_data: [],
    intervalID: 0,
    maximumAge: 4 * 1000,
    timeout: 10 * 1000,
    enableHighAccuracy: true,
    selectedArea: null,
    defaults: {
        areaname: "Searching...",
        inarea: false,
        button_start_text: "start",
        totalkm: "0.0",
        areakm: "0.0",
        tracking_data: [],
        duration: 0
    },

    initialize: function () {
        console.log("RunViewModel initialized");
        _.bindAll(this, 'onSuccess')
        _.bindAll(this, 'onError')         
        this.StartGPS();
    },

    // Starts GPS watchPosition
    StartGPS: function () {
        //Starting Geolocation tracking;
        if (this.watch_id == null) {
            console.log("Starting GPS: " + this.watch_id);
            var options = { maximumAge: this.maximumAge, timeout: this.timeout, enableHighAccuracy: this.enableHighAccuracy };
            if (navigator.geolocation)
                this.watch_id = navigator.geolocation.watchPosition(this.onSuccess, this.onError, options);
        }
    },

    //Entered every few seconds with a new GPS position - calculates distance tracked
    onSuccess: function (position) {
        var self = this;

        var accuracy = 0;

        //if app.areas have not loaded then return;
        if (!app.areas.length) {
            console.log("Could not get AREAS from server" + app.areas);
            return;
        }

        this.FindNearestArea(position);

        if (this.PointInEllipse(this.selectedArea, position)) {
            position.in_area = 1;
            this.set({ inarea: true });
        }
        else {
            position.in_area = 0;
            this.set({ inarea: false });
        }

        if (this.tracking) {

            var total_km = 0;
            var total_km_in_area = 0;

            this.tracking_data.push(position);

            for (var j = 0; j < this.tracking_data.length; j++) {

                if (j == (this.tracking_data.length - 1)) {
                    break;
                }

                total_km += this.gps_distance(this.tracking_data[j].coords.latitude, this.tracking_data[j].coords.longitude, this.tracking_data[j + 1].coords.latitude, this.tracking_data[j + 1].coords.longitude);

                if (this.tracking_data[j].in_area == 1 && this.tracking_data[j + 1].in_area == 1) {
                    total_km_in_area += this.gps_distance(this.tracking_data[j].coords.latitude, this.tracking_data[j].coords.longitude, this.tracking_data[j + 1].coords.latitude, this.tracking_data[j + 1].coords.longitude)
                }
            }

            this.set({ totalkm: total_km.toFixed(1) });
            this.set({ areakm: total_km_in_area.toFixed(1) });
        }
        else {
            this.tracking_data = [];
            this.tracking_data.push(position);
        }
    },

    //Entered if GPS fails to get a read
    onError: function (error) {
        //window.alert("ERROR: " + error.code + " / " + error.message);
        //switch (error.code) {
        //    case 3:
        //        var options = { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true };
        //        if (navigator.geolocation)  navigator.geolocation.getCurrentPosition(this.onSuccess, this.onError, options);
        //        break;
        //}
    },

    //Finds the nearest area when a position is availeble
    FindNearestArea: function (position) {
        var id = 99999999;
        var minDistance = 99999999;
        var myposition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        for (var j = 0; j < app.areas.models.length; j++) {
            var area = app.areas.models[j];
            var center = new google.maps.LatLng(area.get("latitude"), area.get("longitude"));
            var distance = google.maps.geometry.spherical.computeDistanceBetween(myposition, center);

            if (distance < minDistance) {
                minDistance = distance;
                id = area.get("id");
            }
        }
        var result = $.grep(app.areas.models, function (e) { return e.id == id; });
        if (result) {
            this.selectedArea = result[0];
            this.set({ areaname: this.selectedArea.get("name") + " distance" });
        }
    },

    //Calculates distance between two points on a map
    gps_distance: function (lat1, lon1, lat2, lon2) {
        // http://www.movable-type.co.uk/scripts/latlong.html
        var R = 6371; // km
        var dLat = (lat2 - lat1) * (Math.PI / 180);
        var dLon = (lon2 - lon1) * (Math.PI / 180);
        var lat1 = lat1 * (Math.PI / 180);
        var lat2 = lat2 * (Math.PI / 180);

        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return d;
    },

    //Checks if a given position is located within a ellipse
    PointInEllipse: function (area, point) {
        var result = 0;

        // Set up "Constants"
        var m1 = 111132.92;		// latitude calculation term 1
        var m2 = -559.82;		// latitude calculation term 2
        var m3 = 1.175;			// latitude calculation term 3
        var m4 = -0.0023;		// latitude calculation term 4
        var p1 = 111412.84;		// longitude calculation term 1
        var p2 = -93.5;			// longitude calculation term 2
        var p3 = 0.118;			// longitude calculation term 3

        var latlen = m1 + (m2 * Math.cos(2 * area.get("latitude"))) + (m3 * Math.cos(4 * area.get("latitude"))) +
                (m4 * Math.cos(6 * area.get("latitude")));
        var longlen = (p1 * Math.cos(area.get("latitude"))) + (p2 * Math.cos(3 * area.get("latitude"))) +
                    (p3 * Math.cos(5 * area.get("latitude")));

        //Handle rotation of ellipse
        var cosa = Math.cos(area.get("rotation"));
        var sina = Math.sin(area.get("rotation"));

        // Normalized latitude and longitude in meters
        var dLat = (point.coords.latitude - area.get("latitude")) * latlen; //111111;
        var dLon = (point.coords.longitude - area.get("longitude")) * longlen; //63994;

        console.log("Latlen: " + dLat);
        console.log("Longlen: " + dLon);
        //Taken from the formula of the rotated ellipse
        var a = Math.pow(cosa * dLon + sina * dLat, 2);
        var b = Math.pow(sina * dLon - cosa * dLat, 2);


        //We need the  radius squred according to the formula of the ellipse
        var radius1_2 = area.get("radius1") * area.get("radius1");
        var radius2_2 = area.get("radius2") * area.get("radius2");

        //Rotated ellipse formula - less than or equal to one inside ellipse
        var ellipse = (a / radius2_2) + (b / radius1_2);
        console.log("ellipse: " + ellipse);

        if (ellipse != undefined && ellipse <= 1) result = 1;

        console.log("Result: " + result);
        return result;
    },

    //Stops GPS watchPosition
    StopGPS: function () {
        if (this.watch_id != null) {
            console.log("Stopping GPS: "+this.watch_id);
            navigator.geolocation.clearWatch(this.watch_id);
            this.watch_id = null;
        }
    },

    //Starts actual tracking of a Run
    startTracking: function () {

        this.tracking = 1;
        var self = this;

        if (this.intervalID) {
            this.tracking = 0;
            this.stopTime = Date.now();
            clearInterval(this.intervalID);
            this.intervalID = 0;
            this.set({ button_start_text: "Start" });
            return;
        }

        if (this.startTime > 0) {
            var pauseTime = Date.now() - this.stopTime;
            this.startTime = this.startTime + pauseTime;
        } else {
            this.startTime = Date.now();
        }

        this.track_id = new Date();
        this.intervalID = setInterval(function () {
            self.set({ duration: Date.now() - self.startTime });
        }, 100);
        this.set({ button_start_text: "Pause" });
    },

    // Stops tracking of a run
    stopTracking: function () {
        //Save the tracking_data in a attribute
        this.set({ "tracking_data": this.tracking_data });
        //Stop, store, reset Gps tracking;
        this.StopGPS();
        //Stop and reset clock;
        clearInterval(this.intervalID);
    },

    //Resets all important variables for the model
    reset: function () {
        this.intervalID = 0;
        this.Areas = null;
        this.tracking_data = [];
        this.startTime = 0;
        this.stopTime = 0;
        this.tracking = 0;
        this.track_id = "";
        this.watch_id = null;
        this.set({ button_start_text: "Start" });
        this.set({ tracking_data: [] })
        this.set({ areaname: "Searching..." });
        this.set({ inarea: false });
        this.set({ totalkm: "0.0" });
        this.set({ areakm: "0.0" });
        this.set({ duration: 0 });
    }
});
