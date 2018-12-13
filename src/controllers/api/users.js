import jwt from 'jsonwebtoken';
import { User } from '../../models';
import { responseHandler } from '../../utils/helpers';
import { env } from '../../utils';

export default class UsersController {
  /**
   * Fetch all users
   *
   * @static
   * @param {Object} request Request object
   * @param {Object} response Response object
   * @param {Function} next Call to next middleware
   *
   * @memberOf UsersController
   */
  static async index(request, response, next) {
    try {
      const users = await User.all();
      return responseHandler(response, users);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Fetch a specific user
   *
   * @static
   * @param {Object} request Request object
   * @param {Object} response Response object
   * @param {Function} next Call to next middleware
   *
   * @memberOf UsersController
   */
  static async show(request, response, next) {
    const userId = parseInt(request.params.id, 10);

    try {
      const user = await User.find(userId);
      return responseHandler(response, [user]);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Create new user
   *
   * @static
   * @param {Object} request Request object
   * @param {Object} response Response object
   * @param {Function} next Call to next middleware
   *
   * @memberOf UsersController
   */
  static async create(request, response, next) {
    try {
      const user = new User(request.body);
      const { id } = await user.save();

      return jwt.sign({ user }, env('APP_KEY'), (err, token) => {
        responseHandler(response, [{
          token,
          user,
        }], 201);
      });
    } catch (err) {
      return next(err);
    }
  }
}
