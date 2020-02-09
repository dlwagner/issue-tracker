/* eslint-disable no-underscore-dangle */
/* eslint-disable prefer-template */
/* eslint-disable func-names */
const mongoose = require('mongoose');

const { Schema } = mongoose;

const ProjectSchema = new Schema({
  project: { type: String },
});

ProjectSchema.virtual('name').get(function() {
  // In cases where a user does not have either a first name or last name
  // We want to make sure we handle the exception by returning an empty string for that case

  // eslint-disable-next-line camelcase
  let projectName = '';
  if (this.project) {
    projectName = this.project;
  }
  if (!this.project) {
    projectName = '';
  }

  return projectName;
});

// Virtual for issue's URL
/* ProjectSchema.virtual('url').get(function() {
  return '/list/project/' + this._id;
}); */

// Export model
module.exports = mongoose.model('Project', ProjectSchema);
