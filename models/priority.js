/* eslint-disable no-underscore-dangle */
/* eslint-disable prefer-template */
/* eslint-disable func-names */
const mongoose = require('mongoose');

const { Schema } = mongoose;

const PrioritySchema = new Schema({
  priority: { type: String },
});

PrioritySchema.virtual('name').get(function() {
  // In cases where a user does not have either a first name or last name
  // We want to make sure we handle the exception by returning an empty string for that case

  // eslint-disable-next-line camelcase
  let priorityName = '';
  if (this.priority) {
    priorityName = this.priority;
  }
  if (!this.priority) {
    priorityName = '';
  }

  return priorityName;
});

// Virtual for issue's URL
PrioritySchema.virtual('url').get(function() {
  return '/list/priority/' + this._id;
});

// Export model
module.exports = mongoose.model('Priority', PrioritySchema);
