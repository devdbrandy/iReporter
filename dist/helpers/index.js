"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var env = exports.env = function env(name, value) {
  return process.env[name] ? process.env[name] : value;
};

exports.default = {};