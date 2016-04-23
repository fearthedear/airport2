var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home', { title: 'Airport System' });
});

router.get('/flightcode', function (req, res) {
  res.render('flightcode', { flight: ''});
});

router.get('/arrival', function (req, res) {
	res.render('arrival', { 
		flight: '',
		dates: '',
		noController: '',
		})
});

router.get('/departure', function (req, res) {
	res.render('departure', { 
		flight: '',
		dates: '',
		noController: '',
	} )
});

router.get('/arrAndDep', function (req, res) {
  res.render('arrAndDep', { redirect: ''});
});

router.get('/controllers', function (req, res) {
  res.render('controllers');
});



module.exports = router;
