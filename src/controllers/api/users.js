import createError from 'http-errors';
import { User } from '../../models';

export default class UsersController {
  /**
   * Fetch all users
   *
   * @static
   * @param {Object} req Request object
   * @param {Object} res Response object
   * @param {Function} next Call to next middleware
   *
   * @memberOf UsersController
   */
  static index(req, res, next) {
    res.status(200)
      .json({
        status: 200,
        data: User.all(),
      });
  }

  /**
   * Fetch a specific user
   *
   * @static
   * @param {Object} req Request object
   * @param {Object} res Response object
   * @param {Function} next Call to next middleware
   *
   * @memberOf UsersController
   */
  static show(req, res, next) {
    const userId = parseInt(req.params.id, 10);
    const user = User.find(userId);

    if (user) {
      res.status(200).json({
        status: 200,
        data: [user],
      });
    } else {
      next(createError(404, 'Resource not found'));
    }
  }

  /**
   * Create new user
   *
   * @static
   * @param {Object} req Request object
   * @param {Object} res Response object
   * @param {Function} next Call to next middleware
   *
   * @memberOf UsersController
   */
  static create(req, res, next) {
    const newUser = User.create(req.body);
    res.status(201)
      .json({
        status: 201,
        data: [
          {
            id: newUser.id,
            message: 'New user created',
          },
        ],
      });
  }
}
