import createError from 'http-errors';
import jwt from 'jsonwebtoken';
import { env } from '../utils';

/**
 * Verify user token
 * TOKEN FORMAT [Authorization: Bearer <access_token>]
 *
 * @export
 * @param {any} req
 * @param {any} res
 * @param {any} next
 * @returns
 */
function authenticate(req, res, next) {
  // Get auth header value
  const bearer = req.headers.authorization;
  if (!bearer) return next(createError(401, 'Authentication required'));

  const token = bearer.split(' ')[1];
  if (!token) return next(createError(400, 'Please provide a valid token'));

  return jwt.verify(token, env('APP_KEY'), async (err, decoded) => {
    if (err || !decoded) return next(createError(401, 'Failed authentication'));

    req.user = decoded;
    return next();
  });
}

export default authenticate;
