import createError from 'http-errors';
import jwt from 'jsonwebtoken';
import { User } from '../../models';
import { env } from '../../utils';
import { isValidUser, responseHandler, alreadyTaken } from '../../utils/helpers';

const handyConflictResponse = (param, next) => {
  next(createError(409, `${param} already taken`));
};

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
      const { email, username } = body;
      if (await alreadyTaken({ email })) {
        return handyConflictResponse('Email address', next);
      }
      if (await alreadyTaken({ username })) {
        return handyConflictResponse('Username', next);
      }

      const user = await User.create({
        firstname: body.firstname,
        lastname: body.lastname,
        othernames: body.othernames,
        phoneNumber: body.phoneNumber,
        email,
        username,
        password: body.password,
      });
      const token = jwt.sign({ user }, env('APP_KEY'));
      return responseHandler(response, [{ token, user }], 201);
    } catch (error) {
      return next(error);
    }
  }

  static async login(request, response, next) {
    const { body: { username, password } } = request;

    try {
      const user = await User.find({ username });
      if (!user || !isValidUser(user, password)) {
        throw createError(401, 'Invalid credentials');
      }

      const payload = JSON.stringify(user);
      const token = jwt.sign(payload, env('APP_KEY'));
      return responseHandler(response, [{ token, user }]);
    } catch (error) {
      return next(error);
    }
  }
}
