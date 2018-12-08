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

export default {};
