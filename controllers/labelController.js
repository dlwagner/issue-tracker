var Label = require('../models/label');
var async = require('async');

const { body, validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator');

// Display list of labels.
exports.label_list = function (req, res, next) {

    Label.find()
        .sort([['label']])
        .exec(function (err, list_labels) {
            if (err) { return next(err); }
            //Successful, so render
            res.render('label_list', { title: 'Label List', label_list: list_labels });
        });
};