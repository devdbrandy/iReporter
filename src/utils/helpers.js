import createError from 'http-errors';
import bcrypt from 'bcryptjs';
import appConfig from '../config';

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

/**
 * Generate username from firstname and lastname
 *
 * @static
 * @param {string} firstname user firstname attribute
 * @param {string} lastname user lastname
 * @returns {string} generated username
 */
export function generateUsername(user) {
  return (
    user.lastname.substring(0, 5)
      + user.firstname.substring(0, 3)
      + Math.floor(Math.random() * 10)
  );
}

export const isAuthorized = (user, record) => {
  if (!record.belongsTo(user) && !user.isAdmin) {
    throw createError(403, 'Forbidden');
  }

  if (record.status !== 'draft') throw createError(403, 'Not allowed');

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
