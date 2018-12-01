import createError from 'http-errors';

/**
 * Verify token
 * TOKEN FORMAT [Authorization: Bearer <access_token>]
 *
 * @export
 * @param {object} req Request object
 * @param {object} res Response object
 * @param {Function} next Call to next middleware
 */
export default function verifyToken(req, res, next) {
  // Get auth header value
  const bearer = req.headers.authorization;
  if (!bearer) {
    next(createError(403, 'Unauthorized'));
  } else {
    const token = bearer.split(' ')[1];
    req.token = token;
    next();
  }
}
