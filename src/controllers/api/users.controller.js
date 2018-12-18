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
  static index(request, response, next) {
    User.all()
      .then(users => responseHandler(response, users))
      .catch(next);
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
  static show(request, response, next) {
    const userId = parseInt(request.params.id, 10);
    User.find(userId)
      .then(user => responseHandler(response, [user]))
      .catch(next);
  }
}
