app.views.RegisterView = Backbone.View.extend({
    initialize: function () {
        this.template = app.templateLoader.get('Register');
    },

    events: {
        'click #create-account': 'createUser',
    },

    // create a user but not login
    createUser: function () {
        if ($("#email").val() == "" || $("#password").val() == "") {
            alert("email and password is needed!!");
            return;
        };

        app.user.set({
            username: $("#username").val(),
            pass: $("#password").val(),
            email: $("#email").val()
        });

        app.user.saveuser();
        app.user.firebase.createUser({
            email: $("#email").val(),
            password: $("#password").val()
        }, function (err) {
            if (!err) {
                console.log("user created on firebase");
                app.router.navigate("", { trigger: true });
                return;
            } else {
                alert(err.message)
                return;
           }
        });
    },

    render: function () {
        this.$el.html(this.template());
        return this;
    }
});
