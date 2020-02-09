var express = require('express');
var secured = require('../lib/middleware/secured');
var index_controller = require('../controllers/indexController');
var router = express.Router();

// Get home page
// console.log("in index router");
router.get('/', secured(), index_controller.index);

// router.get('/newissue', secured(), index_controller.create_issue_get);

router.post(
  '/newissue',
  secured(),
  index_controller.create_issue_post,
);

// GET request for creating new Issue. NOTE This must come before routes that display Issue (uses id).
// router.get('/NewIssue', secured(), index_controller.new_issue);
// POST request for creating new Issue.

// GET request to delete Issue.

// POST request to delete Issue.

// GET request to update Issue.

// POST request to update Issue.

// GET request for one Issue.

module.exports = router;

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
/*
router.get('/', function (req, res, next) {
  //res.redirect('/list');
  res.redirect('/');
});
*/

/* GET home page. */
/*
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Issue Tracker Home' });
});
*/
