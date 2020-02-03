/* eslint-disable no-underscore-dangle */
/* eslint-disable prefer-template */
/* eslint-disable func-names */
const mongoose = require('mongoose');

const { Schema } = mongoose;

const SeveritySchema = new Schema({
  severity: { type: String },
});

SeveritySchema.virtual('name').get(function() {
  // In cases where a user does not have either a first name or last name
  // We want to make sure we handle the exception by returning an empty string for that case

  let severityName = '';
  if (this.severity) {
    severityName = this.severity;
  }
  if (!this.severity) {
    severityName = '';
  }

  return severityName;
});

// Virtual for issue's URL
SeveritySchema.virtual('url').get(function() {
  return '/list/severity/' + this._id;
});

// Export model
module.exports = mongoose.model('Severity', SeveritySchema);
