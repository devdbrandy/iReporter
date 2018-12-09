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

export default {};
