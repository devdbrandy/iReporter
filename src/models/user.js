import bcrypt from 'bcryptjs';
import Model from './model';

const privateProps = new WeakMap();

export default class User extends Model {
  /**
   * Creates an instance of User.
   * @param {object} attributes user attributes
   *
   * @memberOf User
   */
  constructor({
    id,
    firstname,
    lastname,
    othernames,
    phoneNumber,
    username,
    email,
    registered,
    isAdmin,
    password,
  }) {
    super();
    const [attributes] = arguments;
    this.id = id;
    this.firstname = firstname;
    this.lastname = lastname;
    this.othernames = othernames;
    this.phoneNumber = phoneNumber || attributes.phone_number;
    this.email = email;
    this.username = username;
    this.registered = registered || attributes.created_at;
    this.isAdmin = isAdmin || attributes.is_admin;
    privateProps.set(this, { password });
  }

  /**
   * Get password attribute
   *
   * @readonly
   * @memberOf User
   */
  get password() {
    return privateProps.get(this).password;
  }

  static get tableName() {
    return 'users';
  }

  static get fields() {
    return [
      'firstname',
      'lastname',
      'othernames',
      'phone_number',
      'email',
      'username',
      'password',
    ];
  }

  static get hidden() {
    return ['password'];
  }

  static get abstractFields() {
    return `id, firstname, lastname, othernames,
      phone_number as "phoneNumber", email, username,
      created_at as "registered", is_admin as "isAdmin" ${this.addFields()}`;
  }

  static abstractValues(data) {
    const {
      firstname,
      lastname,
      othernames,
      phoneNumber,
      email,
      username,
      password,
    } = data;
    return [
      firstname,
      lastname,
      othernames,
      phoneNumber,
      email,
      username,
      bcrypt.hashSync(password, 10),
    ];
  }
}
