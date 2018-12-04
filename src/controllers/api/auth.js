import createError from 'http-errors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db from '../../models/mock';
import { env, validateRequest } from '../../utils';

export default class AuthController {
  static auth(req, res, next) {
    validateRequest(req, next);

    const user = db.users.find(data => data.username === req.body.username);

    const { password } = req.body;
    if (!user || !bcrypt.compareSync(password, user.password)) {
      next(createError(401, 'Unauthorized'));
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
