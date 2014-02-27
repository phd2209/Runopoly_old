var webAPI = function () {
        
    var APIurl = "http://localhost:54837/api/"; //production http://o2n.dk/api/
    this.initialize = function () {        
        //No initialization needed
        var deferred = $.Deferred();
        deferred.resolve();
        return deferred.promise();
    }

    this.Get = function (url, id) {
        return $.ajax({
            type: "GET",
            url: APIurl + url + "/" + id,
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        }); 
    }

    this.Post = function (url, data) {
        return $.ajax({
            type: "POST",
            url: APIurl + url,
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        });
    }

    this.Put = function (url, id, data) {
        return $.ajax({
            type: "POST",
            url: APIurl + url,
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        });
    }

    this.Delete = function(url, id) {
        return $.ajax({
            type: "POST",
            url: APIurl + url,
            data: JSON.stringify(id),
            contentType: "json",
            dataType: "json"
        });    
    }

}