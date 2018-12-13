import createError from 'http-errors';
import jwt from 'jsonwebtoken';
import { User } from '../../models';
import { env } from '../../utils';
import { isValidUser, responseHandler } from '../../utils/helpers';

export default class AuthController {
  static async auth(request, response, next) {
    const { username, password } = request.body;

    try {
      const user = await User.find(username);

      if (!isValidUser(user, password)) next(createError(401, 'Unauthenticated'));

      jwt.sign({ user }, env('APP_KEY'), (err, token) => {
        responseHandler(response, [{
          token,
          user,
        }]);
      });
    } catch (error) {
      next(error);
    }
  }
}
