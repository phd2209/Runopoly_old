app.models.RunViewModel = Backbone.Model.extend({
    startTime: 0,
    stopTime: 0,
    tracking: 0,
    track_id: "",
    watch_id: null,
    startdate: null,
    tracking_data: [],
    intervalID: 0,
    maximumAge: 3000,
    timeout: 10000,
    enableHighAccuracy: true,
    selectedArea: null,
    defaults: {
        areaname: "Searching...",
        inarea: false,
        button_start_text: "start",
        totalkm: "0.0",
        areakm: "0.0",
        arearank: "0",
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
        console.log("ERROR: " + error.code + " / " + error.message);
        window.alert("ERROR: " + error.code + " / " + error.message);
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
            this.set({ areaname: this.selectedArea.get("name")});
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

    sign: function(x) { 
        return x > 0 ? 1 : x < 0 ? -1 : 0; 
    },

    PointInEllipse: function (area, point) {

        console.log(point.coords.latitude);
        console.log(point.coords.longitude);

        var xvec = _.pluck(area.get("coords"), "latitude");
        var yvec = _.pluck(area.get("coords"), "longitude");

        var pnt = [];
        pnt.push(point.coords.latitude);
        pnt.push(point.coords.longitude);

        var Nx = xvec.length;
        var Ny = yvec.length;

        if (Nx != Ny){
            //Dummy return code 
            P = 999;
            console.log("Input vectors MUST have same dimension(s)");
            return P;
        }

        xvec.push(xvec[0]); //Adding the first X-coordinate sample as the last sample 
        yvec.push(yvec[0]); //Adding the first Y-coordinate sample as the last sample         
        
        /////////////////////////////////////////////////////////////////////
        //WHILE loop that loops through the complete set of polygon points,//
        //and then some ...                                                //
        /////////////////////////////////////////////////////////////////////
        var k = 0, N = 0, V = 0, S = 0, E = 0, P = 0, korig = 0;  

        while (k < Nx+1) {
            k++; 
              
            ///////////////////////////////////
            // CASE: CROSSING OF EITHER AXIS //         
            ///////////////////////////////////
            if (((xvec[k] < pnt[0] && pnt[0] < xvec[k - 1]) || (xvec[k - 1] < pnt[0] && pnt[0] < xvec[k])) || ((yvec[k] < pnt[1]) && pnt[1] < yvec[k - 1]) || (yvec[k - 1] < pnt[1] && pnt[1] < yvec[k])) {

                if ((xvec[k] != xvec[k - 1]) && (yvec[k] != yvec[k - 1])) {
                    a = (yvec[k] - yvec[k - 1]) / (xvec[k] - xvec[k - 1]);
                    b = yvec[k] - a * (xvec[k] - pnt[0]);
                    x = (pnt[1] - b) / a + pnt[0];

                    //Conditions for assigning corners
                    if ((yvec[k] < b && b < yvec[k - 1]) || (yvec[k - 1] < b && b < yvec[k])) {
                        if (b > pnt[1]) {
                            N++;
                        }
                        else if (b < pnt[1]) {
                            S++;
                        }
                    }
                }

                if ((xvec[k] < x && x < xvec[k - 1]) || (xvec[k - 1] < x && x < xvec[k])) {
                    if (x > pnt[0]) {
                        E++;
                    }
                    else if (x < pnt[0]) {
                        V++;
                    }
                }
                else if (xvec[k] == xvec[k - 1]) {
                    if (xvec[k] > pnt[0]) {
                        E++;
                    }
                    else if (xvec[k] < pnt[0]) {
                        V++;
                    }
                }
                else if (yvec[k] == yvec[k - 1]) {
                    if (yvec[k] > pnt[1]) {
                        N++;
                    }
                    else if (yvec[k] < pnt[1]) {
                        S++;
                    }
                }
            }
            ///////////////////////////////////////////////
            // CASE: Vertex is intersected by point axis //         
            ///////////////////////////////////////////////
            if ((xvec[k] == pnt[0]) || (yvec[k] == pnt[1]) && (!(xvec[k] == pnt[0] && yvec[k] == pnt[1]))) 
            {                
                korig = 0;
                if (k > Nx) {
                    korig = k;
                    k = k - Nx;
                }

                var m1 = 1, m2 = 1, L1 = 0, L2 = 0, L3 = 0, L4 = 0;
                                
                while ((L1 == 0 && L2 == 0) && (L3 == 0 && L4 == 0)) {                        
                    if ((k-m1) < 1) { 
                        m1 = (k-Nx);
                    }                        
                    if ((k+m2) > Nx) { 
                        m2 = (1-k);
                    }                        
                    if (xvec[k] == pnt[0]) { 
                        if ((xvec[k-m1] > pnt[0] || xvec[k-m1] < pnt[0]) && (L1 == 0)) {
                            L1 = this.sign(xvec[k-m1]-pnt[0]);
                        }
                        else {
                            m1++;
                        }
                        if ((xvec[k+m2] > pnt[0] || xvec[k+m2] < pnt[0]) && (L2 == 0)) {
                            L2 = this.sign(xvec[k+m2]-pnt[0]);
                        }
                        else {
                            m2++;
                        }
                    }
                        
                    if (yvec[k] == pnt[1]) {
                        if ((yvec[k-m1] > pnt[1] || yvec[k-m1] < pnt[1]) && (L3 == 0)) {
                            L3 = this.sign(yvec[k-m1]-pnt[1]);
                        }
                        else {
                            m1++;
                        }
                        if ((yvec[k+m2] > pnt[1] || yvec[k+m2] < pnt[1]) && (L4 == 0)) {
                            L4 = sign(yvec[k+m2]-pnt[1]);
                        }
                        else {
                            m2++;
                        }
                    }
                }
                
                if ((L1 + L2) == 0) {
                    if (yvec[k] > pnt[1]) {
                        N++;
                    }
                    else if (yvec[k] < pnt[1]) {
                        S++; 
                    }
                }
                
                if ((L3 + L4) == 0) {  
                    if (xvec[k] > pnt[0]) {
                        E++;
                    }
                    else if (xvec[k] < pnt[0]) {
                        V++; 
                    }
                }
                
                if (korig != 0) {
                    k = korig;
                }
            }
            ////////////////////////////////////////////
            // CASE: Point is a vertex in the polygon //         
            ////////////////////////////////////////////
            if (xvec[k] == pnt[0] && yvec[k] == pnt[1]) {
                P = 4;
            }
        }  

        //////////////////////////////////////////////////
        //Investigating the content of the corner vector//
        //////////////////////////////////////////////////  

        var cvs = (V % 2) + (E % 2) + (S % 2) + (N % 2);
        console.log("CVS: " + cvs);

        if ((cvs > 0) || (P == 4)) {
            P = 1;
        }
        else {
            P = 0;
        }

        console.log(P);
        return P;

        /*
        var Garea = new google.maps.Polygon(area.coords);
        var Gpoint = new google.maps.LatLng(point.coords.latitude, point.coords.longitude);
        console.log("containsLocation = " + google.maps.geometry.poly.containsLocation(Gpoint, Garea));
        console.log("isLocationOnEgde = " + google.maps.geometry.poly.isLocationOnEdge(Gpoint, Garea));
        return google.maps.geometry.poly.containsLocation(Gpoint, Garea);
        */
    },

    //Checks if a given position is located within a ellipse
    PointInEllipse_old: function (area, point) {
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
        console.log("Resting RunViewModel");
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
        this.set({ arearank: "0" });
        this.set({ duration: 0 });
    }
});
