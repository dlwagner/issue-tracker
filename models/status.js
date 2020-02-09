/* eslint-disable no-underscore-dangle */
/* eslint-disable prefer-template */
/* eslint-disable func-names */
const mongoose = require('mongoose');

const { Schema } = mongoose;

const StatusSchema = new Schema({
  status: { type: String },
});

StatusSchema.virtual('name').get(function() {
  // In cases where a user does not have either a first name or last name
  // We want to make sure we handle the exception by returning an empty string for that case

  let statusName = '';
  if (this.status) {
    statusName = this.status;
  }
  if (!this.status) {
    statusName = '';
  }

  return statusName;
});

// Virtual for issue's URL
/* StatusSchema.virtual('url').get(function() {
  return '/list/status/' + this._id;
}); */

// Export model
module.exports = mongoose.model('Status', StatusSchema);
