app.views.LoginView = Backbone.View.extend({
    initialize: function () {
        this.template = app.templateLoader.get('login');
        app.user.getuser();
        $("#email").val() = app.user.get("email");
        $("#password").val() = app.user.get("pass");
    },

    events: {
        'click #login': 'login',
    },

    // create a user but not login
    login: function () {
        if ($("#email").val() == "" || $("#password").val() == "") {
            alert("email and password is needed!!");
            return;
        };

        app.user.firebase.authWithPassword({
            email: $("#email").val(),
            password: $("#password").val()
        }, function (error, authData) {
            if (error) {
                alert(err.message)
                return;
            } else if (authData) {
                console.log("user authenticated succesfully");
                app.router.navigate("", { trigger: true });
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
