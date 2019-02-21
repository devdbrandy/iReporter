import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import jwt from 'jsonwebtoken';
import { env } from '../helpers';

/**
 * Verify user token
 * TOKEN FORMAT [Authorization: Bearer <access_token>]
 *
 * @export
 * @param {Request} req Request object
 * @param {Response} res Response object
 * @param {NextFunction} next call to next middleware
 * @returns
 */
function authenticate(req, res, next) {
  // Get auth header value
  const bearer = req.headers.authorization;
  if (!bearer) return next(createError(401, 'You are unauthorized to access the requested resource. Please log in.'));

  const token = bearer.split(' ')[1];
  if (!token) return next(createError(401, 'Authentication required: Please provide a valid token.'));

  return jwt.verify(token, env('APP_KEY'), async (err, decoded) => {
    if (err || !decoded) return next(createError(401, 'Authentication failure: Invalid access token.'));

    const { user } = decoded;
    req.user = user || decoded;
    return next();
  });
}

export default authenticate;
