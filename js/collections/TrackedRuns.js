app.collections.TrackedRuns = Backbone.Collection.extend({
    model: app.models.TrackedRun,
    url: 'http://o2n.dk/api/Runs',
    /*url: 'http://localhost:54837/api/Runs'*/
});



