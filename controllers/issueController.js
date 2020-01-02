var Issue = require('../models/issue');
var User = require('../models/user');

const { body, validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator');

var async = require('async');

// Display Issue Tracker home page with issue and user counts.
exports.index = function (req, res) {

    async.parallel({
        issue_count: function (callback) {
            Issue.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
        },
        user_count: function (callback) {
            User.countDocuments({}, callback);
        }
    }, function (err, results) {
        res.render('index', { title: 'Welcome to Issue Tracker', error: err, data: results });
    });
};

// Display list of all issues.
exports.issue_list = function (req, res, next) {

    Issue.find({}, 'title description created reporter')
        .populate('reporter')
        .exec(function (err, list_issues) {
            if (err) { return next(err) };
            //Successful, so render
            res.render('issue_list', { title: 'Issue List', issue_list: list_issues });
        });
};

// Display detail page for a specific issue.
exports.issue_detail = function (req, res, next) {

    Issue.findById(req.params.id)
        .populate('reporter')
        .exec(function (err, issueinstance) {
            if (err) { return next(err); }
            if (issueinstance == null) { // No results.
                var err = new Error('issue instance not found');
                err.status = 404;
                return next(err);
            }
            // Successful, so render.
            res.render('issue_detail', { title: 'Issue: ' + issueinstance.reporter.name, issueinstance: issueinstance });
        });

};

// Display issue create form on GET.
exports.issue_create_get = function (req, res, next) {

    // Get list of all users for drop down box on issue create form.
    User.find()
        .exec(function (err, reporters_list) {
            if (err) { return next(err); }
            res.render('issue_form', { title: 'Create Issue', reporters: reporters_list });
        });
};

// Handle issue create on POST.
exports.issue_create_post = [

    // Validate fields.
    body('title', 'Title must not be empty.').isLength({ min: 1 }).trim(),
    body('description', 'Description must not be empty.').isLength({ min: 1 }).trim(),
    body('created', 'Invalid created date').optional({ checkFalsy: true }).isISO8601(),
    body('reporter', 'Reporter must not be empty.').isLength({ min: 1 }).trim(),

    // Sanitize fields (using wildcard).
    //sanitizeBody('*').escape(),
    // Sanitize fields.
    sanitizeBody('title').escape(),
    sanitizeBody('desription').escape(),
    sanitizeBody('created').toDate(),
    sanitizeBody('reporter').escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create an Issue object with escaped and trimmed data.
        var issue = new Issue(
            {
                title: req.body.title,
                description: req.body.description,
                created: req.body.created,
                reporter: req.body.reporter
            });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.
            User.find()
                .exec(function (err, reporters_list) {
                    if (err) { return next(err); }
                    res.render('issue_form', { title: 'Create Issue', reporters: reporters_list, errors: errors.array() });
                });
            return;
        }
        else {
            // Data from form is valid. Save issue.
            issue.save(function (err) {
                if (err) { return next(err); }
                //successful - redirect to new book record.
                res.redirect(issue.url);
            });
        }
    }
];

// Display issue delete form on GET.
exports.issue_delete_get = function (req, res, next) {
    //res.send('NOT IMPLEMENTED: Issue delete GET');

    Issue.findById(req.params.id)
        .populate('reporter')
        .exec(function (err, del_issue) {
            if (err) { return next(err); }
            // Successfull, so render
            res.render('issue_delete', { title: 'Delete Issue', issue: del_issue });
        });
};

// Handle issue delete on POST.
exports.issue_delete_post = function (req, res, next) {
    //res.send('NOT IMPLEMENTED: Issue delete POST');

    Issue.findByIdAndRemove(req.body.issueid, function deleteIssue(err) {
        if (err) { return next(err); }
        // Success - go to issue list
        res.redirect('/list/issues')
    })
};

// Display issue update form on GET.
exports.issue_update_get = function (req, res, next) {
    // res.send('NOT IMPLEMENTED: Issue update GET');

    async.parallel({
        issue: function (callback) {
            Issue.findById(req.params.id).populate('reporter').exec(callback);
        },
        users: function (callback) {
            User.find(callback);
        },
    }, function (err, results) {
        if (err) { return next(err); }
        if (results.issue == null) { // No results.
            var err = new Error('Issue not found');
            err.status = 404;
            return next(err);
        }
        // Success, so render.
        res.render('issue_form', { title: 'Update Issue', reporters: results.users, issue: results.issue });
    });
};

// Handle issue update on POST.
exports.issue_update_post = [

    // Validate fields.
    body('title', 'Title must not be empty.').isLength({ min: 1 }).trim(),
    body('description', 'Description must not be empty.').isLength({ min: 1 }).trim(),
    body('created', 'Invalid created date').optional({ checkFalsy: true }).isISO8601(),
    body('reporter', 'Reporter must not be empty.').isLength({ min: 1 }).trim(),

    // Sanitize fields (using wildcard).
    //sanitizeBody('*').escape(),
    // Sanitize fields.
    sanitizeBody('title').escape(),
    sanitizeBody('desription').escape(),
    sanitizeBody('created').toDate(),
    sanitizeBody('reporter').escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create an Issue object with escaped and trimmed data.
        var issue = new Issue(
            {
                title: req.body.title,
                description: req.body.description,
                created: req.body.created,
                reporter: req.body.reporter,
                _id: req.params.id
            });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.
            User.find()
                .exec(function (err, reporters_list) {
                    if (err) { return next(err); }
                    res.render('issue_form', { title: 'Update Issue', issue: issue, errors: errors.array() });
                });
            return;
        }
        else {
            // Data from form is valid. Update the record.
            Issue.findByIdAndUpdate(req.params.id, issue, {}, function (err, theissue) {
                if (err) { return next(err); }
                // Successful - redirect to issue detail page.
                res.redirect(theissue.url);
            });
        }
    }
];