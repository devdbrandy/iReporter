import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import jwt from 'jsonwebtoken';
import { User } from '../models';
import { env } from '../helpers';
import {
  isValidUser,
  responseHandler,
  alreadyTaken,
  handleConflictResponse,
} from '../helpers/utils';

/**
 * Class representing auth controller
 *
 * @export
 * @class AuthController
 */
export default class AuthController {
  /**
   * Create new user account
   *
   * @static
   * @param {Request} request - Request object
   * @param {Response} response - Response object
   * @param {NextFunction} next call to next middleware
   *
   * @memberOf AuthController
   */
  static async signup(request, response, next) {
    const { body } = request;

    try {
      const { email, username } = body;
      if (await alreadyTaken({ email })) {
        return handleConflictResponse('Email address', next);
      }
      if (await alreadyTaken({ username })) {
        return handleConflictResponse('Username', next);
      }

      body.isAdmin = false; // default to regular user
      const user = await User.create(body);
      const token = jwt.sign({ user }, env('APP_KEY'));
      return responseHandler(response, [{ token, user }], 201);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Login to user account
   *
   * @static
   * @async
   * @param {Request} request - Request object
   * @param {Response} response - Response object
   * @param {NextFunction} next call to next middleware
   *
   * @memberOf AuthController
   */
  static async login(request, response, next) {
    const { body: { username, password } } = request;

    try {
      const user = await User.find({ username });
      if (!user || !isValidUser(user, password)) {
        throw createError(401, 'Invalid credentials.');
      }

      const payload = JSON.stringify(user);
      const token = jwt.sign(payload, env('APP_KEY'));
      return responseHandler(response, [{ token, user }]);
    } catch (error) {
      return next(error);
    }
  }
}
