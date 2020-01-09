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
exports.index = function (req, res, next) {

    // Insert authenticated user into User collection.
    // A failed insert means the user already exists.
    var user = new User(
        {
            nickName: req.user.nickname,
            aId: req.user.id,
            displayName: req.user.displayName,
            gravatar: req.user.picture,
            provider: req.user.provider
        });

    user.save(function (err) {
        if (err) { }//swallow it, it's a duplicate
        //console.log("user.save error: " + err);
    });

    async.parallel({

        issue: function (callback) {
            Issue.find({}, 'title description')
                .populate('status')
                .exec(callback);
        },
        user: function (callback) {
            User.find().exec(callback);
        },
        label: function (callback) {
            Label.find().exec(callback);
        },
        status: function (callback) {
            Status.find().exec(callback);
        },
    }, function (err, results) {
        //console.log("results: " + results.user);
        if (err) { return next(err); }
        // Success, so render
        res.render('index1', { title: '', statuses: results.status, labels: results.label, users: results.user, issue_list: results.issue });
    });

};


/*
async.series([

    // Add authenticated user to Users Collection.
    function (callback) {
        var user = new User(
            {
                nickName: req.user.nickname,
                aId: req.user.id,
                displayName: req.user.displayName,
                gravatar: req.user.picture,
                provider: req.user.provider
            });

        user.save(function (err) {
            if (err) { }//swallow it, it's a duplicate
            //console.log("user.save error: " + err);
        });
    },

    async.parallel({

        issue: function (callback) {
            Issue.find({}, 'title description')
                .populate('status')
                .exec(callback);
        },
        user: function (callback) {
            User.find().exec(callback);
        },
    }),
], function (err, results) {
    if (err) { return next(err); }
    // Success, so render
    res.render('index1', { title: '', users: results.user, issue_list: results.issue });
});
*/
/*
// Find all issues
Issue.find({}, 'title description')
    .populate('status')
    .exec(function (err, list_issues) {
        if (err) { return next(err) };
        //Successful, so render
        res.render('index1', { title: '', issue_list: list_issues });
    }),

User.find().exec(function (err, user_list) {
    if (err) { return next(err) };
    //Success, so render
    console.log("List of Users: " + user_list);
}),
]);

/*const { _raw, _json, ...userProfile } = req.user;
console.log("Index Controller: ");
console.log("req.user.nickname: " + req.user.nickname);
//console.log("req.user.emails: " + JSON.stringify(req.user.emails));
//console.log("userProfile.emails: " + JSON.stringify(userProfile.emails));
console.log("req.user.picture: " + req.user.picture);
console.log("req.user.id: " + req.user.id);
console.log("req.user.displayName: " + req.user.displayName);
console.log("req.user.provider: " + req.user.provider);*/

    //const { _raw, _json, ...userProfile } = req.user;
/*console.log("In index Controller, userProfile: " +
    JSON.stringify(userProfile.nickname) +
    JSON.stringify(userProfile.picture) +
    JSON.stringify(userProfile.emails));*/
/*
Issue.find({}, 'title description environment created reporter')
    .populate('reporter')
    .populate('environment')
    .exec(function (err, list_issues) {
        if (err) { return next(err) };
        //Successful, so render
        res.render('index', { title: 'Issue List', issue_list: list_issues });
    });
    */

