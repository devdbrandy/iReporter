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
 * Extract file extension from a given filename
 *
 * @export
 * @param {String} filename the name of the file
 * @returns {String} file extension
 */
export const getFileExtension = (filename) => {
  const extIndex = filename.lastIndexOf('.');
  return filename.substring(extIndex + 1);
};

export default {};
