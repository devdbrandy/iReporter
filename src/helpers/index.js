export const env = (name, value) => {
  return process.env[name] ? process.env[name] : value;
};

export default {};
