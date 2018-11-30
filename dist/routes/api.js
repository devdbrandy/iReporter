'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _mock = require('../models/mock');

var _mock2 = _interopRequireDefault(_mock);

var _models = require('../models');

var _helpers = require('../helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.post('/auth', function (req, res, next) {
  var user = _mock2.default.users.filter(function (data) {
    return data.username === req.body.username;
  })[0];

  if (!user || req.body.password !== user.password) {
    return res.status(401).json({
      status: 401,
      data: {
        message: 'Unauthorized'
      }
    });
  }
  _jsonwebtoken2.default.sign({ user: user }, (0, _helpers.env)('CLIENT_SECRET_KEY'), function (err, token) {
    res.status(200).json({
      status: 200,
      data: { token: token }
    });
  });
});

/* Fetch all users */
router.get('/users', function (req, res, next) {
  res.status(200).json({
    status: 200,
    data: _mock2.default.users
  });
});

/* Create new user */
router.post('/users', function (req, res, next) {
  var data = req.body;
  var newUser = new _models.User(data);
  _mock2.default.users.push(newUser);

  res.status(201).json({
    status: 201,
    data: {
      id: newUser.id,
      message: 'New user created'
    }
  });
});

/* Fetch all red-flag records */
router.get('/red-flags', function (req, res, next) {
  res.status(200).json({
    status: 200,
    data: _mock2.default.records
  });
});

/* Fetch a specific red-flag record. */
router.get('/red-flags/:id', function (req, res, next) {
  var recordId = parseInt(req.params.id, 10);
  var record = _mock2.default.records.filter(function (item) {
    return item.id === recordId;
  })[0];

  res.status(200).json({
    status: 200,
    data: record
  });
});

/* Create a red-flag record. */
router.post('/red-flags', function (req, res, next) {
  var data = req.body;
  var newRecord = new _models.Record(data);
  _mock2.default.records.push(newRecord);

  res.status(201).json({
    status: 201,
    data: {
      id: newRecord.id,
      message: 'Created red-flag record'
    }
  });
});

/* Edit the location of a specific red-flag record */
router.patch('/red-flags/:id/location', function (req, res, next) {
  var recordId = parseInt(req.params.id, 10);
  var data = req.body;
  var record = _mock2.default.records.filter(function (item) {
    return item.id === recordId;
  })[0];
  record.updateLocation(data);

  res.status(201).json({
    status: 201,
    data: {
      id: recordId,
      message: "Updated red-flag record's location"
    }
  });
});

/* Edit the comment of a specific red-flag record */
router.patch('/red-flags/:id', function (req, res, next) {
  var recordId = parseInt(req.params.id, 10);
  var data = req.body;
  var record = _mock2.default.records.filter(function (item) {
    return item.id === recordId;
  })[0];
  record.update(data);

  res.status(201).json({
    status: 201,
    data: {
      id: recordId,
      message: "Updated red-flag record's comment"
    }
  });
});

/* Delete a specific red-flag record */
router.delete('/red-flags/:id', function (req, res, next) {
  var recordId = parseInt(req.params.id, 10);
  _mock2.default.records = _underscore2.default.reject(_mock2.default.records, function (record) {
    return record.id === recordId;
  });

  res.status(200).json({
    status: 200,
    data: {
      id: recordId,
      message: 'Red-flag record has been deleted'
    }
  });
});

exports.default = router;