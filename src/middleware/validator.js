import createError from 'http-errors';
import { validationResult } from 'express-validator/check';

export const validator = {
  auth: {
    username: {
      in: ['body'],
      errorMessage: 'Username is required',
      rtrim: { options: [[' ', '-']] },
    },
    password: {
      isLength: {
        errorMessage: 'Password should be at least 7 chars long',
        options: { min: 6 },
      },
    },
  },
  user: {
    firstname: {
      isLength: {
        errorMessage: 'Firstname is invalid',
        options: { min: 2 },
      },
      rtrim: { options: [[' ', '-']] },
    },
    lastname: {
      isLength: {
        errorMessage: 'Lastname is invalid',
        options: { min: 2 },
      },
      rtrim: { options: [[' ', '-']] },
    },
    email: {
      errorMessage: 'Provide a valid email address',
      isEmail: true,
    },
    password: {
      isLength: {
        errorMessage: 'Password should be at least 7 chars long',
        options: { min: 6 },
      },
    },
  },
  record: {
    location: {
      errorMessage: 'Invalid coordinates',
      isLatLong: true,
    },
    comment: {
      isLength: {
        errorMessage: 'Comment should be atleast 10 chars long',
        options: { min: 10 },
      },
    },
  },
};

/**
* Validates request
*
* @param {object} req Request object
* @param {Function} next call to next middleware
* @returns {Boolean} returns true successful validation
*
*/
export function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(createError(422, '', { errors: errors.array() }));
  }

  return next();
}
