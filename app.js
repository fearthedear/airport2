var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require("fs");
var jsonfile = require("jsonfile");

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
    dates: dates,
    noController: '',
    flightExists: ''
  } )
});

var dates = [];

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
    dates: dates,
    noController: '',
    flightExists: ''
  } )
});

app.post('/postFlight', function(req, res) {
  var code = req.body.code;
  var flights = JSON.parse(fs.readFileSync("public/database/flights.json", 'utf8'));
  var flight;
  for (i=0; i<flights.length; i++) {
    if (flights[i]["code"]==code) {
      flight = flights[i];
    }
  }

  //fetching controller name
  var controllers = JSON.parse(fs.readFileSync("public/database/controllers.json", 'utf8'));
  var controllerCode = req.body.controllerCode;
  var controllerName;
  chits = 0;
  for (j=0; j<controllers.length; j++) {
    if (controllers[j]["code"] == controllerCode) {
      controllerName = controllers[j]["name"];
      chits += 1;
    }
  }
  if (chits == 0) {
    res.render('arrival', {
      flight: flight,
      dates: dates,
      noController: 'yes',
      flightExists: ''
    })
  }

  else {

    var arrivals = JSON.parse(fs.readFileSync("public/database/arrivals.json", 'utf8'));

    var date = req.body.date;
    var time = req.body.time;
    var lane = req.body.lane;

  //creating new object to be appended to arrivals.json
  var object = flight;
  object.lane = lane;
  object.date = date;
  object.time = time;
  object.controllerCode = controllerCode;
  object.controller = controllerName;

  //checking if flight exists in database
  for (l=0; l<arrivals.length; l++) {
    if (JSON.stringify(object) === JSON.stringify(arrivals[l])) {
      res.render('arrival', {
        flight: flight,
        dates: dates,
        noController: '',
        flightExists: 'yes'
      })
    }
  }

  var arrivalFile = "public/database/arrivals.json"
  //appending object to arrivals.json
  arrivals.push(object);
  //writing to disk
  jsonfile.writeFile(arrivalFile, arrivals, function (err) {
    console.error(err)
  })
  res.render('arrAndDep', { redirect: "yes"});
}
});

app.post('/postFlightD', function(req, res) {
  var code = req.body.code;
  var flights = JSON.parse(fs.readFileSync("public/database/flights.json", 'utf8'));
  var flight;

  for (i=0; i<flights.length; i++) {
    if (flights[i]["code"]==code) {
      flight = flights[i];
    }
  }

  //fetching controller name
  chits = 0;
  var controllers = JSON.parse(fs.readFileSync("public/database/controllers.json", 'utf8'));
  var controllerCode = req.body.controllerCode;
  var controllerName;
  for (j=0; j<controllers.length; j++) {
    if (controllers[j]["code"] == controllerCode) {
      controllerName = controllers[j]["name"];
      chits += 1;
    }
  }

  if (chits == 0) {
    res.render('arrival', {
      flight: flight,
      dates: dates,
      noController: 'yes',
      flightExists: ''
    })
  }

  else {
    var departures = JSON.parse(fs.readFileSync("public/database/departures.json", 'utf8'));

    var date = req.body.date;
    var time = req.body.time;
    var lane = req.body.lane;

  //creating new object to be appended to departures.json
  var object = flight;
  object.lane = lane;
  object.date = date;
  object.time = time;
  object.controllerCode = controllerCode;
  object.controller = controllerName;

    //checking if flight exists in database
    for (l=0; l<departures.length; l++) {
      if (JSON.stringify(object) === JSON.stringify(departures[l])) {
        res.render('departure', {
          flight: flight,
          dates: dates,
          noController: '',
          flightExists: 'yes'
        })
      }
    }

    var departFile = "public/database/departures.json"
  //appending object to departueres.json
  departures.push(object);
  //writing to disk
  jsonfile.writeFile(departFile, departures, function (err) {
    console.error(err)
  });
  res.render('arrAndDep', {redirect: "yes"} );
}
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
