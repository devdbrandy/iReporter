export const authValidator = {
  username: {
    in: ['body'],
    errorMessage: 'Username is required',
    rtrim: [[' ', '-']],
  },
  password: {
    isLength: {
      errorMessage: 'Password should be at least 7 chars long',
      options: { min: 7 },
    },
  },
};

export default {};
