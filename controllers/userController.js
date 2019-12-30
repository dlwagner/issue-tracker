var User = require('../models/user');
var async = require('async');
var Issue = require('../models/issue');

const { body, validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator');

// Display list of users.
exports.user_list = function (req, res, next) {

    User.find()
        .sort([['last_name']])
        .exec(function (err, list_users) {
            if (err) { return next(err); }
            //Successful, so render
            res.render('user_list', { title: 'User List', user_list: list_users });
        });
};

// Display detail page for a specific user.
exports.user_detail = function (req, res, next) {
    async.parallel({
        user: function (callback) {
            User.findById(req.params.id)
                .exec(callback)
        },
        users_issues: function (callback) {
            Issue.find({ 'reporter': req.params.id }, 'title ')
                .exec(callback)
        },
    }, function (err, results) {
        if (err) { return next(err); } // Error in API usage.
        if (results.user == null) { // No results.
            var err = new Error('User not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('user_detail', { title: 'User Detail', user: results.user, user_issues: results.users_issues });
    });

};

// Display User create form on GET.
exports.user_create_get = function (req, res, next) {
    res.render('user_form', { title: 'Create User' });
};

// Handle User create on POST.
exports.user_create_post = [

    // Validate fields.
    body('first_name').isLength({ min: 1 }).trim().withMessage('First name must be specified.')
        .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
    body('last_name').isLength({ min: 1 }).trim().withMessage('Last name must be specified.')
        .isAlphanumeric().withMessage('Last name has non-alphanumeric characters.'),
    body('email').isLength({ min: 1 }).trim().withMessage('email must be specified.')
        .isAlphanumeric().withMessage('email has non-alphanumeric characters.'),

    // Sanitize fields.
    sanitizeBody('first_name').escape(),
    sanitizeBody('last_name').escape(),
    sanitizeBody('email').escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('user_form', { title: 'Create User', user: req.body, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid.
            // Create a User object with escaped and trimmed data.
            var user = new User(
                {
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    email: req.body.email
                });
            user.save(function (err) {
                if (err) { return next(err); }
                // Successful - redirect to new user record.
                res.redirect(user.url);
            });
        }
    }
];

// Display User delete form on GET.
exports.user_delete_get = function (req, res) {

    async.parallel({
        user: function (callback) {
            User.findById(req.params.id)
                .exec(callback)
        },
        users_issues: function (callback) {
            Issue.find({ 'reporter': req.params.id }, 'title ')
                .exec(callback)
        },
    }, function (err, results) {
        if (err) { return next(err); }
        if (results.user == null) { // No results.
            res.redirect('/list/users');
        }
        //Successful, so render.
        res.render('user_delete', { title: 'Delete User', user: results.user, user_issues: results.users_issues });
    });
};

// Handle User delete on POST.
exports.user_delete_post = function (req, res, next) {

    async.parallel({
        user: function (callback) {
            User.findById(req.body.userid)
                .exec(callback)
        },
        users_issues: function (callback) {
            Issue.find({ 'reporter': req.params.id }, 'title ')
                .exec(callback)
        },
    }, function (err, results) {
        if (err) { return next(err); }
        // Success
        if (results.users_issues.length > 0) {
            // User has issues. Render in same way as for GET route.
            res.render('user_delete', { title: 'Delete User', user: results.user, user_issues: results.users_issues });
            return;
        }
        else {
            // User has no issues. Delete object and redirect to the list of users.
            User.findByIdAndRemove(req.body.userid, function deleteUser(err) {
                if (err) { return next(err); }
                // Success - go to user list
                res.redirect('/list/users')
            })
        }
    });
};

// Display User update form on GET.
exports.user_update_get = function (req, res, next) {
    //res.send('NOT IMPLEMENTED: User update GET');

    User.findById(req.params.id, function (err, user) {
        if (err) { return next(err); }
        if (user == null) { // User not found.
            var err = new Error('User not found');
            err.status = 404;
            return next(err);
        }
        //Successful, so render
        res.render('user_form', { title: 'Update User', user: user });
    });
};

// Handle User update on POST.
exports.user_update_post = [
    // res.send('NOT IMPLEMENTED: User update POST');
    // Validate fields.
    body('first_name').isLength({ min: 1 }).trim().withMessage('First name must be specified.')
        .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
    body('last_name').isLength({ min: 1 }).trim().withMessage('Last name must be specified.')
        .isAlphanumeric().withMessage('Last name has non-alphanumeric characters.'),
    body('email').isLength({ min: 1 }).trim().withMessage('Email must be specified.')
        .isAlphanumeric().withMessage('Email has non-alphanumeric characters.'),

    // Sanitize fields.
    sanitizeBody('first_name').escape(),
    sanitizeBody('last_name').escape(),
    sanitizeBody('email').escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create User object with escaped and trimmed data (and the old id!)
        var user = new User(
            {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email,
                _id: req.params.id
            }
        );

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values and error messages.
            res.render('user_form', { title: 'Update User', user: user, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid. Update the record.
            User.findByIdAndUpdate(req.params.id, user, {}, function (err, theuser) {
                if (err) { return next(err); }
                // Successful - redirect to user detail page.
                res.redirect(theuser.url);
            });
        }
    }

];
