const express = require('express');
const path = require('path');
const crypto = require('crypto');
const dotenv = require('dotenv');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const mongoose = require('mongoose');

let upload;

dotenv.config();

// Set up mongoose connection
const mongoDB = process.env.DB_URL;

mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

mongoose.Promise = global.Promise;
const dbInstance = mongoose.connection;

const gfs = { grid: undefined };

dbInstance.once('open', () => {
  gfs.grid = Grid(dbInstance.db, mongoose.mongo);
  gfs.grid.collection('uploads');
});

const storage = new GridFsStorage({
  // url: mongoDB,
  db: dbInstance,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(32, (err, buff) => {
        if (err) return reject(err);
        /*const filename =
          buff.toString('hex') + path.extname(file.originalname);*/
        const filename = file.originalname;
        const fileInfo = {
          filename,
          bucketName: 'uploads',
        };
        resolve(fileInfo);
      });
    });
  },
});

// eslint-disable-next-line prefer-const
upload = multer({ storage });

module.exports = {
  dbInstance,
  upload,
  gfs,
};
