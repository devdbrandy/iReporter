// import { User, Record } from './index';

// const password = '$2a$10$6bWcliaMM5VrKrkuWXvbq.BGQkb.ZUZ77JxrYkvyaP72Z5gipIyju'; // secret
const mock = {
  users: [
    {
      // id: 1,
      firstname: 'Johnny',
      lastname: 'Bravo',
      othernames: 'Afro',
      email: 'johnnyboi@yahoo.com',
      phoneNumber: '615-955-1086',
      username: 'johnnyboi',
      registered: '2017-11-30T12:19:06.208Z',
      password: 'secret',
    },
    {
      // id: 2,
      firstname: 'Dana',
      lastname: 'Russel',
      othernames: 'Louvenia',
      email: 'ruth57@yahoo.com',
      phoneNumber: '441-955-1086',
      username: 'RusseDan4',
      registered: '2017-11-30T12:19:06.208Z',
      password: 'secret',
    },
  ],
  records: [
    {
      type: 'intervention',
      location: '-42.7871,138.0694',
      images: [
        'https://via.placeholder.com/650x450',
        'https://via.placeholder.com/650x450',
      ],
      video: [
        'https://res.cloudinary.com/devdb/video/upload/v1543497333/sample/video.flv',
        'https://res.cloudinary.com/devdb/video/upload/v1543497333/sample/video.flv',
      ],
      comment: 'Temporibus dolores nobis nisi sapiente modi qui corrupti cum fuga. Est omnis nostrum in. Quis quo corrupti.',
      createdOn: Date(),
      createdBy: 1,
    },
    {
      type: 'red-flag',
      location: '-88.6823,-125.3144',
      images: [
        'https://via.placeholder.com/650x450',
        'https://via.placeholder.com/650x450',
      ],
      video: [
        'https://res.cloudinary.com/devdb/video/upload/v1543497333/sample/video.flv',
        'https://res.cloudinary.com/devdb/video/upload/v1543497333/sample/video.flv',
      ],
      comment: 'Delectus aliquam deleniti iure beatae quis. Ratione velit perspiciatis blanditiis',
      createdOn: Date(),
      createdBy: 1,
    },
  ],
};

export default mock;
