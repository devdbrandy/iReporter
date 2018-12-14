import createError from 'http-errors';
import jwt from 'jsonwebtoken';
import { User } from '../../models';
import { env } from '../../utils';
import { isValidUser, responseHandler } from '../../utils/helpers';

export default class AuthController {
  static auth(request, response, next) {
    const { username, password } = request.body;
    User.find(username)
      .then((user) => {
        if (!isValidUser(user, password)) return next(createError(401, 'Wrong username or password'));
        const token = jwt.sign(JSON.stringify(user), env('APP_KEY'));
        return responseHandler(response, [{
          token,
          user,
        }]);
      })
      .catch(error => next(createError(401, 'Wrong username or password')));
    return true;
  }
}
