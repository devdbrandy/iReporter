'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var router = (0, _express.Router)();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'iReporter' });
});

exports.default = router;