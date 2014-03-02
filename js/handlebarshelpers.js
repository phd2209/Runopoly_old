Handlebars.registerHelper("formatSeconds", function (seconds) {
    var hours = (seconds > 3600 ? Math.floor(seconds / 3600) : 0)
    seconds = seconds - hours * 3600;

    var minutes = (seconds > 60 ? Math.floor(seconds / 60) : 0)
    seconds = seconds - minutes * 60;

    if (hours < 10) {
        hours = "0" + hours;
    }

    if (minutes < 10) {
        minutes = "0" + minutes;
    }

    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    return (hours != "00" ? hours + ":" : "") + (minutes != "00" ? minutes + ":" : "") + seconds;
});
Handlebars.registerHelper("formatDateTime", function (datetime) {    
    var dd = (new Date(datetime)).getDate();
    var mm = (new Date(datetime)).getMonth();
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
    return x + "<br /><b>" + dd + '</b>';
});