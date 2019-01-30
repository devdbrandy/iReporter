import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { validationResult } from 'express-validator/check';

const singular = param => param.replace(/s$/, '');

const validateTextRule = (param, minLength) => (
  {
    isLength: {
      errorMessage: `${param} should be atleast ${minLength} chars long.`,
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
      errorMessage: `${param} should be at least 3 chars long.`,
      options: { min: 3 },
    },
    ltrim: { options: [[' ', '']] },
    rtrim: { options: [[' ', '']] },
  }
);

export const validator = {
  login: {
    username: {
      isAlphanumeric: {
        errorMessage: 'Username is invalid.',
      },
      isLength: {
        errorMessage: 'Username should be at least 3 chars long.',
        options: { min: 3 },
      },
    },
    password: {
      isLength: {
        errorMessage: 'Password should be at least 6 chars long.',
        options: { min: 6 },
      },
    },
  },
  signup: {
    firstname: validateNameRule('First name'),
    lastname: validateNameRule('Last name'),
    username: {
      isAlphanumeric: {
        errorMessage: 'Username is invalid',
      },
      isLength: {
        errorMessage: 'Username should be at least 3 chars long.',
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
        errorMessage: 'Phone number is invalid.',
      },
      rtrim: { options: [[' ', '-']] },
    },
    email: {
      errorMessage: 'Provide a valid email address.',
      isEmail: true,
    },
    password: {
      isLength: {
        errorMessage: 'Password should be at least 6 chars long.',
        options: { min: 6 },
      },
      custom: {
        options: (value, { req, param }) => {
          if (value !== req.body.passwordConfirmation) {
            throw new Error("Passwords do not match: 'passwordConfirmation'.");
          }
          return value;
        },
      },
    },
  },
  user: {
    firstname: validateNameRule('First name'),
    lastname: validateNameRule('Last name'),
    othernames: {
      ltrim: { options: [[' ', '']] },
      rtrim: { options: [[' ', '']] },
    },
    phoneNumber: {
      isMobilePhone: {
        errorMessage: 'Phone number is invalid.',
      },
      rtrim: { options: [[' ', '-']] },
    },
  },
  record: {
    location: {
      errorMessage: 'Invalid coordinates value.',
      isLatLong: true,
    },
    title: validateTextRule('Title', 5),
    comment: validateTextRule('Comment', 10),
    media: {
      errorMessage: 'Media collection is required.',
      exists: true,
      isArray: {
        errorMessage: 'Invalid media collection.',
      },
    },
    status: {
      custom: {
        options: (value) => {
          const status = ['draft', 'published', 'under-investigation', 'resolved', 'rejected'];
          if (!status.includes(value)) {
            throw new Error(`Invalid string value: '${value}'. Allowed values: ${status}.`);
          }
          return value;
        },
      },
    },
  },
  recordStatus: {
    status: {
      custom: {
        options: (value) => {
          const status = ['under-investigation', 'resolved', 'rejected'];
          if (!status.includes(value)) {
            throw new Error(`Invalid string value: '${value}'. Allowed values: ${status}.`);
          }
          return value;
        },
      },
    },
  },
};

/**
* Validates request
*
* @param {Request} req Request object
* @param {Response} res Response object
* @param {NextFunction} next call to next middleware
* @returns {Boolean} returns true or false on successful validation
*
*/
export function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(createError(400, '', { errors: errors.array() }));
  }

  return next();
}

/**
* Validates request type param
*
* @param {Request} req Request object
* @param {Response} res Response object
* @param {NextFunction} next call to next middleware
* @returns {NextFunction} returns next()
*
*/
export function validateType(req, res, next) {
  const allowedTypes = ['red-flags', 'interventions'];
  let { params: { type } } = req;

  if (!allowedTypes.includes(type)) {
    return next(createError(404, 'Provided route is invalid.'));
  }

  type = singular(type);
  req.type = type;
  return next();
}

/**
* Validates admin access
*
* @param {Request} req Request object
* @param {Response} res Response object
* @param {NextFunction} next call to next middleware
* @returns {NextFunction} returns next()
*
*/
export const isAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    const message = 'Your account is not authorized to access the requested resource.';
    return next(createError(403, message));
  }
  return next();
};
