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
    $(".button-collapse").sideNav();
});



