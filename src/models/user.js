import bcrypt from 'bcryptjs';
import { Model } from './index';

const privateProps = new WeakMap();

/**
 * Class representing user model
 *
 * @export
 * @class User
 * @extends {Model}
 */
export default class User extends Model {
  /**
   * Creates an instance of User.
   * @param {Object} attributes - User attributes
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
    this.gender = attributes.gender;
    this.avatar = attributes.avatar;
    this.bio = attributes.bio;
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
   * @returns {String} Model table name
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
      gender: 'gender',
      avatar: 'avatar',
      bio: 'bio',
    };
  }

  /**
  * Hidden attributes
  *
  * @static
  * @returns {Array} List of all hidden attributes
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
   * @async
   * @param {Object} data - The resource attributes
   * @returns {User} User resource
   *
   * @memberOf User
   */
  static async create(data) {
    const userData = Object.assign({}, data);
    userData.password = bcrypt.hashSync(data.password, 10);
    return super.create(userData);
  }
}
