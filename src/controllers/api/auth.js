import createError from 'http-errors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator/check';
import dbStorage from '../../models/mock';
import { env } from '../../helpers';

export default class AuthController {
  static auth(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      next(createError(422, '', { errors: errors.array() }));
    }

    const user = dbStorage.users.filter(data => (
      data.username === req.body.username
    ))[0];

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
