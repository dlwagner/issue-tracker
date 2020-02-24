/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable prefer-template */
const express = require('express');

const db = require('../utils/db');

const router = express.Router();
const secured = require('../lib/middleware/secured');
const indexController = require('../controllers/indexController');

// Get home page

router.get('/', secured(), indexController.index);

// @route GET /newissue
router.post(
  '/newissue',
  db.upload.array('file', 3),
  indexController.create_issue_post,
);

module.exports = router;
