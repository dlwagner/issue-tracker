#! /usr/bin/env node

console.log(
  'This script populates some test issues to the database. Specified database as argument - e.g.: >sudo node populatedb mongodb+srv://<username>:<password>@cluster0-mbdj7.mongodb.net/issue-tracker?retryWrites=true',
);

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async');
var Issue = require('./models/issue');
var User = require('./models/user');
var Project = require('./models/project');
var Milestone = require('./models/milestone');
var Priority = require('./models/priority');
var Category = require('./models/category');
var Status = require('./models/status');

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on(
  'error',
  console.error.bind(console, 'MongoDB connection error:'),
);

var issues = [];
var users = [];
var statuses = [];
var priorities = [];
let projects = [];
let categories = [];
let milestones = [];
// var projects = []
// var milestones = []
// var severities = []

function issueCreate(
  title,
  description,
  author,
  category,
  priority,
  assignee,
  milestone,
  project,
  status,
  cb,
) {
  issuedetail = {
    title: title,
    description: description,
    author: author,
    category: category,
    priority: priority,
    assignee: assignee,
    milestone: milestone,
    project: project,
    status: status,
  };

  var issue = new Issue(issuedetail);

  issue.save(function(err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Issue: ' + issue);
    issues.push(issue);
    cb(null, issue);
  });
}

function statusCreate(status, cb) {
  statusdetail = { status: status };

  var status = new Status(statusdetail);

  status.save(function(err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Status: ' + status);
    statuses.push(status);
    cb(null, status);
  });
}

function createStatuses(cb) {
  async.series(
    [
      function(callback) {
        statusCreate('new', callback);
      },
      function(callback) {
        statusCreate('in-progress', callback);
      },
      function(callback) {
        statusCreate('verified', callback);
      },
      function(callback) {
        statusCreate('closed', callback);
      },
      function(callback) {
        statusCreate('assigned', callback);
      },
    ],
    // optional callback
    cb,
  );
}

function categoryCreate(category, cb) {
  categorydetail = { category: category };

  var category = new Category(categorydetail);

  category.save(function(err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Category: ' + category);
    categories.push(category);
    cb(null, category);
  });
}

function createCategories(cb) {
  async.series(
    [
      function(callback) {
        categoryCreate('bug', callback);
      },
      function(callback) {
        categoryCreate('feature', callback);
      },
      function(callback) {
        categoryCreate('maintenance', callback);
      },
    ],
    // optional callback
    cb,
  );
}

function priorityCreate(priority, cb) {
  prioritydetail = { priority: priority };

  var priority = new Priority(prioritydetail);

  priority.save(function(err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Priority: ' + priority);
    priorities.push(priority);
    cb(null, priority);
  });
}

function createPriorities(cb) {
  async.series(
    [
      function(callback) {
        priorityCreate('low', callback);
      },
      function(callback) {
        priorityCreate('medium', callback);
      },
      function(callback) {
        priorityCreate('high', callback);
      },
    ],
    // optional callback
    cb,
  );
}

function milestoneCreate(milestone, cb) {
  milestonedetail = { milestone: milestone };

  var milestone = new Milestone(milestonedetail);

  milestone.save(function(err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Milestone: ' + milestone);
    milestones.push(milestone);
    cb(null, milestone);
  });
}

function createMilestones(cb) {
  async.series(
    [
      function(callback) {
        milestoneCreate('beta', callback);
      },
      function(callback) {
        milestoneCreate('alpha', callback);
      },
      function(callback) {
        milestoneCreate('development', callback);
      },
      function(callback) {
        milestoneCreate('test', callback);
      },
      function(callback) {
        milestoneCreate('production', callback);
      },
    ],
    // optional callback
    cb,
  );
}

function projectCreate(project, cb) {
  projectdetail = { project: project };

  var project = new Project(projectdetail);

  project.save(function(err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Project: ' + project);
    projects.push(project);
    cb(null, project);
  });
}

