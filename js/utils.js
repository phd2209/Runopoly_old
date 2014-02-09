var MobileApp = function() {

    this.initialize = function () {
        this.areas = this.createAreas();
        this.startTime = 0;
        this.stopTime = 0;
        this.intervalID = 0;
        this.tracking = 0;
        this.track_id = "";
        this.watch_id = null;
        this.tracking_data = [];
        this.views = {};
        this.selectedArea = null;
        this.templateLoader = new this.TemplateLoader();
    };


    // Template loader class - loads the html templates
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

    //Calculates distance between two points on a map
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


    //Checks if a given position is located within a ellipse
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

        latlen = m1 + (m2 * Math.cos(2 * area.latitude)) + (m3 * Math.cos(4 * area.latitude)) +
				(m4 * Math.cos(6 * area.latitude));
        longlen = (p1 * Math.cos(area.latitude)) + (p2 * Math.cos(3 * area.latitude)) +
					(p3 * Math.cos(5 * area.latitude));

        //Handle rotation of ellipse
        var cosa = Math.cos(area.rotation);
        var sina = Math.sin(area.rotation);

        // Normalized latitude and longitude in meters
        var dLat = (point.coords.latitude - area.latitude) * latlen; //111111;
        var dLon = (point.coords.longitude - area.longitude) * longlen; //63994;

        console.log("Latlen: " + dLat);
        console.log("Longlen: " + dLon);
        //Taken from the formula of the rotated ellipse
        var a = Math.pow(cosa * dLon + sina * dLat, 2);
        var b = Math.pow(sina * dLon - cosa * dLat, 2);


        //We need the  radius squred according to the formula of the ellipse
        var radius1_2 = area.radius1*area.radius1;
        var radius2_2 = area.radius2*area.radius2;

        //Rotated ellipse formula - less than or equal to one inside ellipse
        var ellipse = (a / radius2_2) + (b / radius1_2);
        console.log("ellipse: " + ellipse);

        if (ellipse != undefined && ellipse <= 1) result = 1;

        console.log("Result: "+result);        
        return result;
    }

    //****************************************************************************************
    //*** Area functions
    //****************************************************************************************

    //Create all areas defines them as objects representing ellipses on a map - should be drawn from db later on
    this.createAreas = function () {
        var areas = [];

        var area1 = new Object({
            "id": "1", "name": "Utterslevmose", "longitude": 12.505524, "latitude": 55.716161, "radius1": 1750,
            "radius2": 450, "rotation": 68, "color": "#000000", "weight": 2, "opacity1": 1, "fill": "#ffff00", "opacity2": 0.3,
            "owner": "Bill Gates", "level": 7
        });

        var area2 = new Object({
            "id": "2", "name": "Søerne kbh.", "longitude": 12.565987, "latitude": 55.686029, "radius1": 1600,
            "radius2": 270, "rotation": 30, "color": "#000000", "weight": 2, "opacity1": 1, "fill": "#ffff00", "opacity2": 0.3,
            "owner": "Dolph Lundgren", "level": 10
        });

        var area3 = new Object({
            "id": "3", "name": "Fælledparken", "longitude": 12.568481, "latitude": 55.701744, "radius1": 650,
            "radius2": 440, "rotation": 0, "color": "#000000", "weight": 2, "opacity1": 1, "fill": "#ffff00", "opacity2": 0.3,
            "owner": "Rockay", "level": 9
        });

        var area4 = new Object({
            "id": "4", "name": "Kobbelvænget", "longitude": 12.480413, "latitude": 55.715321, "radius1": 200,
            "radius2": 100, "rotation": 0, "color": "#000000", "weight": 2, "opacity1": 1, "fill": "#ffff00", "opacity2": 0.3,
            "owner": "Toni Awwad", "level": 3
        });

        var area5 = new Object({
            "id": "5", "name": "Lundbeck", "longitude": 12.517067, "latitude": 55.657684, "radius1": 100,
            "radius2": 50, "rotation": 0, "color": "#000000", "weight": 2, "opacity1": 1, "fill": "#ffff00", "opacity2": 0.3,
            "owner": "CEO Lundbeck", "level": 3
        });

        areas.push(area1);
        areas.push(area2);
        areas.push(area3);
        areas.push(area4);
        areas.push(area5);
        return areas;
    }

    // Returns all areas created
    this.getAreas = function () {
        return this.areas;
    }

    // Finds nearest area given the current position
    this.FindNearestArea = function (position) {

        var id = 99999999;
        var minDistance = 99999999;
        var myposition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        for (j = 0; j < this.areas.length; j++) {
            var center = new google.maps.LatLng(this.areas[j].latitude, this.areas[j].longitude);
            var distance = google.maps.geometry.spherical.computeDistanceBetween(myposition, center);

            if (distance < minDistance) {
                minDistance = distance;
                id = this.areas[j].id;
            }
        }
        this.selectedArea = this.getArea(id);
    }

    //gets an area based on its id
    this.getArea = function (id) {
        var result = $.grep(this.areas, function (e) { return e.id == id; });
        return result;
    }

    //****************************************************************************************
    //*** GPS functions
    //****************************************************************************************

    // Starts GPS watchPosition
    this.StartGPS = function () {
        //Starting Geolocation tracking;
        if (this.watch_id == null) {
            var options = { maximumAge: 4000, timeout: 10000, enableHighAccuracy: true };
            if (navigator.geolocation) this.watch_id = navigator.geolocation.watchPosition(this.onSuccess, this.onError, options);
            //this.track_id = new Date();
        }

    }

    //Stops GPS watchPosition
    this.StopGPS = function () {
        if (this.watch_id != null) {
            console.log("Stopping GPS");
            navigator.geolocation.clearWatch(this.watch_id);
            this.watch_id = null;
        }
    }

    //Entered every few seconds with a new GPS position - calculates distance tracked
    this.onSuccess = function (position) {

        var accuracy = 0;
        self.runopoly.FindNearestArea(position);
        if (self.runopoly.PointInEllipse(self.runopoly.selectedArea[0], position)) position.in_area = 1;
        else position.in_area = 0;

        if (self.runopoly.selectedArea) {
            $("#area").text(self.runopoly.selectedArea[0].name);
            $("#distance_area").text(self.runopoly.kmSeparator(self.runopoly.gps_distance(self.runopoly.selectedArea[0].latitude, self.runopoly.selectedArea[0].longitude, position.coords.latitude, position.coords.longitude).toFixed(3), 'km', 'm'));

            if (position.in_area == 0) {
                $("#distance_area_text").text("Distance to Area");
            }
            else {
                $("#distance_area_text").text("You are in the Area. Start running!!");
            }

        }

        if (self.runopoly.tracking) {

            position.in_area = 0;
            var total_km = 0;
            var total_km_in_area = 0;

            if (self.runopoly.PointInEllipse(self.runopoly.selectedArea[0], position)) position.in_area = 1;

            self.runopoly.tracking_data.push(position);
            
            for (j = 0; j < self.runopoly.tracking_data.length; j++) {

                if (j == (self.runopoly.tracking_data.length - 1)) {
                    break;
                }

                total_km += self.runopoly.gps_distance(self.runopoly.tracking_data[j].coords.latitude, self.runopoly.tracking_data[j].coords.longitude, self.runopoly.tracking_data[j + 1].coords.latitude, self.runopoly.tracking_data[j + 1].coords.longitude);

                if (self.runopoly.tracking_data[j].in_area == 1 && self.runopoly.tracking_data[j + 1].in_area == 1)
                    total_km_in_area += self.runopoly.gps_distance(self.runopoly.tracking_data[j].coords.latitude, self.runopoly.tracking_data[j].coords.longitude, self.runopoly.tracking_data[j + 1].coords.latitude, self.runopoly.tracking_data[j + 1].coords.longitude)
            }

            total_km_rounded = total_km.toFixed(3);
            total_km_in_area_rounded = total_km_in_area.toFixed(3);

            console.log(total_km_rounded);
            console.log(total_km_in_area_rounded);

            $("#distance").text(self.runopoly.kmSeparator(total_km_rounded,'km','m'));
            $("#distance_area").text(self.runopoly.kmSeparator(total_km_in_area_rounded, 'km', 'm'));
            $("#distance_area_text").text("Distance in Area");
        }

        console.log("accuracy: "+position.coords.accuracy);
        if (position.coords.accuracy <= 75 && accuracy == 0) {
            $("#gps_accuracy").html("GPS OK");
            accuracy = 1;
        } 
    };

    this.kmSeparator = function (n, km, m) {
        var sRegExp = new RegExp("\\."); //('(-?[0-9]+)([0-9]{3})'),
        sValue = n + '';
        if (km === undefined) { km = 'km'; }
        if (m === undefined) { m = 'm'; }
        while (sRegExp.test(sValue)) {
            sValue = sValue.replace(sRegExp, km);
        }
        return sValue + m;
    };


    //Entered if GPS fails to get a read
    this.onError = function (error) {
        //window.alert("ERROR: " + error.code + " / " + error.message);
        //switch (error.code) {
        //    case 3:
        //        var options = { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true };
        //        if (navigator.geolocation)  navigator.geolocation.getCurrentPosition(this.onSuccess, this.onError, options);
        //        break;
        //}
    };

    //****************************************************************************************
    //*** Functions used by views
    //****************************************************************************************


    // Checks network acccess - used by the HomeView
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

    // Starts tracking of a run - used by RunView
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

    // Stops tracking of a run - used by RunView
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
        $("#clock").text("0:00:00");
        $("#start-pause").text("Start");
    };

    // Formats time used - used by RunView
    this.formatTime = function (timestamp) {
        var d = new Date(timestamp);

        var hours = (d.getHours()-1);

        var minutes = d.getMinutes();
        if (minutes < 10) {
            minutes = "0" + minutes;
        }

        var seconds = d.getSeconds();
        if (seconds < 10) {
            seconds = "0" + seconds;
        }

        return hours + ":" + minutes + ":" + seconds;   
    };

    //Creates the history of runs - used by HistoryView
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

    //Used to diplay alerts - works both on phone and in browser
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
