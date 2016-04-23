$(document).ready(function () {

    $.getJSON("database/flights.json", function(result){
      for (var i = 0; i < result.length; i++) {
        var tr = $('<tr/>');
        tr.append("<td>" + result[i].code + "</td>");
        tr.append("<td>" + result[i].departure + "</td>");
        tr.append("<td>" + result[i].arrival + "</td>");
        tr.append("<td>" + result[i].carrier + "</td>");
        tr.append("<td>" + result[i].DaysOfWeek + "</td>");
        $('#allflights').append(tr);
    }
});

    $.getJSON("database/arrivals.json", function(result){
      for (var i = 0; i < result.length; i++) {
        var tr = $('<tr/>');
        tr.append("<td>" + result[i].code + "</td>");
        tr.append("<td>" + result[i].departure + "</td>");
        tr.append("<td>" + result[i].arrival + "</td>");
        tr.append("<td>" + result[i].carrier + "</td>");
        tr.append("<td>" + result[i].DaysOfWeek + "</td>");
        tr.append("<td>" + result[i].lane + "</td>");
        tr.append("<td>" + result[i].date + "</td>");
        tr.append("<td>" + result[i].controllerCode + "</td>");
        tr.append("<td>" + result[i].controller + "</td>");
        $('#arrivals').append(tr);
    }
});

    $.getJSON("database/departures.json", function(result){
      for (var i = 0; i < result.length; i++) {
        var tr = $('<tr/>');
        tr.append("<td>" + result[i].code + "</td>");
        tr.append("<td>" + result[i].departure + "</td>");
        tr.append("<td>" + result[i].arrival + "</td>");
        tr.append("<td>" + result[i].carrier + "</td>");
        tr.append("<td>" + result[i].DaysOfWeek + "</td>");
        tr.append("<td>" + result[i].lane + "</td>");
        tr.append("<td>" + result[i].date + "</td>");
        tr.append("<td>" + result[i].controllerCode + "</td>");
        tr.append("<td>" + result[i].controller + "</td>");
        $('#departures').append(tr);
    }
});



    $(".button-collapse").sideNav();
});



