import { NextFunction } from 'express';
import createError from 'http-errors';
import bcrypt from 'bcryptjs';
import appConfig from '../config';
import { User, Record } from '../models';

/**
 * Gets the value of a configuration variable
 *
 * @param {String} token the key:value to return
 * @param {(String|Number|Boolean)} defValue a default value
 * @returns {(String|Number|Boolean)} the value of the configuration var
 */
export function config(token, defValue) {
  const [key, value] = token.split(':', 2);
  return appConfig[key][value] || defValue;
}

/**
 * Determines if the user can modify a given `record` resource
 *
 * @param {User} user User object
 * @param {Record} record Record object
 * @returns {(Boolean|Error)} returns true if authorized
 */
export const isAuthorized = (user, record) => {
  if (
    (!record.belongsTo(user) && !user.isAdmin)
    || (!user.isAdmin && record.status !== 'draft' && record.status !== 'published')
  ) {
    throw createError(403, 'Forbidden');
  }

  return true;
};

/**
 * Determines if the user is valid
 *
 * @param {User} user User object
 * @param {String} password provided password to validate against
 * @returns {Boolean} returns truthy based on validation
 */
export const isValidUser = (user, password) => bcrypt.compareSync(password, user.password);

export const responseHandler = (response, data, status = 200) => {
  response.status(status)
    .json({
      status,
      data,
    });
};

/**
 * Extract and build params fields inline with WHERE query
 *
 * @param {Object} fields model field params
 * @returns {Array} sorted list of params
 */
export const extractParams = (fields) => {
  const keys = Object.keys(fields);
  let params = '';

  for (let index = 0; index < keys.length; index += 1) {
    const currentIndex = keys[index];
    const keyIndex = index + 1;
    params += `${currentIndex}=$${keyIndex}`;
    if (keyIndex !== keys.length) params += ' AND ';
  }

  return params;
};

/**
 * Validate existing user by email or username
 *
 * @export
 * @param {Object} param User email or username
 * @returns {Boolean} Truthy dependant on user existance
 */
export const alreadyTaken = async (param) => {
  const user = await User.find(param);
  return user;
};

/**
 * Handle conflict error response
 *
 * @param {String} param field parameter to respond with
 * @param {NextFunction} next error response
 */
export const handleConflictResponse = (param, next) => {
  next(createError(409, `${param} already taken. Try another.`));
};
