var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema(
    {
        first_name: { type: String, required: true, max: 30 },
        last_name: { type: String, required: true, max: 30 },
        email: { type: String, required: true }
    }
);

// Virtual for user's full name
UserSchema
    .virtual('name')
    .get(function () {

        // In cases where a user does not have either a first name or last name
        // We want to make sure we handle the exception by returning an empty string for that case

        var fullname = '';
        if (this.first_name && this.last_name) {
            fullname = this.first_name + ' ' + this.last_name
        }
        if (!this.first_name || !this.last_name) {
            fullname = '';
        }

        return fullname;
    });

// Virtual for user's URL
UserSchema
    .virtual('url')
    .get(function () {
        return '/list/user/' + this._id;
    });

//Export model
module.exports = mongoose.model('User', UserSchema);