var localStorageAPI = function () {

    this.initialize = function() {
        var deferred = $.Deferred();
        deferred.resolve();
        return deferred.promise();
    }

    this.saveUser = function (user) {
        var deferred = $.Deferred()
        window.localStorage["user"] = JSON.stringify(user);
        deferred.resolve(user);
        return deferred.promise();
    }

    this.getUser = function () {
        var deferred = $.Deferred();
        results = JSON.parse(window.localStorage.getItem("user"));
        deferred.resolve(results);
        return deferred.promise();
    }
}
