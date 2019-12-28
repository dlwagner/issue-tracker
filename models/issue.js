var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var IssueSchema = new Schema(
    {
        title: { type: String, required: true, max: 100 },
        desc: { type: String, required: true, max: 200 },
        created: { type: Date, default: Date.now }
    }
);

// Virtual for issue's URL
IssueSchema
    .virtual('url')
    .get(function () {
        return '/catalog/issue/' + this._id;
    });

//Export model
module.exports = mongoose.model('Issue', IssueSchema);