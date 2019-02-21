import { NextFunction } from 'express';
import createError from 'http-errors';
import bcrypt from 'bcryptjs';
import appConfig from '../config';
import { User, Record } from '../models';

/** Bootstrap Console */
export const logger = console;

/**
 * Gets the value of a configuration variable
 *
 * @param {string} token - The key:value to return
 * @param {(string|number|boolean)} defValue - A default value
 * @returns {(string|number|boolean)} The value of the configuration var
 */
export function config(token, defValue) {
  const [key, value] = token.split(':', 2);
  return appConfig[key][value] || defValue;
}

/**
 * Determines if the user can modify a given `record` resource
 *
 * @param {User} user - User object
 * @param {Record} record - Record object
 * @returns {(boolean|Error)} returns true if authorized
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
 * @param {User} user - User object
 * @param {string} password - The user password to validate against
 * @returns {boolean} returns truthy based on validation
 */
export const isValidUser = (user, password) => bcrypt.compareSync(password, user.password);

export const responseHandler = (response, data, status = 200) => {
  response
    .status(status)
    .json({ status, data });
};

/**
 * Extract and build params fields inline with WHERE query
 *
 * @param {Object} fields - The model attributes params
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
 * @param {Object} param - User email or username
 * @returns {boolean} Truthy dependant on user existance
 */
export const alreadyTaken = async (param) => {
  const user = await User.find(param);
  return user;
};

/**
 * Handle conflict error response
 *
 * @param {string} param - The field parameter to respond with
 * @param {NextFunction} next error response
 */
export const handleConflictResponse = (param, next) => {
  next(createError(409, `${param} already taken. Try another.`));
};
