var MobileApp = function() {

    this.initialize = function () {
        this.track_id = "";
        this.watch_id = null;
        this.tracking_data = {};
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
    
    this.startTracking = function () {
        console.log("Started tracking");
        var total_km = 0;
        this.watch_id = navigator.geolocation.watchPosition(
            // Success
            function (position) {
                this.tracking_data.push(position);

                for (j = 0; j < this.tracking_data.length; j++) {

                    if (j == (this.tracking_data.length - 1)) {
                        break;
                    }
                    total_km += this.gps_distance(this.tracking_data[j].coords.latitude, this.tracking_data[j].coords.longitude, this.tracking_data[j + 1].coords.latitude, this.tracking_data[j + 1].coords.longitude);
                }
                total_km_rounded = total_km.toFixed(2);
                $("#distance").hhtml(total_km_rounded);
            },

            // Error
            function (error) {
                console.log(error);
            },

            // Settings
            { frequency: 3000, enableHighAccuracy: true });
    }
    
        // Tidy up the UI
        this.track_id = new Date();    
    };
    this.stopTracking = function () {
        console.log("Stopped tracking");
        // Stop tracking the user
        navigator.geolocation.clearWatch(this.watch_id);

        // Save the tracking data
        //window.localStorage.setItem(this.track_id, JSON.stringify(this.tracking_data));

        // Reset watch_id and tracking_data 
        this.watch_id = null;
        this.track_id = null;
        this.tracking_data = {};
    };
    this.pauseTracking = function () {
        // Stop tracking the user
        navigator.geolocation.clearWatch(this.watch_id);

        // Tidy up the UI
        //$("#track_id").val("").show();

        //$("#startTracking_status").html("Stopped tracking workout: <strong>" + track_id + "</strong>");
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

        return d;
    };

    this.getHistory = function () {
        var historyList = [];
        
        // Count the number of entries in localStorage and display this information to the user
        tracks_recorded = window.localStorage.length;
        console.log("tracked runs: " +tracks_recorded);

        // Iterate over all of the recorded tracks, populating the list
        for (i = 0; i < tracks_recorded; i++) {
            console.log(tracks_recorded);
            var Item = new Object();

            var key = window.localStorage.key(i);
            console.log("id: "+key);
            Item.id = key;
            var data = window.localStorage.getItem(key);
            console.log(data);
            // Turn the stringified GPS data back into a JS object            
            data = JSON.parse(data);
            console.log(data);
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
            console.log("km; " + total_km_rounded);

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
