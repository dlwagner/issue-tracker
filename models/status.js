var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var StatusSchema = new Schema(
    {
        status: { type: String, required: true }
    }
);

StatusSchema
    .virtual('name')
    .get(function () {

        // In cases where a user does not have either a first name or last name
        // We want to make sure we handle the exception by returning an empty string for that case

        var status_name = '';
        if (this.status) {
            status_name = this.status
        }
        if (!this.status) {
            status_name = '';
        }

        return status_name;
    });

// Virtual for issue's URL
StatusSchema
    .virtual('url')
    .get(function () {
        return '/list/status/' + this._id;
    });

//Export model
module.exports = mongoose.model('Status', StatusSchema);