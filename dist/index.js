'use strict';

var _loglevel = require('loglevel');

var log = _interopRequireWildcard(_loglevel);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _server = require('./server');

var _server2 = _interopRequireDefault(_server);

var _helpers = require('./helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

_dotenv2.default.config({ silent: true });

var port = process.env.PORT || 3000;
_server2.default.listen(port, function () {
  return log.warn('Listening on port ' + port);
});