var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var IssueSchema = new Schema(
    {
        title: { type: String, required: true, max: 100 },
        desc: { type: String, required: true, max: 200 },
        created: { type: Date, default: Date.now },
        reporter: { type: Schema.Types.ObjectId, ref: 'User', required: true }
    }
);

// Virtual for issue's URL
IssueSchema
    .virtual('url')
    .get(function () {
        return '/list/issue/' + this._id;
    });

//Export model
module.exports = mongoose.model('Issue', IssueSchema);