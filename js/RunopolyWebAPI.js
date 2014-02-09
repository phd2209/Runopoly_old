RunopolyAPI = {

    api: function (url) {
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
}