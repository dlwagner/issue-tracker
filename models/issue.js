/* eslint-disable no-underscore-dangle */
/* eslint-disable func-names */
/* eslint-disable prefer-template */
const mongoose = require('mongoose');
// const moment = require('moment');

const { Schema } = mongoose;

const IssueSchema = new Schema({
  title: { type: String, required: true, max: 100 },
  description: { type: String, required: true, max: 200 },
  author: {
    type: String,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
  },
  priority: {
    type: Schema.Types.ObjectId,
    ref: 'Priority',
  },
  assignee: { type: Schema.Types.ObjectId, ref: 'User' },
  milestone: { type: Schema.Types.ObjectId, ref: 'Milestone' },
  project: { type: Schema.Types.ObjectId, ref: 'Project' },
  status: {
    type: Schema.Types.ObjectId,
    ref: 'Status',
  },
  files: { type: [String] },
  cId: { type: String },
});

// Virtual for created date
/* IssueSchema.virtual('created_formatted').get(function() {
  return moment(this.created).format('MMM Do, YYYY');
});

IssueSchema.virtual('created_yyyy_mm_dd').get(function() {
  return moment(this.created).format('YYYY-MM-DD');
});

IssueSchema.virtual('duedate_yyyy_mm_dd').get(function() {
  return moment(this.due_date).format('YYYY-MM-DD');
});

IssueSchema.virtual('duedate_formatted').get(function() {
  return moment(this.due_date).format('MMM Do, YYYY');
});

// Virtual for issue's URL
IssueSchema.virtual('url').get(function() {
  return '/list/issue/' + this._id;
}); */

// Export model
module.exports = mongoose.model('Issue', IssueSchema);
