import createError from 'http-errors';
import { validationResult } from 'express-validator/check';

/**
 * Retrieves the value of an environment variable
 * or returns a default value
 *
 * @param {string} name the env config variable name
 * @param {any} value a default value
 * @returns {any} the env config value
 *
 */
export const env = (name, value) => (process.env[name] || value);

/**
* Validates request
*
* @param {object} req Request object
* @param {Function} next call to next middleware
* @returns {Boolean} returns true successful validation
*
*/
export function validateRequest(req, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(createError(422, '', { errors: errors.array() }));
  }

  return true;
}
