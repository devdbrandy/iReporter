import createError from 'http-errors';
import bcrypt from 'bcryptjs';
import db from '../../models/mock';
import { User } from '../../models';
import { validateRequest } from '../../utils';

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
        data: db.users,
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
    validateRequest(req, next);

    const userId = parseInt(req.params.id, 10);
    const user = db.users.find(row => row.id === userId);

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
    validateRequest(req, next);

    const userData = req.body;
    bcrypt.hash(req.body.password, 10, (err, hash) => {
      userData.password = hash;
      const newUser = new User(userData);
      db.users.push(newUser);

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
    });
  }
}
