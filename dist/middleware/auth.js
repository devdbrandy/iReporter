'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = verifyToken;
// TOKEN FORMAT
// Authorization: Bearer <access_token>

// Verify token
function verifyToken(req, res, next) {
  // Get auth header value
  var bearer = req.headers.authorization;
  if (!bearer) {
    res.status(403).json({
      status: 403,
      message: 'Unauthorized'
    });
  } else {
    var token = bearer.split(' ')[1];
    req.token = token;
    next();
  }
};