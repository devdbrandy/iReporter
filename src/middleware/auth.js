// TOKEN FORMAT
// Authorization: Bearer <access_token>

// Verify token
export default function verifyToken(req, res, next) {
  // Get auth header value
  const bearer = req.headers.authorization;
  if (!bearer) {
    res.status(403)
      .json({
        status: 403,
        message: 'Unauthorized',
      });
  } else {
    const token = bearer.split(' ')[1];
    req.token = token;
    next();
  }
};
