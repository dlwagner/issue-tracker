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
var Label = require('./models/label')
var Environment = require('./models/environment')
var Priority = require('./models/priority')
var Severity = require('./models/severity')
var Status = require('./models/status')

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var issues = []
var users = []
var labels = []
var environments = []
var priorities = []
var severities = []
var statuses = []

function issueCreate(title,
    description,
    label,
    environment,
    source_url,
    created,
    due_date,
    reporter,
    assignee,
    priority,
    severity,
    steps_to_reproduce,
    expected_results,
    actual_results,
    status,
    cb) {
    issuedetail = {
        title: title,
        description: description,
        label: label,
        environment: environment,
        source_url: source_url,
        created: created,
        due_date: due_date,
        reporter: reporter,
        assignee: assignee,
        priority: priority,
        severity: severity,
        steps_to_reproduce: steps_to_reproduce,
        expected_results: expected_results,
        actual_results: actual_results,
        status: status
    }

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

function statusCreate(status, cb) {
    statusdetail = { status: status }

    var status = new Status(statusdetail);

    status.save(function (err) {
        if (err) {
            cb(err, null)
            return
        }
        console.log('New Status: ' + status);
        statuses.push(status)
        cb(null, status)
    });
}

function createStatuses(cb) {
    async.series([
        function (callback) {
            statusCreate('new', callback);
        },
        function (callback) {
            statusCreate('in-progress', callback);
        },
        function (callback) {
            statusCreate('verified', callback);
        },
        function (callback) {
            statusCreate('closed', callback);
        },
        function (callback) {
            statusCreate('assigned', callback);
        },
    ],
        // optional callback
        cb);
}

function severityCreate(severity, cb) {
    severitydetail = { severity: severity }

    var severity = new Severity(severitydetail);

    severity.save(function (err) {
        if (err) {
            cb(err, null)
            return
        }
        console.log('New Severity: ' + severity);
        severities.push(severity)
        cb(null, severity)
    });
}

function createSeverities(cb) {
    async.series([
        function (callback) {
            severityCreate('enhancement', callback);
        },
        function (callback) {
            severityCreate('trivial', callback);
        },
        function (callback) {
            severityCreate('minor', callback);
        },
        function (callback) {
            severityCreate('major', callback);
        },
        function (callback) {
            severityCreate('critical', callback);
        },
    ],
        // optional callback
        cb);
}

function priorityCreate(priority, cb) {
    prioritydetail = { priority: priority }

    var priority = new Priority(prioritydetail);

    priority.save(function (err) {
        if (err) {
            cb(err, null)
            return
        }
        console.log('New Priority: ' + priority);
        priorities.push(priority)
        cb(null, priority)
    });
}

function createPriorities(cb) {
    async.series([
        function (callback) {
            priorityCreate('low', callback);
        },
        function (callback) {
            priorityCreate('medium', callback);
        },
        function (callback) {
            priorityCreate('high', callback);
        },
    ],
        // optional callback
        cb);
}

function environmentCreate(environment, cb) {
    environmentdetail = { environment: environment }

    var environment = new Environment(environmentdetail);

    environment.save(function (err) {
        if (err) {
            cb(err, null)
            return
        }
        console.log('New Environment: ' + environment);
        environments.push(environment)
        cb(null, environment)
    });
}

function createEnvironments(cb) {
    async.series([
        function (callback) {
            environmentCreate('win10', callback);
        },
        function (callback) {
            environmentCreate('ubuntu', callback);
        },
        function (callback) {
            environmentCreate('greenNewDeal', callback);
        },
        function (callback) {
            environmentCreate('borderWall', callback);
        },
        function (callback) {
            environmentCreate('earth', callback);
        },
    ],
        // optional callback
        cb);
}

function labelCreate(label, cb) {
    labeldetail = { label: label }

    var label = new Label(labeldetail);

    label.save(function (err) {
        if (err) {
            cb(err, null)
            return
        }
        console.log('New Label: ' + label);
        labels.push(label)
        cb(null, label)
    });
}

function createLabels(cb) {
    async.series([
        function (callback) {
            labelCreate('bug', callback);
        },
        function (callback) {
            labelCreate('issue', callback);
        },
        function (callback) {
            labelCreate('enhancement', callback);
        },
        function (callback) {
            labelCreate('process', callback);
        },
        function (callback) {
            labelCreate('ticket', callback);
        },
    ],
        // optional callback
        cb);
}

function userCreate(nickName, displayName, aId, gravatar, provider, cb) {
    userdetail = { nickName: nickName, displayName: displayName, aId: aId, gravatar: gravatar, provider: provider }

    var user = new User(userdetail);

    user.save(function (err) {
        if (err) {
            //cb(err, null)
            //return
        }
        console.log('New User: ' + user);
        users.push(user)
        cb(null, user)
    });
}

function createUsers(cb) {
    async.series([
        function (callback) {
            userCreate('robsmith', 'robsmith@mail.com', 'auth0|5e0d3cc314eb2a0dd2967v8r', 'https://i2.wp.com/cdn.auth0.com/avatars/rs.png?ssl=1', 'auth0', callback);
        },
        function (callback) {
            userCreate('markwilliams', 'markwilliams@hotmail.com', 'auth0|5e0d3cc314eb2a0dd2967k9l', 'https://i2.wp.com/cdn.auth0.com/avatars/mw.png?ssl=1', 'auth0', callback);
        },
        function (callback) {
            userCreate('johndoe', 'johndoe@msmail.com', 'auth0|5e0d3cc314eb2a0dd2967y6m', 'https://i2.wp.com/cdn.auth0.com/avatars/jd.png?ssl=1', 'auth0', callback);
        },
        function (callback) {
            userCreate('billwagner', 'bw@msmail.com', 'auth0|5e0d3cc314eb2a0dd2967d4p', 'https://i2.wp.com/cdn.auth0.com/avatars/bw.png?ssl=1', 'auth0', callback);
        },
        function (callback) {
            userCreate('markwilliams', 'markwilliams@hotmail.com', 'auth0|5e0d3cc314eb2a0dd2967k9l', 'https://i2.wp.com/cdn.auth0.com/avatars/mw.png?ssl=1', 'auth0', callback);
        },
    ],
        // optional callback
        cb);
}

function createIssues(cb) {
    async.series([
        function (callback) {
            issueCreate('Issue10', 'bug in machine', labels[1], environments[0], 'https://someurl/', '2019-11-8', '2020-02-15', users[0], users[1], priorities[2], severities[0], '1-2-3', 'success', 'fail', statuses[0], callback);
        },
        function (callback) {
            issueCreate('Issue2', 'bug in coffee', labels[0], environments[1], 'https://someurl/', '2019-11-8', '2020-02-11', users[1], users[0], priorities[0], severities[2], '1-2-3', 'success', 'fail', statuses[1], callback);
        },
        function (callback) {
            issueCreate('AC out', 'ac has stopped working', labels[2], environments[4], '', '2020-01-01', '2020-01-08', users[2], users[1], priorities[2], severities[4], '1-2-3', 'success', 'fail', statuses[3], callback);
        },
        function (callback) {
            issueCreate('Process improvement', 'implement change mgt procedures', labels[3], environments[2], '', '2019-11-8', '2020-02-15', users[1], users[0], priorities[1], severities[0], '1-2-3', 'success', 'not implemented', statuses[2], callback);
        },
        function (callback) {
            issueCreate('Issue1', 'racoon in garage', labels[1], environments[2], '', '2019-11-8', '2020-02-15', users[0], users[1], priorities[2], severities[3], '1-2-3', 'success', 'fail', statuses[0], callback);
        },

    ],
        // optional callback
        cb);
}



async.series([
    createStatuses,
    createSeverities,
    createPriorities,
    createEnvironments,
    createLabels,
    createUsers,
    createIssues
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