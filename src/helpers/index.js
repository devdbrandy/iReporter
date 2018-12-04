export const env = (name, value) => (
  process.env[name] ? process.env[name] : value
);

export default {};
