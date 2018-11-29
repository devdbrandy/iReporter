import mocker from 'mocker-data-generator';

const User = {
  id: { incrementalId: 1 },
  firstname: { faker: 'name.firstName' },
  lastname: { faker: 'name.lastName' },
  othernames: { faker: 'name.firstName' },
  email: { faker: 'internet.email' },
  phoneNumber: { faker: 'phone.phoneNumberFormat' },
  username: {
    function: function generateUsername() {
      return (
        this.object.lastname.substring(0, 5)
          + this.object.firstname.substring(0, 3)
          + Math.floor(Math.random() * 10)
      );
    },
  },
  registered: { faker: 'date.past' },
  isAdmin: {
    function: function randomRole() {
      return this.faker.random.arrayElement(['true', 'false']);
    },
  },
};

const Incident = {
  id: { incrementalId: 1 },
  createdOn: { faker: 'date.past' },
  createdBy: {
    hasOne: 'user',
    get: 'id',
  },
  type: {
    function: function randomRole() {
      return this.faker.random.arrayElement(['red-flag', 'intervention']);
    },
  },
  longitude: {
    faker: 'address.longitude',
  },
  location: {
    function: function cordinates() {
      return (
        `${this.faker.address.latitude()},${this.faker.address.longitude()}`
      );
    },
  },
  status: {
    function: function randomRole() {
      return this.faker.random.arrayElement([
        'draft', 'under investigation', 'resolved', 'rejected',
      ]);
    },
  },
  img: { faker: 'image.imageUrl' },
  images: { static: ['https://via.placeholder.com/650x450', 'https://via.placeholder.com/650x450'] },
  vidoes: { static: ['https://res.cloudinary.com/devdb/video/upload/v1543497333/sample/video.flv', 'https://res.cloudinary.com/devdb/video/upload/v1543497333/sample/video.flv'] },
  comment: { faker: 'lorem.paragraph' },
};

const storage = {};
mocker()
  .schema('user', User, 2)
  .schema('incident', Incident, 3)
  .build((error, data) => {
    storage.users = data.user;
    storage.incidents = data.incident;
  });

export default storage;
