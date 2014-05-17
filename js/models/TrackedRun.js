app.models.TrackedRun = Backbone.Model.extend({
    url: 'http://o2n.dk/api/Runs',
    /*url: 'http://localhost:54837/api/Runs',*/
    defaults: {
        runid: 0,
        userid: 0,
        areaid: 0,
        totalkm: "0.0",
        areakm: "0.0",
        duration: 0,
        tracking_data: [],
        startdate: null,
        creationdate: null
    }
});