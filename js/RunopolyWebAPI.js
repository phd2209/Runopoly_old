RunopolyAPI = {

    getJson: function (url) {
        var apidef = $.Deferred();
        try {
            console.log('calling Runopoly api');
            $.getJSON(url, function (response) {
                apidef.resolve(response);
            });
        }
        catch (e) {
            apidef.fail();
        }
        return apidef;
    },
    Post: function (url, object) {
        var apidef = $.Deferred();
        try {
            console.log('calling Runopoly api');
            $.ajax({
                type: "POST",
                url: url,
                data: data
            });
        }
        catch (e) {
            apidef.fail();
        }
        return apidef;
    },
    Put: function (url, object) {
        var apidef = $.Deferred();
        try {
            console.log('calling Runopoly api');
            $.ajax({
                type: "PUT",
                url: url,
                data: data
            });
        }
        catch (e) {
            apidef.fail();
        }
        return apidef;
    }
}