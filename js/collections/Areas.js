app.collections.Areas = Backbone.Firebase.Collection.extend({
    model: app.models.Area,
    firebase: new Firebase("https://flickering-heat-6861.firebaseio.com/areas")
});
