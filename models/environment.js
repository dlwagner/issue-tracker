/* eslint-disable no-underscore-dangle */
/* eslint-disable prefer-template */
/* eslint-disable func-names */
const mongoose = require('mongoose');

const { Schema } = mongoose;

const EnvironmentSchema = new Schema({
  environment: { type: String, max: 100 },
});

EnvironmentSchema.virtual('name').get(function() {
  // In cases where a user does not have either a first name or last name
  // We want to make sure we handle the exception by returning an empty string for that case

  let environmentName = '';
  if (this.environment) {
    environmentName = this.environment;
  }
  if (!this.environment) {
    environmentName = '';
  }

  return environmentName;
});

// Virtual for issue's URL
EnvironmentSchema.virtual('url').get(function() {
  return '/list/environment/' + this._id;
});

// Export model
module.exports = mongoose.model('Environment', EnvironmentSchema);
