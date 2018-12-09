import createError from 'http-errors';

/**
 * Verify user token
 * TOKEN FORMAT [Authorization: Bearer <access_token>]
 *
 * @export
 * @param {object} req Request object
 * @param {object} res Response object
 * @param {Function} next call to next middleware
 */
export default function verifyToken(req, res, next) {
  // Get auth header value
  const bearer = req.headers.authorization;
  if (!bearer) return next(createError(403, 'Unauthorized'));

  const token = bearer.split(' ')[1];
  if (!token) return next(createError(400, 'Invalid HEADER token'));

  req.token = token;
  return next();
}
