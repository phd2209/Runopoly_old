app.models.User = Backbone.Model.extend({
    firebase: new Firebase("https://flickering-heat-6861.firebaseio.com/users"),
    initialize: function () {
        console.log("user initialized");
    },
    saveuser: function () {
        console.log("user saved");
        window.localStorage["user"] = JSON.stringify(this);
    },
    getuser: function () {
        console.log("user load");
        this.set(JSON.parse(window.localStorage.getItem("user")));
    }
});