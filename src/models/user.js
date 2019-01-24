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

  /**
   * Get the model table name
   *
   * @static
   * @returns {String} model table name
   *
   * @memberOf User
   */
  static table() {
    return 'users';
  }

  /**
   * Get model attributes with their custom name
   *
   * @readonly
   * @static
   *
   * @memberOf User
   */
  static get attributes() {
    return {
      id: 'id',
      firstname: 'firstname',
      lastname: 'lastname',
      othernames: 'othernames',
      phoneNumber: 'phone_number',
      email: 'email',
      username: 'username',
      password: 'password',
      registered: 'created_at',
      isAdmin: 'is_admin',
    };
  }

  /**
  * Hidden attributes
  *
  * @static
  * @returns {Array} A list of all hidden attributes
  *
  * @memberOf User
  */
  static hiddenAttributes() {
    return ['password'];
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
