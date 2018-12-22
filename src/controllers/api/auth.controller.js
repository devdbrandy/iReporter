import createError from 'http-errors';
import jwt from 'jsonwebtoken';
import { User } from '../../models';
import { env } from '../../utils';
import { isValidUser, responseHandler } from '../../utils/helpers';

export default class AuthController {
  /**
   * Create new user account
   *
   * @static
   * @param {Object} request Request object
   * @param {Object} response Response object
   * @param {Function} next Call to next middleware
   *
   * @memberOf UsersController
   */
  static async signup(request, response, next) {
    const { body } = request;

    try {
      const user = await User.create(body);
      const token = jwt.sign({ user }, env('APP_KEY'));
      return responseHandler(response, [{ token, user }], 201);
    } catch (error) {
      if (error.code === '23505' && error.constraint === 'users_email_key') {
        return next(createError(409, 'Email address already exists'));
      }
      if (error.code === '23505' && error.constraint === 'users_username_key') {
        return next(createError(409, 'Username already taken'));
      }
      return next(error);
    }
  }

  static async login(request, response, next) {
    const { body: { username, password } } = request;

    try {
      const user = await User.find({ username });
      if (!user) throw createError(401, 'Unauthenticated');

      if (!isValidUser(user, password)) {
        throw createError(401, 'Wrong username or password');
      }

      const payload = JSON.stringify(user);
      const token = jwt.sign(payload, env('APP_KEY'));
      return responseHandler(response, [{ token, user }]);
    } catch (error) {
      return next(error);
    }
  }
}
