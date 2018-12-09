import createError from 'http-errors';
import jwt from 'jsonwebtoken';
import { env } from '../utils';

/**
 * Verify user token
 * TOKEN FORMAT [Authorization: Bearer <access_token>]
 *
 * @export
 * @param {object} req Request object
 * @param {object} res Response object
 * @param {Function} next call to next middleware
 */
export function verifyToken(req, res, next) {
  // Get auth header value
  const bearer = req.headers.authorization;
  if (!bearer) return next(createError(401, 'Unauthenticated'));

  const token = bearer.split(' ')[1];
  if (!token) return next(createError(400, 'Invalid HEADER token'));

  req.token = token;
  return next();
}

export function authenticate(req, res, next) {
  jwt.verify(req.token, env('APP_KEY'), (err, decoded) => {
    if (!decoded) return next(createError(401, 'Unauthenticated'));
    req.user = decoded.user;
    return next();
  });
}
