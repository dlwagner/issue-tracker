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

exports.label_detail = function (req, res, next) {

    Label.findById(req.params.id)
        .exec(function (err, results) {
            if (err) { return next(err); }
            if (results == null) { // No results
                var err = new Error('label not found');
                err.status = 404;
                return next(err);
            }
            //Success, so render
            res.render('label_detail', { title: 'Label Detail', label: results });
        });
}