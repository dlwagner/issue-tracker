/* eslint-disable no-underscore-dangle */
/* eslint-disable prefer-template */
/* eslint-disable func-names */
const mongoose = require('mongoose');

const { Schema } = mongoose;

const LabelSchema = new Schema({
  label: { type: String, required: true },
});

LabelSchema.virtual('name').get(function() {
  // In cases where a user does not have either a first name or last name
  // We want to make sure we handle the exception by returning an empty string for that case

  let labelName = '';
  if (this.label) {
    labelName = this.label;
  }
  if (!this.label) {
    labelName = '';
  }

  return labelName;
});

// Virtual for issue's URL
LabelSchema.virtual('url').get(function() {
  return '/list/label/' + this._id;
});

// Export model
module.exports = mongoose.model('Label', LabelSchema);
