import bcrypt from 'bcryptjs';
import db from '../database';

const privateProps = new WeakMap();

export default class User {
  /**
   * Creates an instance of User.
   * @param {object} attributes user attributes
   *
   * @memberOf User
   */
  constructor({
    firstname,
    lastname,
    othernames,
    email,
    phoneNumber,
    password,
  }) {
    User.incrementCount();
    this.id = User.count;
    this.firstname = firstname;
    this.lastname = lastname;
    this.othernames = othernames;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.registered = Date();
    this.isAdmin = false;
    privateProps.set(this, { password: bcrypt.hashSync(password, 8) });
    this.generateUsername();
  }

  /**
   * Set generated username to user object
   *
   * @memberOf User
   */
  generateUsername() {
    this.username = User.genUsername(this.firstname, this.lastname);
  }

  /**
   * Get user password
   *
   * @readonly
   * @memberOf User
   */
  get password() {
    return privateProps.get(this).password;
  }

  toString() {
    return {
      id: this.id,
      firstname: this.firstname,
      lastname: this.lastname,
      othernames: this.othernames,
      username: this.username,
      email: this.email,
      phoneNumber: this.phoneNumber,
      registered: this.registered,
      isAdmin: privateProps.get(this).isAdmin,
    };
  }

  /**
   * Generate username from firstname and lastname
   *
   * @static
   * @param {string} firstname user firstname attribute
   * @param {string} lastname user lastname
   * @returns {string} generated username
   *
   * @memberOf User
   */
  static genUsername(firstname, lastname) {
    return (
      lastname.substring(0, 5)
        + firstname.substring(0, 3)
        + Math.floor(Math.random() * 10)
    );
  }

  /**
   * Returns a list of user resources
   *
   * @static
   * @returns {[User]} a list of user resources
   *
   * @memberOf User
   */
  static all() {
    return User.table;
  }

  /**
   * Find resource by given id
   *
   * @static
   * @param {string} id resource identity number
   * @returns {User} a User resource
   *
   * @memberOf User
   */
  static find(id) {
    return User.table.find(user => user.id === id);
  }

  /**
   * Find resource by given username
   *
   * @static
   * @param {string} username resource username
   * @returns {User} a User resource
   *
   * @memberOf User
   */
  static findByUsername(username) {
    return User.table.find(user => user.username === username);
  }

  /**
   * Create a new resource
   *
   * @static
   * @param {Object} attributes the resource attributes
   * @returns {User} a User resource
   *
   * @memberOf User
   */
  static create(attributes) {
    const user = new User(attributes);
    User.table.push(user);
    return user;
  }

  /**
   * Assign admin privilege to user resource
   *
   * @static
   * @param {User} user user object
   *
   * @memberOf User
   */
  static assignAdmin(user) {
    const userObject = User.find(user.id);
    userObject.isAdmin = true;
  }

  static incrementCount() {
    User.count += 1;
  }

  /**
  * Reset users table
  *
  * @static
  * @memberOf Record
  */
  static resetTable() {
    User.table = [];
    User.count = 0;
  }
}

User.table = db.users;
User.count = User.table.length;
