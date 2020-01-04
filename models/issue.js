var mongoose = require('mongoose');
var moment = require('moment');

var Schema = mongoose.Schema;

var IssueSchema = new Schema(
    {
        title: { type: String, required: true, max: 100 },
        description: { type: String, required: true, max: 200 },
        label: { type: Schema.Types.ObjectId, ref: 'Label', required: true },
        environment: { type: Schema.Types.ObjectId, ref: 'Environment' },
        source_url: { type: String, max: 300 },
        created: { type: Date, default: Date.now, required: true },
        due_date: { type: Date },
        reporter: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        assignee: { type: Schema.Types.ObjectId, ref: 'User' },
        priority: { type: Schema.Types.ObjectId, ref: 'Priority' },
        severity: { type: Schema.Types.ObjectId, ref: 'Severity' },
        steps_to_reproduce: { type: String, max: 1000 },
        expected_results: { type: String, max: 1000 },
        actual_results: { type: String, max: 1000 },
        status: { type: Schema.Types.ObjectId, ref: 'Status', required: true },
    }
);

// Virtual for created date
IssueSchema
    .virtual('created_formatted')
    .get(function () {
        return moment(this.created).format('MMM Do, YYYY');
    });

IssueSchema
    .virtual('created_yyyy_mm_dd')
    .get(function () {
        return moment(this.created).format('YYYY-MM-DD');
    })

IssueSchema
    .virtual('duedate_yyyy_mm_dd')
    .get(function () {
        return moment(this.due_date).format('YYYY-MM-DD');
    })

IssueSchema
    .virtual('duedate_formatted')
    .get(function () {
        return moment(this.due_date).format('MMM Do, YYYY');
    });


// Virtual for issue's URL
IssueSchema
    .virtual('url')
    .get(function () {
        return '/list/issue/' + this._id;
    });

//Export model
module.exports = mongoose.model('Issue', IssueSchema);