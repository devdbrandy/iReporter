import express from 'express';
import { User, Record } from './index';

const app = express();
const dbStorage = {
  users: [
    new User({
      firstname: 'Dana',
      lastname: 'Russel',
      othernames: 'Louvenia',
      email: 'Ruth57@yahoo.com',
      phoneNumber: '441-955-1086',
      username: 'RusseDan4',
      registered: '2017-11-30T12:19:06.208Z',
      password: 'secret',
    }),
  ],
  records: [
    new Record({
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
    }),
    new Record({
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
    }),
  ],
};

const adminUser = new User({
  firstname: 'Johnny',
  lastname: 'Bravo',
  othernames: 'Afro',
  email: 'johnnyboi@yahoo.com',
  phoneNumber: '615-955-1086',
  username: 'johnnyboi',
  registered: '2017-11-30T12:19:06.208Z',
  password: 'secret',
});

User.assignAdmin(adminUser);
dbStorage.users.push(adminUser);

export default dbStorage;
