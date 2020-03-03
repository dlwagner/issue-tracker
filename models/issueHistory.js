const mongoose = require('mongoose');

const { Schema } = mongoose;

const IssueHistorySchema = new Schema({
  title: { type: String, max: 100 },
  description: { type: String, max: 200 },
  author: {
    type: String,
  },
  category: {
    type: String,
  },
  priority: {
    type: String,
  },
  assignee: { type: String },
  milestone: { type: String },
  project: { type: String },
  status: {
    type: String,
  },
  files: { type: [String] },
  date: { type: Date, default: Date.now },
  cId: { type: String },
});

// Virtual for created date
/* IssueHistorySchema.virtual('created_formatted').get(function() {
  return moment(this.created).format('MMM Do, YYYY');
});

IssueHistorySchema.virtual('created_yyyy_mm_dd').get(function() {
  return moment(this.created).format('YYYY-MM-DD');
});

IssueHistorySchema.virtual('duedate_yyyy_mm_dd').get(function() {
  return moment(this.due_date).format('YYYY-MM-DD');
});

IssueHistorySchema.virtual('duedate_formatted').get(function() {
  return moment(this.due_date).format('MMM Do, YYYY');
});

// Virtual for issue's URL
IssueHistorySchema.virtual('url').get(function() {
  return '/list/issue/' + this._id;
}); */

// Export model
module.exports = mongoose.model('IssueHistory', IssueHistorySchema);
