app.Router = Backbone.Router.extend({

    routes: {
        "": "init",
        "home": "home",
        "run": "run",
        "areas": "areas",
        "areas/:id": "area",
        "leaders": "leaders",
        "leaders/:id": "leader",
        "history": "history",
        "register": "register",
        "login": "login"
    },

    initialize: function () {
        app.slider = new PageSlider($('#container'));
        app.user = new app.models.User();
    },

    stopGPS: function () {
        console.log("Stopping GPS");
        if (app.run.startTime == 0 && app.run.watch_id != null) app.run.StopGPS();
        return false;
    },

    // Phonegap extension - prevent device from sleeping
    keepAlive: function () {        
        if (window.plugins)
            window.plugins.insomnia.keepAwake();
    },

    // Phonegap extension - allow device to sleep
    allowSleep: function() {       
        if (window.plugins)
            window.plugins.insomnia.allowSleepAgain();
    },

    // Phonegap extension - Change status bar
    statusbar: function (type, color) {
        StatusBar.show();
        if (type == "styleLight")
            StatusBar.styleLightContent();
        else
            StatusBar.styleDefault();
        StatusBar.overlaysWebView(false);
        StatusBar.backgroundColorByHexString(color);
    },

    // Backbone extension - close a view properly
    showView: function (view) {
        if (this.currentView)
            this.currentView.close();
        this.currentView = view;
        return view.$el;
    },

    // Fetch initial data from firebase
    fetchdata: function (user) {
        var deferred = $.Deferred();
        app.user.set(user);
        app.user.firebase.child(user.uid).set(user);       
        app.areas = new app.collections.Areas();
        app.areas.on("sync", function () {
            app.runs = new app.collections.TrackedRuns();
            console.log(app.user);
            console.log(app.areas);
            app.runs.on("sync", function () {
                app.run = new app.models.Run();
                console.log(app.runs);
                deferred.resolve();
            });
        });
        return deferred.promise();
    },

    //Routes
    init: function () {
        console.log("init path called");
        var self = this;
        if (window.localStorage.getItem("user") == undefined || window.localStorage.getItem("user") == null || window.localStorage.getItem("user") == "") {
            this.navigate("register", {trigger: true});
            return;
        };

        app.user.getuser();
        app.user.firebase.onAuth(function (authData) {
            if (authData) {
                console.log("user allready authenticated go to home");
                self.fetchdata(authData).done(function () {
                    self.navigate("home", { trigger: true, replace: true });
                });
            }
            else {
                app.user.firebase.authWithPassword({
                    email: app.user.get("email"),
                    password: app.user.get("pass")
                }, function (error, authData) {
                    if (error) {
                        self.navigate("login", { trigger: true });
                    } else if (authData) {
                        console.log("user authenticated succesfully");
                        self.fetchdata(authData).done(function() {
                            self.navigate("home", { trigger: true, replace: true });
                        });
                    } else {
                        self.navigate("login", { trigger: true });
                    }
                });
            }
        });
    },

    home: function () {
        // app.HomeView already exists then just show it
        if (app.homeView)
        {
            this.statusbar("styleLight", "#282a30");
            this.allowSleep();
            app.homeView.render();
            app.slider.slidePageFrom(app.homeView.$el, "page-left");
        }

        this.statusbar("styleLight", "#282a30");
        this.allowSleep();
        app.homeView = new app.views.HomeView({ model: app.user });
        app.homeView.render();
        app.slider.slidePageFrom(app.homeView.$el, "page-left");
    },

    run: function () {
        console.log("run view");
        this.statusbar("styleDefault", "#FFF");
        // Start GPS and make sure screen does not go to sleep
        this.keepAlive();
        if (app.run) app.run.StartGPS();

        if(!app.rundetails){
            app.rundetails = new app.collections.RunDetails();
        }

        var runView = new app.views.RunView({ model: app.run, userid: app.user.get("uid") });
        runView.render();
        app.slider.slidePageFrom(runView.$el, "page-right")
    },

    areas: function () {
        console.log("areas view");
        this.statusbar("styleDefault", "#FFF");
        //Stop GPS and make sure that screen can go to sleep
        //this.stopGPS();
        this.allowSleep();
        var areasView = new app.views.AreasView({ model: app.areas, userid: app.user.uid });
        areasView.render();
        app.slider.slidePageFrom(areasView.$el, "page-right")
    },

    area: function(id){
        console.log("area: " + id);
        this.statusbar("styleDefault", "#FFF");
        var AreadetailsView = new app.views.AreaDetailsView({ model: app.areas.get(id) });
        app.slider.slidePageFrom(AreadetailsView.$el, "page-right")
        AreadetailsView.render();
    },

    leaders: function () {
        console.log("leaders view");
        this.statusbar("styleDefault", "#FFF");
        //Stop GPS and make sure that screen can go to sleep
        //this.stopGPS();
        var self = this;
        this.allowSleep();
        var myruns = app.runs.getMyRuns(app.user.get("uid"));
        var areaids = _.uniq(myruns.pluck("areaid"));        
        var leaders = app.runs.filter(function (run) {
            return _.contains(areaids, run.get('areaid'))
        });       
        var groups = _.groupBy(leaders, function (leader) { return leader.get('areaid')});
        var out = _.map(groups, function (g, key) {
            return {
                type: key,
                val: _.reduce(g, function (m, x) { return m + x.get('areakm'); }, 0)
            };
        });
        console.log(out);
        //var leadersView = new app.views.LeadersView({ model: leaders });
        //leadersView.render();
        //app.slider.slidePageFrom(leadersView.$el, "page-right")
    },

    leader: function (id) {
        console.log("leaders: " + id);
        this.statusbar("styleDefault", "#FFF");

        var leaders = new app.collections.Leaders();
        var leaderdetailsView = new app.views.LeaderDetailsView({ model: leaders });
        leaderdetailsView.render();
        app.slider.slidePageFrom(leaderdetailsView.$el, "page-right")
    },

    history: function () {
        this.statusbar("styleDefault", "#FFF");
        //Stop GPS and make sure that screen can go to sleep
        //this.stopGPS();
        this.allowSleep();
        var myruns = app.runs.getMyRuns(app.user.get("uid"));
        var historyView = new app.views.HistoryView({ model: myruns });
        historyView.render();
        app.slider.slidePageFrom(historyView.$el, "page-right")
    },

    login: function() {
        var loginView = new app.views.LoginView();
        loginView.render();
        app.slider.slidePageFrom(loginView.$el, "page-right")
    },

    register: function () {
        var registerView = new app.views.RegisterView();
        registerView.render();
        app.slider.slidePageFrom(registerView.$el, "page-right")
    }
});