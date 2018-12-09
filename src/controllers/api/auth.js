import createError from 'http-errors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../../models';
import { env } from '../../utils';

/**
 * Determines if the user is valid
 *
 * @param {User} user User object
 * @param {string} password provided password to validate against
 * @returns {boolean} returns truthy based on validation
 */
const isValidUser = (user, password) => {
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return false;
  }
  return true;
};

export default class AuthController {
  static auth(req, res, next) {
    const { username, password } = req.body;
    const user = User.findByUsername(username);

    if (!isValidUser(user, password)) {
      next(createError(401, 'Unauthenticated'));
    }

    jwt.sign({ user }, env('APP_KEY'), (err, token) => {
      res.status(200)
        .json({
          status: 200,
          data: [{ token }],
        });
    });
  }
}