function createProjects(cb) {
  async.series(
    [
      function(callback) {
        projectCreate('alpha-one', callback);
      },
      function(callback) {
        projectCreate('fizzbuster', callback);
      },
      function(callback) {
        projectCreate('mars-lander', callback);
      },
      function(callback) {
        projectCreate('apollo 11', callback);
      },
      function(callback) {
        projectCreate('top-secret', callback);
      },
    ],
    // optional callback
    cb,
  );
}

function userCreate(
  nickName,
  displayName,
  aId,
  gravatar,
  provider,
  cb,
) {
  userdetail = {
    nickName: nickName,
    displayName: displayName,
    aId: aId,
    gravatar: gravatar,
    provider: provider,
  };

  var user = new User(userdetail);

  user.save(function(err) {
    if (err) {
      //cb(err, null)
      //return
    }
    console.log('New User: ' + user);
    users.push(user);
    cb(null, user);
  });
}

function createUsers(cb) {
  async.series(
    [
      function(callback) {
        userCreate(
          'robsmith',
          'robsmith@mail.com',
          'auth0|5e0d3cc314eb2a0dd2967v8r',
          'https://i2.wp.com/cdn.auth0.com/avatars/rs.png?ssl=1',
          'auth0',
          callback,
        );
      },
      function(callback) {
        userCreate(
          'markwilliams',
          'markwilliams@hotmail.com',
          'auth0|5e0d3cc314eb2a0dd2967k9l',
          'https://i2.wp.com/cdn.auth0.com/avatars/mw.png?ssl=1',
          'auth0',
          callback,
        );
      },
      function(callback) {
        userCreate(
          'johndoe',
          'johndoe@msmail.com',
          'auth0|5e0d3cc314eb2a0dd2967y6m',
          'https://i2.wp.com/cdn.auth0.com/avatars/jd.png?ssl=1',
          'auth0',
          callback,
        );
      },
      function(callback) {
        userCreate(
          'billwagner',
          'bw@msmail.com',
          'auth0|5e0d3cc314eb2a0dd2967d4p',
          'https://i2.wp.com/cdn.auth0.com/avatars/bw.png?ssl=1',
          'auth0',
          callback,
        );
      },
      function(callback) {
        userCreate(
          'suzieQ',
          'suzieQ@mail.com',
          'auth0|5e0d3cc314eb2a0dd2967k9l',
          'https://i2.wp.com/cdn.auth0.com/avatars/sq.png?ssl=1',
          'auth0',
          callback,
        );
      },
    ],
    // optional callback
    cb,
  );
}

function createIssues(cb) {
  async.series(
    [
      function(callback) {
        issueCreate(
          'Issue10',
          'bug in machine',
          users[0],
          categories[0],
          priorities[2],
          users[1],
          milestones[0],
          projects[1],
          statuses[0],
          callback,
        );
      },
      function(callback) {
        issueCreate(
          'Issue2',
          'bug in coffee',
          users[1],
          categories[2],
          priorities[0],
          users[2],
          milestones[3],
          projects[2],
          statuses[3],
          callback,
        );
      },
      function(callback) {
        issueCreate(
          'AC out',
          'ac has stopped working',
          users[4],
          categories[0],
          priorities[2],
          users[2],
          milestones[2],
          projects[1],
          statuses[0],
          callback,
        );
      },
      function(callback) {
        issueCreate(
          'process improvement',
          'update change management procedures',
          users[3],
          categories[1],
          priorities[1],
          users[0],
          milestones[1],
          projects[3],
          statuses[1],
          callback,
        );
      },
      function(callback) {
        issueCreate(
          'Issue1',
          'racoon in garage',
          users[2],
          categories[0],
          priorities[1],
          users[0],
          milestones[0],
          projects[0],
          statuses[0],
          callback,
        );
      },
    ],
    // optional callback
    cb,
  );
}

async.series(
  [
    createStatuses,
    createCategories,
    createPriorities,
    createMilestones,
    createProjects,
    createUsers,
    createIssues,
  ],
  // Optional callback
  function(err, results) {
    if (err) {
      console.log('FINAL ERR: ' + err);
    } else {
      console.log('Issues: ' + issues);
    }
    // All done, disconnect from database
    mongoose.connection.close();
  },
);
