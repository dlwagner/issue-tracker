#! /usr/bin/env node

console.log('This script populates some test issues to the database. Specified database as argument - e.g.: populatedb mongodb+srv://<username>:<password>@cluster0-mbdj7.mongodb.net/issue-tracker?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Issue = require('./models/issue')
var User = require('./models/user')

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var issues = []
var users = []

function issueCreate(title, description, created, reporter, cb) {
    issuedetail = { title: title, description: description, created: created, reporter: reporter }

    var issue = new Issue(issuedetail);

    issue.save(function (err) {
        if (err) {
            cb(err, null)
            return
        }
        console.log('New Issue: ' + issue);
        issues.push(issue)
        cb(null, issue)
    });
}

function userCreate(first_name, last_name, email, cb) {
    userdetail = { first_name: first_name, last_name: last_name, email: email }

    var user = new User(userdetail);

    user.save(function (err) {
        if (err) {
            cb(err, null)
            return
        }
        console.log('New User: ' + user);
        users.push(user)
        cb(null, user)
    });
}

function createUsers(cb) {
    async.series([
        function (callback) {
            userCreate('Rob', 'Smith', 'robsmith@mail.com', callback);
        },
        function (callback) {
            userCreate('Mark', 'Williams', 'markwilliams@hotmail.com', callback);
        },
        function (callback) {
            userCreate('John', 'Doe', 'johndoe@msmail.com', callback);
        },
    ],
        // optional callback
        cb);
}

function createIssues(cb) {
    async.series([
        function (callback) {
            issueCreate('Issue1', 'bug in machine', '2019-11-8', users[0], callback);
        },
        function (callback) {
            issueCreate('Issue2', 'bug in fizzbuster', '2019-02-8', users[0], callback);
        },
        function (callback) {
            issueCreate('Issue3', 'bug in coffee', '2019-06-8', users[1], callback);
        },
        function (callback) {
            issueCreate('Issue4', 'bug in eye', '2019-01-8', users[2], callback);
        },
        function (callback) {
            issueCreate('Issue5', 'bug in pie', '2019-12-8', users[2], callback);
        },

    ],
        // optional callback
        cb);
}

async.series([
    createUsers,
    createIssues,
],
    // Optional callback
    function (err, results) {
        if (err) {
            console.log('FINAL ERR: ' + err);
        }
        else {
            console.log('Issues: ' + issues);
        }
        // All done, disconnect from database
        mongoose.connection.close();
    });