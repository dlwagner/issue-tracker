var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PrioritySchema = new Schema(
    {
        priority: { type: String }
    }
);

PrioritySchema
    .virtual('name')
    .get(function () {

        // In cases where a user does not have either a first name or last name
        // We want to make sure we handle the exception by returning an empty string for that case

        var priority_name = '';
        if (this.priority) {
            priority_name = this.priority
        }
        if (!this.priority) {
            priority_name = '';
        }

        return priority_name;
    });

// Virtual for issue's URL
PrioritySchema
    .virtual('url')
    .get(function () {
        return '/list/priority/' + this._id;
    });

//Export model
module.exports = mongoose.model('Priority', PrioritySchema);