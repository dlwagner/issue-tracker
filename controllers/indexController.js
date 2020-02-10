/* eslint-disable no-underscore-dangle */
/* eslint-disable prefer-template */
/* eslint-disable no-console */
/* eslint-disable consistent-return */
/* eslint-disable func-names */
const async = require('async');
const { body, validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator');
const Issue = require('../models/issue');
const User = require('../models/user');
const Priority = require('../models/priority');
const Category = require('../models/category');
const Status = require('../models/status');
const Project = require('../models/project');
const Milestone = require('../models/milestone');

// Display list of all issues.
exports.index = function(req, res, next) {
  // console.log('INDEX CONTROLLER');
  // Insert authenticated user into User collection.
  // A failed insert means the user already exists.
  const user = new User({
    nickName: req.user.nickname,
    aId: req.user.id,
    displayName: req.user.displayName,
    gravatar: req.user.picture,
    provider: req.user.provider,
  });

  user.save(function(err) {
    // eslint-disable-next-line no-empty
    if (err) {
    } // swallow it, it's a duplicate
    // eslint-disable-next-line no-console
    // console.log(err);
  });

  async.parallel(
    {
      issue(callback) {
        Issue.find({}, 'title description')
          .populate('category')
          .populate('priority')
          .populate('status')
          .populate('users')
          .populate('milestone')
          .populate('project')
          .exec(callback);
      },
      user(callback) {
        User.find({}, 'nickName').exec(callback);
      },
      category(callback) {
        Category.find().exec(callback);
      },
      status(callback) {
        Status.find().exec(callback);
      },
      priority(callback) {
        Priority.find().exec(callback);
      },
      project(callback) {
        Project.find().exec(callback);
      },
      milestone(callback) {
        Milestone.find().exec(callback);
      },
    },
    // eslint-disable-next-line consistent-return
    function(err, results) {
      if (err) {
        return next(err);
      }
      // Success, so render
      // console.log('issues: ' + results.issue);
      res.render('index', {
        title: '',
        issues: results.issue,
        users: results.user,
        statuses: results.status,
        priorities: results.priority,
        categories: results.category,
        milestones: results.milestone,
        projects: results.project,
      });
    },
  );
};

// Create New Issue - POST
exports.create_issue_post = [
  // Validate fields.

  body('title', 'Title must not be empty.')
    .isLength({ min: 1 })
    .trim(),
  body('description', 'Description must not be empty.')
    .isLength({ min: 1 })
    .trim(),
  // body('category', 'Category must not be empty').trim(),
  // body('priority', 'Priority must not be empty').trim(),
  /*
  body('source_url').trim(),
  body('steps_to_reproduce').trim(),
  body('expected_results').trim(),
  body('actual_results').trim(),
  body('label', 'label must not be empty.')
    .isLength({ min: 1 })
    .trim(),
  body('status').trim(),
  body('priority').trim(),
  body('severity').trim(),
  body('environment').trim(),
  body('reporter', 'Reporter must not be empty.')
    .isLength({ min: 1 })
    .trim(),
  body('assignee').trim(),
  body('created', 'Invalid created date')
    .optional({ checkFalsy: true })
    .isISO8601(),
  body('due_date', 'Invalid due_date date')
    .optional({ checkFalsy: true })
    .isISO8601(),
*/
  // Sanitize fields (using wildcard).
  sanitizeBody('*').escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    console.log('CREATE ISSUE POST');
    console.log('req.body.title: ' + req.body.title);
    console.log('req.body.description: ' + req.body.description);
    console.log('req.body.priority: ' + req.body.priority);
    console.log('req.body.category: ' + req.body.category);

    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create an Issue object with escaped and trimmed data.
    // eslint-disable-next-line prefer-const
    let issue = new Issue({
      title: req.body.title,
      description: req.body.description,
      author: req.user.nickname,
      category: req.body.category,
      priority: req.body.priority,
      assignee: req.body.assignee,
      milestone: req.body.milestone,
      project: req.body.project,
      status: req.body.status,
    });

    if (!errors.isEmpty()) {
      console.log('We got Validation errors');
      // There are errors. Render form again with sanitized values/error messages.
      // eslint-disable-next-line camelcase
      async.parallel(
        {
          issue(callback) {
            Issue.find({}, 'title description')
              .populate('category')
              .populate('priority')
              .populate('status')
              .populate('users')
              .populate('milestone')
              .populate('project')
              .exec(callback);
          },
          user(callback) {
            User.find({}, 'nickName').exec(callback);
          },
          category(callback) {
            Category.find().exec(callback);
          },
          status(callback) {
            Status.find().exec(callback);
          },
          priority(callback) {
            Priority.find().exec(callback);
          },
          project(callback) {
            Project.find().exec(callback);
          },
          milestone(callback) {
            Milestone.find().exec(callback);
          },
        },
        // eslint-disable-next-line consistent-return
        function(err, results) {
          if (err) {
            return next(err);
          }
          // Success, so render
          // console.log('issues: ' + results.issue);
          res.render('index', {
            title: '',
            issues: results.issue,
            users: results.user,
            statuses: results.status,
            priorities: results.priority,
            categories: results.category,
            milestones: results.milestone,
            projects: results.project,
          });
        },
      );
      /* User.find().exec(function(err, reporters_list) {
        if (err) {
          return next(err);
        }
        res.render('index', {
          title: '',
          reporters: reporters_list,
          errors: errors.array(),
        });
      }); */
      // eslint-disable-next-line no-useless-return
      return;
      //  eslint-disable-next-line no-else-return
    } else {
      // Data from form is valid. Save issue.
      issue.save(function(err) {
        if (err) {
          return next(err);
        }
        //  successful - redirect to new book record.
        //  res.redirect(issue.url);
        res.redirect('/');
      });
    }
  },
];
