var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var SeveritySchema = new Schema(
    {
        severity: { type: String }
    }
);

SeveritySchema
    .virtual('name')
    .get(function () {

        // In cases where a user does not have either a first name or last name
        // We want to make sure we handle the exception by returning an empty string for that case

        var severity_name = '';
        if (this.severity) {
            severity_name = this.severity
        }
        if (!this.severity) {
            severity_name = '';
        }

        return severity_name;
    });

// Virtual for issue's URL
SeveritySchema
    .virtual('url')
    .get(function () {
        return '/list/severity/' + this._id;
    });

//Export model
module.exports = mongoose.model('Severity', SeveritySchema);