var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema(
    {
        nickName: { type: String, max: 30 },
        displayName: { type: String, max: 50 },
        aId: { type: String, unique: true, required: true },
        gravatar: { type: String },
        provider: { type: String }
    }
);

// Virtual for user's full name
UserSchema
    .virtual('name')
    .get(function () {

        // In cases where a user does not have either a first name or last name
        // We want to make sure we handle the exception by returning an empty string for that case

        var nick_name = '';
        if (this.nickName) {
            nick_name = this.nickName
        }
        if (!this.nickName) {
            nick_name = '';
        }

        return nick_name;
    });

// Virtual for user's URL
UserSchema
    .virtual('url')
    .get(function () {
        return '/list/user/' + this._id;
    });

//Export model
module.exports = mongoose.model('User', UserSchema);