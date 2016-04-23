var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require("fs");

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use(bodyParser.urlencoded({ extended: true }));


app.post('/getflight', function(req, res) {
  var flight = req.body.flightcode;
  var flights = JSON.parse(fs.readFileSync("public/database/flights.json", 'utf8'));
  var flightdata;
  var hits = 0;
  for (i=0; i<flights.length; i++) {
    //console.log(flights[i]["code"]);
    if(flights[i]["code"] === flight) {
      flightdata = flights[i];
      hits += 1;
      console.log(flightdata);
      }    
    }
    if (hits==0) {
      flightdata = "not found";
    }
  res.render('flightcode', { flight: flightdata });
});

app.post('/codeArrival', function(req, res) {
  code = req.body.flightcode;
  var flights = JSON.parse(fs.readFileSync("public/database/flights.json", 'utf8'));
  var arrivals = JSON.parse(fs.readFileSync("public/database/arrivals.json", 'utf8'));
  var flightdata;
  var dates = [];
  var hits = 0; hits2 = 0;
  for (i=0; i<flights.length; i++) {
    //console.log(flights[i]["code"]);
    if(flights[i]["code"] === code) {
      flightdata = flights[i];
      hits += 1;
      console.log(flightdata);
      }    
    }
    if (hits===0) {
      flightdata = "not found";
    }
  for (j=0; j<arrivals.length; j++) {
    if (arrivals[j]["code"] === code) {
      var x = new Date(arrivals[j]["date"]);
      var y = new Date();
      y.setDate(y.getDate()-7);
      if (x -y >= 0 ) {
      hits2 += 1;
      dates.push({Date:arrivals[j]["date"], Time:arrivals[j]["time"]});
      }
    }
  }
  if (hits2 === 0) {
    dates = "No flights"
  }

  res.render('arrival', { 
    flight: flightdata,
    dates: dates
  } )
});

app.post('/codeDeparture', function(req, res) {
  code = req.body.flightcode;
  var flights = JSON.parse(fs.readFileSync("public/database/flights.json", 'utf8'));
  var departures = JSON.parse(fs.readFileSync("public/database/departures.json", 'utf8'));
  var flightdata;
  var dates = [];
  var hits = 0; hits2 = 0;
  for (i=0; i<flights.length; i++) {
    //console.log(flights[i]["code"]);
    if(flights[i]["code"] === code) {
      flightdata = flights[i];
      hits += 1;
      }    
    }
    if (hits===0) {
      flightdata = "not found";
    }
  for (j=0; j<departures.length; j++) {
    if (departures[j]["code"] === code) {
      var x = new Date(departures[j]["date"]);
      var y = new Date();
      y.setDate(y.getDate()-7);
      if (x -y >= 0 ) {
      hits2 += 1;
      dates.push({Date:departures[j]["date"], Time:departures[j]["time"]});
      }
    }
  }
  if (hits2 === 0) {
    dates = "No flights"
  }

  res.render('departure', { 
    flight: flightdata,
    dates: dates
  } )
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
