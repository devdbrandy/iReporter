/**
 * Retrieves the value of an environment config variable
 *
 * @param {string} name - The ENV config variable name
 * @param {(string|number|boolean)} value - A default value if config var is not set
 * @returns {(string|number|boolean)} The ENV config value
 *
 */
export const env = (name, value) => (process.env[name] || value);

export default {};
