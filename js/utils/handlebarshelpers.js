// Formats time used - used by RunView
Handlebars.registerHelper("formatTime", function (timestamp) {
    if (!timestamp) return "0:00:00";
    var d = new Date(timestamp);
    var hours = (d.getHours()-1);

    var minutes = d.getMinutes();
    if (minutes < 10) {
        minutes = "0" + minutes;
    }

    var seconds = d.getSeconds();
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    return hours + ":" + minutes + ":" + seconds;   
});
Handlebars.registerHelper("formatSeconds", function (seconds) {
    var hours = (seconds > 3600 ? Math.floor(seconds / 3600) : 0)
    seconds = seconds - hours * 3600;

    var minutes = (seconds > 60 ? Math.floor(seconds / 60) : 0)
    seconds = seconds - minutes * 60;

    if (minutes < 10) {
        minutes = "0" + minutes;
    }

    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    return hours + ":" + minutes + ":" + seconds;
});
Handlebars.registerHelper("formatDateTime", function (datetime) {    
    var dd = (new Date(datetime)).getDate();
    var mm = (new Date(datetime)).getMonth();
    var yy = (new Date(datetime)).getFullYear();
    switch (mm) {
        case 0:
            x = "Jan";
            break;
        case 1:
            x = "Feb";
            break;
        case 2:
            x = "Mar";
            break;
        case 3:
            x = "Apr";
            break;
        case 4:
            x = "May";
            break;
        case 5:
            x = "Jun";
            break;
        case 6:
            x = "Jul";
            break;
        case 7:
            x = "Aug";
            break;
        case 8:
            x = "Sep";
            break;
        case 9:
            x = "Oct";
            break;
        case 10:
            x = "Nov";
            break;
        case 11:
            x = "Dec";
            break;
    }
    return dd + "-" + x + "-" + yy;
});
Handlebars.registerHelper('if_eq', function (a, b, opts) {
    if (a == b) // Or === depending on your needs
        return opts.fn(this);
    else
        return opts.inverse(this);
});
Handlebars.registerHelper("GetTimeFromDateTime", function (datetime) {
    var hours = (new Date(datetime)).getUTCHours();
    var minutes = (new Date(datetime)).getUTCMinutes();
    return hours + ":" + minutes;
});