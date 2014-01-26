var MobileApp = function() {

    this.initialize = function () {
        this.startTime = 0;
        this.stopTime = 0;
        this.intervalID = 0;
        this.tracking = 0;
        this.track_id = "";
        this.watch_id = null;
        this.tracking_data = [];
        this.in_area_tracking_data = [];
        this.views = {};
        this.selectedArea = new Object();
        this.templateLoader = new this.TemplateLoader();
    };

    this.TemplateLoader = function () {
        this.templates = {};
        this.load = function (names, callback) {

            var deferreds = [],
                self = this;

            $.each(names, function (index, name) {
                deferreds.push($.get('tpl/' + name + '.html', function (data) {
                    self.templates[name] = Handlebars.compile(data);
                }));
            });

            $.when.apply(null, deferreds).done(callback);
        };

        // Get template by name from hash of preloaded templates
        this.get = function (name) {
            return this.templates[name];
        };
    };


    this.gps_distance = function (lat1, lon1, lat2, lon2) {
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
        console.log(a + "/" + c + "/" + d);
        return d;
    };

    this.PointInEllipse = function (area, point) {
        var result = 0;

        // Set up "Constants"
        var m1 = 111132.92;		// latitude calculation term 1
        var m2 = -559.82;		// latitude calculation term 2
        var m3 = 1.175;			// latitude calculation term 3
        var m4 = -0.0023;		// latitude calculation term 4
        var p1 = 111412.84;		// longitude calculation term 1
        var p2 = -93.5;			// longitude calculation term 2
        var p3 = 0.118;			// longitude calculation term 3

        // Calculate the length of a degree of latitude and longitude in meters at a given latitude
        latlen = m1 + (m2 * Math.cos(2 * area.latitude)) + (m3 * Math.cos(4 * area.latitude)) +
				(m4 * Math.cos(6 * area.latitude));
        longlen = (p1 * Math.cos(area.latitude)) + (p2 * Math.cos(3 * area.latitude)) +
					(p3 * Math.cos(5 * area.latitude));

        //Handle rotation of ellipse
        var cosa = Math.cos(area.rotation);
        var sina = Math.sin(area.rotation);

        // Normalized latitude and longitude in meters
        var dLat = (point.latitude - area.latitude) * latlen; //111111;
        var dLon = (point.longitude - area.longitude) * longlen; //63994;

        //Taken from the formula of the rotated ellipse
        var a = Math.pow(cosa * dLon + sina * dLat, 2);
        var b = Math.pow(sina * dLon - cosa * dLat, 2);

        //We need the  radius squred according to the formula of the ellipse
        var radius1_2 = area.radius1*area.radius1;
        var radius2_2 = area.radius2*area.radius2;

        //Rotated ellipse formula - less than or equal to one inside ellipse
        var ellipse = (a / radius2_2) + (b / radius1_2);
        if (ellipse != undefined && ellipse <= 1) result = 1;

        console.log(point.type +" result: "+result);        
        return result;
    }

    this.setArea = function (id) {
        this.selectedArea = $.grep(window.areas, function (e) { return e.id == id; });
    };

    // Used by the HomeView
    this.CheckNetwork = function () {
        var obj = new Object();
        obj.networkActive = "No Connection";
        if (navigator.network) {
            if (navigator.network.connection.type != Connection.NONE) {
                obj.networkActive = "Connection Ok";
            }
        }
        return obj;
    };

    this.StartGPS = function () {
        //Starting Geolocation tracking;
        if (this.watch_id == null) {
            var options = { maximumAge: 4000, timeout: 10000, enableHighAccuracy: true };
            if (navigator.geolocation) this.watch_id = navigator.geolocation.watchPosition(this.onSuccess, this.onError, options);
            //this.track_id = new Date();
        }

    }
    this.StopGPS = function () {
        if (this.watch_id != null) {
            console.log("Stopping GPS");
            navigator.geolocation.clearWatch(this.watch_id);
            this.watch_id = null;
        }
    }

    this.onSuccess = function (position) {
        var accuracy = 0;
        if (self.runopoly.tracking) {
            var total_km = 0;
            self.runopoly.tracking_data.push(position);
            //if (self.runopoly.PointInEllipse(self.runopoly.area, position)) self.runopoly.this.in_area_tracking_data(position);
            for (j = 0; j < self.runopoly.tracking_data.length; j++) {

                if (j == (self.runopoly.tracking_data.length - 1)) {
                    break;
                }

                total_km += self.runopoly.gps_distance(self.runopoly.tracking_data[j].coords.latitude, self.runopoly.tracking_data[j].coords.longitude, self.runopoly.tracking_data[j + 1].coords.latitude, self.runopoly.tracking_data[j + 1].coords.longitude);
            }
            total_km_rounded = total_km.toFixed(2);
            $("#distance").text(total_km_rounded);
        }

        if (position.coords.accuracy <= 50 && !accuracy) {
            $("#gps_accuracy").innerHtml("GPS OK");
            accuracy = 1;
        }
    };

    this.onError = function (error) {
        //window.alert("ERROR: " + error.code + " / " + error.message);
        //switch (error.code) {
        //    case 3:
        //        var options = { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true };
        //        if (navigator.geolocation)  navigator.geolocation.getCurrentPosition(this.onSuccess, this.onError, options);
        //        break;
        //}
    };


    this.startTracking = function () {

        this.tracking = 1;
        var self = this;

        //starting stopwatch;
        if (this.intervalID) {
            this.tracking = 0;
            this.stopTime = Date.now();
            clearInterval(this.intervalID);
            this.intervalID = 0;
            $("#start-pause").text("Start");
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
            var elapsedTime = Date.now() - self.startTime;
            $("#clock").text(self.formatTime(elapsedTime));
        }, 100);

        // Update the button text
        $("#start-pause").text("Pause");
    };

    this.stopTracking = function () {
        //Stop, store, reset Gps tracking;
        this.StopGPS();
        window.localStorage.setItem(this.track_id, JSON.stringify(this.tracking_data));        
        this.track_id = null;
        this.tracking_data = [];

        //Stop and reset clock;
        clearInterval(this.intervalID);
        this.intervalID = 0;
        this.startTime =  0;
        this.stopTime = 0;
        $("#clock").text("00:00");
        $("#start-pause").text("Start");
    };

    this.formatTime = function (timestamp) {
        var d = new Date(timestamp);

        var minutes = d.getMinutes();
        if (minutes < 10) {
            minutes = "0" + minutes;
        }

        var seconds = d.getSeconds();
        if (seconds < 10) {
            seconds = "0" + seconds;
        }

        return minutes + ":" + seconds;   
    };

    this.getAreas = function () {
        return window.areas;
    }

    this.getArea = function (id) {
        var result = $.grep(window.areas, function (e) { return e.id == id; });
        return result;
    }

    this.getHistory = function () {
        var historyList = [];
        
        // Count the number of entries in localStorage and display this information to the user
        tracks_recorded = window.localStorage.length;

        // Iterate over all of the recorded tracks, populating the list
        for (i = 0; i < tracks_recorded; i++) {
            var Item = new Object();

            var key = window.localStorage.key(i);
            Item.id = key;
            var data = window.localStorage.getItem(key);
            // Turn the stringified GPS data back into a JS object            
            data = JSON.parse(data);

            // Calculate the total distance travelled
            total_km = 0;
            for (j = 0; j < data.length; j++) {

                if (j == (data.length - 1)) {
                    break;
                }

                total_km += this.gps_distance(data[j].coords.latitude, data[j].coords.longitude, data[j + 1].coords.latitude, data[j + 1].coords.longitude);
            }
            total_km_rounded = total_km.toFixed(2);
            Item.traveled = total_km_rounded;

            // Calculate the total time taken for the track
            if (data[0] != null)
                start_time = new Date(data[0].timestamp).getTime();
            if (data[data.length - 1] != null)
                end_time = new Date(data[data.length - 1].timestamp).getTime();

            if (data[0] != null) {
                total_time_ms = end_time - start_time;
                total_time_s = total_time_ms / 1000;
                final_time_m = Math.floor(total_time_s / 60);
                final_time_s = total_time_s - (final_time_m * 60);
                Item.minutes = final_time_m;
                Item.seconds = final_time_s;
            }            
            historyList.push(Item);
        }
        return historyList;
    };

    this.alert = function(message, title) {
        if (typeof(title)==='undefined') title = "runopoly";
        if (navigator.notification) {
            navigator.notification.alert(
                message,
                null, // callback
                title,
                'OK' // Button label
            );
        } else {
            alert(title + ": " + message);
        }
    };

     this.initialize();
}
