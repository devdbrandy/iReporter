const validator = {
  auth: {
    username: {
      in: ['body'],
      errorMessage: 'Username is required',
      rtrim: { options: [[' ', '-']] },
    },
    password: {
      isLength: {
        errorMessage: 'Password should be at least 7 chars long',
        options: { min: 6 },
      },
    },
  },
  user: {
    firstname: {
      isLength: {
        errorMessage: 'Firstname is invalid',
        options: { min: 2 },
      },
      rtrim: { options: [[' ', '-']] },
    },
    lastname: {
      isLength: {
        errorMessage: 'Lastname is invalid',
        options: { min: 2 },
      },
      rtrim: { options: [[' ', '-']] },
    },
    email: {
      errorMessage: 'Provide a valid email address',
      isEmail: true,
    },
    password: {
      isLength: {
        errorMessage: 'Password should be at least 7 chars long',
        options: { min: 6 },
      },
    },
  },
  record: {
    location: {
      errorMessage: 'Invalid coordinates',
      isLatLong: true,
    },
    comment: {
      isLength: {
        errorMessage: 'Comment should be atleast 10 chars long',
        options: { min: 10 },
      },
    },
  },
};

export default validator;
