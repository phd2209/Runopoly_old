// Models

runopoly.models.User = Backbone.Model.extend({
    url: 'http://o2n.dk/api/Users', 
    /* url: 'http://localhost:54837/api/Users',*/
    initialize: function () {
        console.log('User has been initialized.'+ JSON.stringify(this));
        this.on('change', function () {
            console.log('- User have changed.');
        });
    },
    defaults: {
        nick_name: '',
        first_name: '',
        last_name: '',
        gender: '',
        email: ''
    },
});

runopoly.models.Area = Backbone.Model.extend({
});

runopoly.models.Run = Backbone.Model.extend({
});

runopoly.models.Owner = Backbone.Model.extend({
});

//Collections
runopoly.collections.Owners = Backbone.Collection.extend({
    model: runopoly.models.Owner,
    url: 'http://o2n.dk/api/Owners', 
    /*url: 'http://localhost:54837/api/Owners',*/
    initialize: function () {
        console.log('Owners has been initialized.');
    },
});

runopoly.collections.Areas = Backbone.Collection.extend({
    model: runopoly.models.Area,
    url: 'http://o2n.dk/api/Areas',
    /*url: 'http://localhost:54837/api/Areas',*/
    initialize: function () {
        console.log('Areas has been initialized.');
    },
});

runopoly.collections.Runs = Backbone.Collection.extend({
    model: runopoly.models.Run,
    url: 'http://o2n.dk/api/Runs', 
    /* url: 'http://localhost:54837/api/Runs',*/
    initialize: function () {
    console.log('Runs has been initialized.');
    },
});
