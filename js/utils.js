var MobileApp = function() {

    this.initialize = function () {
        this.startTime = 0;
        this.stopTime = 0;
        this.intervalID = 0;
        this.tracking = 0;
        this.track_id = "";
        this.watch_id = null;
        this.tracking_data = [];
        this.views = {};
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

    this.startTracking = function () {
        this.tracking = 1;
    }

    this.StartGPS = function () {
        //Starting Geolocation tracking;
        if (this.watch_id == null) {
            var options = { maximumAge: 4000, timeout: 10000, enableHighAccuracy: true };
            if (navigator.geolocation) this.watch_id = navigator.geolocation.watchPosition(this.onSuccess, this.onError, options);
            //this.track_id = new Date();
        }

    }

    this.onSuccess = function (position) {
        if (self.runopoly.tracking) {
            var total_km = 0;
            self.runopoly.tracking_data.push(position);

            for (j = 0; j < self.runopoly.tracking_data.length; j++) {

                if (j == (self.runopoly.tracking_data.length - 1)) {
                    break;
                }

                total_km += self.runopoly.gps_distance(self.runopoly.tracking_data[j].coords.latitude, self.runopoly.tracking_data[j].coords.longitude, self.runopoly.tracking_data[j + 1].coords.latitude, self.runopoly.tracking_data[j + 1].coords.longitude);
            }
            total_km_rounded = total_km.toFixed(2);
            $("#distance").text(total_km_rounded);
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
        //window.localStorage.clear();

        //Starting Geolocation tracking;
        //if (this.watch_id == null) {
        //    var options = { maximumAge: 4000, timeout: 10000, enableHighAccuracy: true };
        //    if (navigator.geolocation) this.watch_id = navigator.geolocation.watchPosition(this.onSuccess, this.onError, options);
        //}

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
        navigator.geolocation.clearWatch(this.watch_id);
        window.localStorage.setItem(this.track_id, JSON.stringify(this.tracking_data));
        this.watch_id = null;
        this.track_id = null;
        this.tracking_data = [];

        //Stop and reset clock;
        clearInterval(this.intervalID);
        this.intervalID = 0;
        this.startTime = this.intervalID ? Date.now() : 0;
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
