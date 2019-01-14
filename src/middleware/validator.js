import createError from 'http-errors';
import { validationResult } from 'express-validator/check';

const singular = param => param.replace(/s$/, '');

const validateTextRule = (param, minLength) => (
  {
    isLength: {
      errorMessage: `${param} should be atleast ${minLength} chars long`,
      options: { min: minLength },
    },
    ltrim: { options: [[' ', '']] },
    rtrim: { options: [[' ', '']] },
  }
);

const validateNameRule = param => (
  {
    isAlpha: true,
    isLength: {
      errorMessage: `${param} should be at least 3 chars long`,
      options: { min: 3 },
    },
    ltrim: { options: [[' ', '']] },
    rtrim: { options: [[' ', '']] },
  }
);

export const validator = {
  auth: {
    username: {
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
    firstname: validateNameRule('First name'),
    lastname: validateNameRule('Last name'),
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
      custom: {
        options: (value, { req }) => {
          if (value !== req.body.passwordConfirmation) {
            throw new Error('Passwords do not match');
          }
          return value;
        },
      },
    },
  },
  record: {
    location: {
      errorMessage: 'Invalid coordinates',
      isLatLong: true,
    },
    title: validateTextRule('Title', 5),
    comment: validateTextRule('Comment', 10),
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
  const recordTypes = ['red-flags', 'interventions'];
  let { params: { type } } = req;

  if (recordTypes.indexOf(type) === -1) {
    return next(createError(404, 'Provided route is invalid'));
  }

  type = singular(type);
  req.type = type;
  return next();
}
