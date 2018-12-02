import createError from 'http-errors';
import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator/check';
import dbStorage from '../../models/mock';
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
        data: dbStorage.users,
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
    const user = dbStorage.users.filter(item => (
      item.id === userId
    ))[0];

    if (user) {
      res.status(200).json({
        status: 200,
        data: [user.toString()],
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      next(createError(422, '', { errors: errors.array() }));
    }

    const userData = req.body;
    bcrypt.hash(req.body.password, 10, (err, hash) => {
      userData.password = hash;
      const newUser = new User(userData);
      dbStorage.users.push(newUser);

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
