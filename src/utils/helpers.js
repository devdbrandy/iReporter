import createError from 'http-errors';
import bcrypt from 'bcryptjs';
import appConfig from '../config';
import { User } from '../models';

/**
 * Gets the value of a configuration variable
 *
 * @param {string} token the key:value to return
 * @param {any} defValue a default value
 * @returns {any} the value of the configuration var
 */
export function config(token, defValue) {
  const [key, value] = token.split(':', 2);
  return appConfig[key][value] || defValue;
}

export const isAuthorized = (user, record) => {
  if (
    (!record.belongsTo(user) && !user.isAdmin)
    || (!user.isAdmin && record.status !== 'draft')
  ) {
    throw createError(403, 'Forbidden');
  }

  return true;
};

/**
 * Determines if the user is valid
 *
 * @param {User} user User object
 * @param {string} password provided password to validate against
 * @returns {boolean} returns truthy based on validation
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
export async function alreadyTaken(param) {
  const user = await User.find(param);
  return user;
}
