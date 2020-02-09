/* eslint-disable func-names */
const mongoose = require('mongoose');

const { Schema } = mongoose;

const CategorySchema = new Schema({
  category: { type: String },
});

CategorySchema.virtual('name').get(function() {
  // In cases where a user does not have either a first name or last name
  // We want to make sure we handle the exception by returning an empty string for that case

  let categoryName = '';
  if (this.category) {
    categoryName = this.category;
  }
  if (!this.category) {
    categoryName = '';
  }

  return categoryName;
});

// Virtual for issue's URL
/* CategorySchema.virtual('url').get(function() {
  return '/list/category/' + this._id;
}); */

// Export model
module.exports = mongoose.model('Category', CategorySchema);
