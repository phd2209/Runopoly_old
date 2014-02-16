RunopolyWebAPI = {

    Get: function (url, id) {
        var apidef = $.Deferred();
        console.log('calling Runopoly api: GET');

        $.ajax({
            type: "GET",
            url: url + "/" + id ,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                apidef.resolve(response);
            },
            error: function (xhr) {
                apidef.fail();
                //alert(xhr.responseText);
            }
        });
        return apidef;
    },

    Post: function (url, data) {
        var apidef = $.Deferred();
        console.log('calling Runopoly api: POST');

        $.ajax({
            type: "POST",
            url: url,
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                apidef.resolve(response);
            },
            error: function (xhr) {
                apidef.fail();
                //alert(xhr.responseText);
            }
        });
        return apidef;
    },

    Put: function (url, data) {
        var apidef = $.Deferred();
        console.log('calling Runopoly api: PUT');
        $.ajax({
            type: "PUT",
            url: url + "/" + data.id,
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                console.log(response);
                apidef.resolve(response);
            },
            error: function (xhr) {
                apidef.fail();
                //alert(xhr.responseText);
            }
        });
        return apidef;
    },

    Delete: function (url, id) {
        var apidef = $.Deferred();
        console.log('calling Runopoly api: DELETE');

        $.ajax({
            type: "DELETE",
            url: url + "/" + id,
            contentType: "json",
            dataType: "json",
            success: function (response) {
                apidef.resolve(response);
            },
            error: function (xhr) {
                apidef.fail();
                //alert(xhr.responseText);
            }
        });
        return apidef;
    }
}