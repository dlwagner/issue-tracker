/* eslint-disable func-names */
const async = require('async');
const Issue = require('../models/issue');
const User = require('../models/user');
const Label = require('../models/label');
// const Severity = require('../models/severity');
// var Priority = require('../models/priority');
// var Environment = require('../models/environment');
const Status = require('../models/status');

// const { body, validationResult } = require('express-validator');
// const { sanitizeBody } = require('express-validator');

// Display list of all issues.
exports.index = function(req, res, next) {
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
    console.log(err);
  });

  async.parallel(
    {
      issue(callback) {
        Issue.find({}, 'title description')
          .populate('status')
          .exec(callback);
      },
      user(callback) {
        User.find({}, 'nickName').exec(callback);
      },
      label(callback) {
        Label.find().exec(callback);
      },
      status(callback) {
        Status.find().exec(callback);
      },
    },
    // eslint-disable-next-line consistent-return
    function(err, results) {
      if (err) {
        return next(err);
      }
      // Success, so render
      // res.render('index1', { title: '', statuses: results.status, labels: results.label, users: results.user, issue_list: results.issue });
      res.render('index', {
        title: '',
        issue_list: results.issue,
        user_list: results.user,
        status_list: results.status,
      });
    },
  );
};

/*  Before linting and formatting - just in case!
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

// Display list of all issues.
exports.index = function(req, res, next) {
  // Insert authenticated user into User collection.
  // A failed insert means the user already exists.
  var user = new User({
    nickName: req.user.nickname,
    aId: req.user.id,
    displayName: req.user.displayName,
    gravatar: req.user.picture,
    provider: req.user.provider,
  });

  user.save(function(err) {
    if (err) {
    } //swallow it, it's a duplicate
    console.log(err);
  });

  async.parallel(
    {
      issue: function(callback) {
        Issue.find({}, 'title description')
          .populate('status')
          .exec(callback);
      },
      user: function(callback) {
        User.find({}, 'nickName').exec(callback);
      },
      label: function(callback) {
        Label.find().exec(callback);
      },
      status: function(callback) {
        Status.find().exec(callback);
      },
    },
    function(err, results) {
      console.log('results: ' + results.user);
      if (err) {
        return next(err);
      }
      // Success, so render
      //res.render('index1', { title: '', statuses: results.status, labels: results.label, users: results.user, issue_list: results.issue });
      res.render('index', {
        title: '',
        issue_list: results.issue,
        user_list: results.user,
        status_list: results.status,
      });
    },
  );
};



*/
