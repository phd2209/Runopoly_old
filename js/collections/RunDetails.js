app.collections.RunDetails = Backbone.Firebase.Collection.extend({
    model: app.models.TrackedRun,
    firebase: new Firebase("https://flickering-heat-6861.firebaseio.com/rundetails")
});
