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
/*
runopoly.RunModel = Backbone.Model.extend({
    type: 'Run',
    startTime: 0,
    stopTime: 0,
    intervalID: 0,

    initialize: function () {


    },

});
*/