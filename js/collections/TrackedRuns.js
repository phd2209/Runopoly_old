app.collections.TrackedRuns = Backbone.Firebase.Collection.extend({    
    firebase: new Firebase("https://flickering-heat-6861.firebaseio.com/runs"),
    model: app.models.TrackedRun,
    getMyRuns: function (userid) {
        return new Backbone.Collection(
            this.filter(function (run) {
                return run.get('userid') === userid;
        }));
    },
    comparator: function (run) {
        return -run.get('id');
    }
});