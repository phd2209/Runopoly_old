runopoly.HomeModel = Backbone.Model.extend({
    type: 'Home',
    NetworkActive: null,

    initialize: function () {
        this.checkNetwork();
    },

    // get network status
    checkNetwork: function () {
        this.NetworkActive = "No Connection";
        if (navigator.network) {
            if (navigator.network.connection.type != Connection.NONE) {
                console.log(navigator.network.connection.type);
                this.NetworkActive = "Connection Ok";
            }
        }
        return this.NetworkActive;
    }
});

runopoly.HistoryModel = Backbone.Model.extend({
    type: 'History',
    historyList: null,


    initialize: function () {
        this.getHistoryItems();
    },

    // get network status
    getHistoryItems: function () {
        this.historyList = [];

        // Count the number of entries in localStorage and display this information to the user
        tracks_recorded = window.localStorage.length;
        console.log(tracks_recorded);
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
            this.historyList.push(Item);
        }
        return this.historyList;
    }
});
