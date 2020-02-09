/* eslint-disable func-names */
const mongoose = require('mongoose');

const { Schema } = mongoose;

const MilestoneSchema = new Schema({
  milestone: { type: String },
});

MilestoneSchema.virtual('name').get(function() {
  // In cases where a user does not have either a first name or last name
  // We want to make sure we handle the exception by returning an empty string for that case

  let milestoneName = '';
  if (this.milestone) {
    milestoneName = this.milestone;
  }
  if (!this.milestone) {
    milestoneName = '';
  }

  return milestoneName;
});

// Virtual for issue's URL
/* MilestoneSchema.virtual('url').get(function() {
  return '/list/milestone/' + this._id;
}); */

// Export model
module.exports = mongoose.model('Milestone', MilestoneSchema);
