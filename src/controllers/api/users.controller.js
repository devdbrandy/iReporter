import createError from 'http-errors';
import { User } from '../../models';
import { responseHandler } from '../../utils/helpers';

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
    const id = parseInt(request.params.id, 10);

    try {
      const user = await User.find({ id });
      if (!user) throw createError(404, 'Resource not found');
      return responseHandler(response, [user]);
    } catch (error) {
      return next(error);
    }
  }
}
