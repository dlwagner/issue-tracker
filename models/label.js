var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var LabelSchema = new Schema(
    {
        label: { type: String, required: true }
    }
);

LabelSchema
    .virtual('name')
    .get(function () {

        // In cases where a user does not have either a first name or last name
        // We want to make sure we handle the exception by returning an empty string for that case

        var label_name = '';
        if (this.label) {
            label_name = this.label
        }
        if (!this.label) {
            label_name = '';
        }

        return label_name;
    });

// Virtual for issue's URL
LabelSchema
    .virtual('url')
    .get(function () {
        return '/list/label/' + this._id;
    });

//Export model
module.exports = mongoose.model('Label', LabelSchema);