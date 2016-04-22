var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home', { title: 'Airport System' });
});

router.get('/flightcode', function (req, res) {
  res.render('flightcode', { flight: ''});
});



module.exports = router;
