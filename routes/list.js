var express = require('express');
var secured = require('../lib/middleware/secured');
var router = express.Router();

// Require controller modules.
var issue_controller = require('../controllers/issueController');
var user_controller = require('../controllers/userController');


/// ISSUE ROUTES ///

// GET issues home page.
//router.get('/', secured(), issue_controller.index);
router.get('/', issue_controller.index);

// GET request for creating an issue. NOTE This must come before routes that display Issue (uses id).
router.get('/issue/create', secured(), issue_controller.issue_create_get);

// POST request for creating Issue.
router.post('/issue/create', issue_controller.issue_create_post);

// GET request to delete Issue.
router.get('/issue/:id/delete', secured(), issue_controller.issue_delete_get);

// POST request to delete Issue.
router.post('/issue/:id/delete', issue_controller.issue_delete_post);

// GET request to update Issue.
router.get('/issue/:id/update', secured(), issue_controller.issue_update_get);

// POST request to update Issue.
router.post('/issue/:id/update', issue_controller.issue_update_post);

// GET request for one Issue.
router.get('/issue/:id', secured(), issue_controller.issue_detail);

// GET request for list of all Issue items.
router.get('/issues', secured(), issue_controller.issue_list);
//router.get('/', secured(), issue_controller.issue_list);


/// USERS ROUTES ///
// GET request for creating User. NOTE This must come before route for id (i.e. display user).
router.get('/user/create', secured(), user_controller.user_create_get);

// POST request for creating User.
router.post('/user/create', user_controller.user_create_post);

// GET request to delete User.
router.get('/user/:id/delete', secured(), user_controller.user_delete_get);

// POST request to delete User.
router.post('/user/:id/delete', user_controller.user_delete_post);

// GET request to update User.
router.get('/user/:id/update', secured(), user_controller.user_update_get);

// POST request to update User.
router.post('/user/:id/update', user_controller.user_update_post);

// GET request for one user.
router.get('/user/:id', secured(), user_controller.user_detail);

// GET request for list of all users.
router.get('/users', secured(), user_controller.user_list);

module.exports = router;