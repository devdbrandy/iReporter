import createError from 'http-errors';
import { validationResult } from 'express-validator/check';

export const env = (name, value) => (
  process.env[name] ? process.env[name] : value
);

export const validateRequest = (req, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(createError(422, '', { errors: errors.array() }));
  }
};

export default {};
