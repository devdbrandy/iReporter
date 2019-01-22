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
  constructor(attributes) {
    super();
    this.id = attributes.id;
    this.firstname = attributes.firstname;
    this.lastname = attributes.lastname;
    this.othernames = attributes.othernames;
    this.phoneNumber = attributes.phoneNumber;
    this.email = attributes.email;
    this.username = attributes.username;
    this.registered = attributes.registered;
    this.isAdmin = attributes.isAdmin;
    privateProps.set(this, {
      password: attributes.password,
    });
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

  /**
   * Create and persist a new resource
   *
   * @static
   * @param {Object} data the resource attributes
   * @returns {Model} a User resource
   *
   * @memberOf User
   */
  static async create(data) {
    const userData = Object.assign({}, data);
    userData.password = bcrypt.hashSync(data.password, 10);
    return super.create(userData);
  }
}