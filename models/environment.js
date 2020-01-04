var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var EnvironmentSchema = new Schema(
    {
        environment: { type: String, max: 100 }
    }
);

EnvironmentSchema
    .virtual('name')
    .get(function () {

        // In cases where a user does not have either a first name or last name
        // We want to make sure we handle the exception by returning an empty string for that case

        var environment_name = '';
        if (this.environment) {
            environment_name = this.environment
        }
        if (!this.environment) {
            environment_name = '';
        }

        return environment_name;
    });

// Virtual for issue's URL
EnvironmentSchema
    .virtual('url')
    .get(function () {
        return '/list/environment/' + this._id;
    });

//Export model
module.exports = mongoose.model('Environment', EnvironmentSchema);