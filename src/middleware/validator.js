import createError from 'http-errors';
import { validationResult } from 'express-validator/check';

const singular = param => param.replace(/s$/, '');

export const validator = {
  auth: {
    username: {
      in: ['body'],
      isAlphanumeric: {
        errorMessage: 'Username is invalid',
      },
      isLength: {
        errorMessage: 'Username should be at least 3 chars long',
        options: { min: 3 },
      },
    },
    password: {
      isLength: {
        errorMessage: 'Password should be at least 6 chars long',
        options: { min: 6 },
      },
    },
  },
  user: {
    firstname: {
      isAlpha: true,
      isLength: {
        errorMessage: 'First name should be at least 3 chars long',
        options: { min: 3 },
      },
      ltrim: { options: [[' ', '']] },
      rtrim: { options: [[' ', '']] },
    },
    lastname: {
      isAlpha: true,
      isLength: {
        errorMessage: 'Last name should be at least 3 chars long',
        options: { min: 3 },
      },
      ltrim: { options: [[' ', '']] },
      rtrim: { options: [[' ', '']] },
    },
    username: {
      isAlphanumeric: {
        errorMessage: 'Username is invalid',
      },
      isLength: {
        errorMessage: 'Username should be at least 3 chars long',
        options: { min: 3 },
      },
      ltrim: { options: [[' ', '']] },
      rtrim: { options: [[' ', '']] },
    },
    othernames: {
      ltrim: { options: [[' ', '']] },
      rtrim: { options: [[' ', '']] },
    },
    phoneNumber: {
      isMobilePhone: {
        errorMessage: 'Phone number is invalid',
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
      ltrim: { options: [[' ', '']] },
      rtrim: { options: [[' ', '']] },
    },
    images: {
      custom: {
        errorMessage: 'images must be an array',
        options: value => Array.isArray(value),
      },
    },
    videos: {
      custom: {
        errorMessage: 'videos must be an array',
        options: value => Array.isArray(value),
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
    return next(createError(400, '', { errors: errors.array() }));
  }

  return next();
}

export function validateType(req, res, next) {
  let { params: { type } } = req;
  type = singular(type);
  req.type = type;
  next();
}
