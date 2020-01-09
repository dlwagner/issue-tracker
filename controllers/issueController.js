var Issue = require('../models/issue');
var User = require('../models/user');
var Label = require('../models/label');
var Severity = require('../models/severity');
var Priority = require('../models/priority');
var Environment = require('../models/environment');
var Status = require('../models/status');

const { body, validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator');

var async = require('async');

// Display Issue Tracker home page with issue and user counts.
exports.index = function (req, res) {

    async.parallel({
        issue_count: function (callback) {
            Issue.countDocuments({}, callback);
        },
        user_count: function (callback) {
            User.countDocuments({}, callback);
        }
    }, function (err, results) {
        res.render('index', { title: 'Issue Tracker', error: err, data: results });
    });
};


// Display list of all issues.
exports.issue_list = function (req, res, next) {

    Issue.find({}, 'title description environment created reporter')
        .populate('reporter')
        .populate('environment')
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
        .populate('assignee')
        .populate('label')
        .populate('environment')
        .populate('priority')
        .populate('severity')
        .populate('status')
        .exec(function (err, issueinstance) {
            if (err) { return next(err); }
            if (issueinstance == null) { // No results.
                var err = new Error('issue instance not found');
                err.status = 404;
                return next(err);
            }
            // Successful, so render.
            res.render('issue_detail', {
                title: 'Issue: ' +
                    issueinstance.reporter.name +
                    issueinstance.assignee.name +
                    issueinstance.label.name +
                    issueinstance.environment.name +
                    issueinstance.priority.name +
                    issueinstance.severity.name +
                    issueinstance.status.name, issueinstance: issueinstance
            });
        });

};

// Display issue create form on GET.
exports.issue_create_get = function (req, res, next) {

    async.parallel({

        users: function (callback) {
            User.find(callback);
        },
        environment: function (callback) {
            Environment.find(callback);
        },
        label: function (callback) {
            Label.find(callback);
        },
        priority: function (callback) {
            Priority.find(callback);
        },
        severity: function (callback) {
            Severity.find(callback);
        },
        status: function (callback) {
            Status.find(callback);
        },
    }, function (err, results) {
        if (err) { return next(err); }
        // Success, so render.
        res.render('issue_form', {
            title: 'Create Issue',
            reporters: results.users,
            assignees: results.users,
            environments: results.environment,
            labels: results.label,
            priorities: results.priority,
            severities: results.severity,
            statuses: results.status
        });
    });
};

// Handle issue create on POST.
exports.issue_create_post = [

    // Validate fields.
    body('title', 'Title must not be empty.').isLength({ min: 1 }).trim(),
    body('description', 'Description must not be empty.').isLength({ min: 1 }).trim(),
    body('source_url').trim(),
    body('steps_to_reproduce').trim(),
    body('expected_results').trim(),
    body('actual_results').trim(),
    body('label', 'label must not be empty.').isLength({ min: 1 }).trim(),
    body('status').trim(),
    body('priority').trim(),
    body('severity').trim(),
    body('environment').trim(),
    body('reporter', 'Reporter must not be empty.').isLength({ min: 1 }).trim(),
    body('assignee').trim(),
    body('created', 'Invalid created date').optional({ checkFalsy: true }).isISO8601(),
    body('due_date', 'Invalid due_date date').optional({ checkFalsy: true }).isISO8601(),

    // Sanitize fields (using wildcard).
    sanitizeBody('*').escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create an Issue object with escaped and trimmed data.
        var issue = new Issue(
            {
                title: req.body.title,
                description: req.body.description,
                source_url: req.body.source_url,
                steps_to_reproduce: req.body.steps_to_reproduce,
                expected_results: req.body.expected_results,
                actual_results: req.body.actual_results,
                label: req.body.label,
                status: req.body.status,
                priority: req.body.priority,
                severity: req.body.severity,
                environment: req.body.environment,
                reporter: req.body.reporter,
                assignee: req.body.assignee,
                created: req.body.created,
                due_date: req.body.due_date
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

    async.parallel({
        issue: function (callback) {
            Issue.findById(req.params.id)
                .populate('reporter')
                .populate('assignee')
                .populate('environment')
                .populate('label')
                .populate('priority')
                .populate('severity')
                .populate('status')
                .exec(callback);
        },
        users: function (callback) {
            User.find(callback);
        },
        environment: function (callback) {
            Environment.find(callback);
        },
        label: function (callback) {
            Label.find(callback);
        },
        priority: function (callback) {
            Priority.find(callback);
        },
        severity: function (callback) {
            Severity.find(callback);
        },
        status: function (callback) {
            Status.find(callback);
        },
    }, function (err, results) {
        if (err) { return next(err); }
        if (results.issue == null) { // No results.
            var err = new Error('Issue not found');
            err.status = 404;
            return next(err);
        }
        // Success, so render.
        console.log('steps to repro: ' + results.issue);
        res.render('issue_form', {
            title: 'Update Issue',
            reporters: results.users,
            assignees: results.users,
            environments: results.environment,
            labels: results.label,
            priorities: results.priority,
            severities: results.severity,
            statuses: results.status,
            issue: results.issue
        });
    });
};

// Handle issue update on POST.
exports.issue_update_post = [

    // Validate fields.
    body('title', 'Title must not be empty.').isLength({ min: 1 }).trim(),
    body('description', 'Description must not be empty.').isLength({ min: 1 }).trim(),
    body('source_url').trim(),
    body('steps_to_reproduce').trim(),
    body('expected_results').trim(),
    body('actual_results').trim(),
    body('label', 'label must not be empty.').isLength({ min: 1 }).trim(),
    body('status').trim(),
    body('priority').trim(),
    body('severity').trim(),
    body('environment').trim(),
    body('reporter', 'Reporter must not be empty.').isLength({ min: 1 }).trim(),
    body('assignee').trim(),
    body('created', 'Invalid created date').optional({ checkFalsy: true }).isISO8601(),
    body('due_date', 'Invalid due_date date').optional({ checkFalsy: true }).isISO8601(),

    // Sanitize fields (using wildcard).
    sanitizeBody('*').escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create an Issue object with escaped and trimmed data.
        var issue = new Issue(
            {
                title: req.body.title,
                description: req.body.description,
                source_url: req.body.source_url,
                steps_to_reproduce: req.body.steps_to_reproduce,
                expected_results: req.body.expected_results,
                actual_results: req.body.actual_results,
                label: req.body.label,
                status: req.body.status,
                priority: req.body.priority,
                severity: req.body.severity,
                environment: req.body.environment,
                reporter: req.body.reporter,
                assignee: req.body.assignee,
                created: req.body.created,
                due_date: req.body.due_date,
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