var express = require('express');
var secured = require('../lib/middleware/secured');
var router = express.Router();

/* GET home page. */
/*
router.get('/', function (req, res) {
  res.redirect('/list');
});
*/

/*
router.get('/', secured(), function (req, res, next) {
  res.redirect('/list');
});
*/

router.get('/', function (req, res, next) {
  res.redirect('/list');
});

/* GET home page. */ /*
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Issue Tracker Home' });
});
*/
module.exports = router;
