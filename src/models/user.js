import bcrypt from 'bcryptjs';
import createError from 'http-errors';
import db from '../database';
import { generateUsername } from '../utils/helpers';

const privateProps = new WeakMap();

const handlerError = ({ message }) => createError(404, message);

export default class User {
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
    this.id = id;
    this.firstname = firstname;
    this.lastname = lastname;
    this.othernames = othernames;
    this.phoneNumber = phoneNumber;
    this.email = email;
    this.username = username;
    this.registered = registered;
    this.isAdmin = isAdmin;
    privateProps.set(this, { password });
  }

  /**
   * Set generated username to user object
   *
   * @memberOf User
   */
  generateUsername() {
    this.username = generateUsername(this);
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

  /**
   * Persist a new resource
   *
   * @static
   * @param {Object} attributes the resource attributes
   * @returns {User} a User resource
   *
   * @memberOf User
   */
  save() {
    const queryString = `
      INSERT INTO users(
        firstname, lastname, othernames, phone_number, email, username, password
      )
      VALUES($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    // generate username if username is not provided
    if (!this.username) this.generateUsername();

    const values = [
      this.firstname,
      this.lastname,
      this.othernames,
      this.phoneNumber,
      this.email,
      this.username,
      bcrypt.hashSync(this.password, 8),
    ];

    return new Promise((resolve, reject) => {
      db.queryAsync(queryString, values)
        .then(({ rows }) => {
          this.id = rows[0].id;
          this.isAdmin = rows[0].is_admin;
          this.registered = rows[0].created_at;
          resolve(this);
        })
        .catch((error) => {
          if (error.code === '23505' && error.constraint === 'users_email_key') {
            error.message = 'Email address already exists';
          }
          if (error.code === '23505' && error.constraint === 'users_username_key') {
            error.message = 'Username already taken';
          }
          reject(error);
        });
    });
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
    const queryString = User.query();
    return new Promise((resolve, reject) => {
      db.queryAsync(queryString)
        .then(({ rows }) => {
          resolve(rows);
        });
    });
  }

  /**
   * Find resource by given id
   *
   * @static
   * @param {string} id resource id
   * @returns {User} a User resource
   *
   * @memberOf User
   */
  static find(id) {
    const field = Number.isInteger(id) ? 'id' : 'username';
    const queryString = `${User.query('password')} WHERE ${field}=$1`;

    return new Promise((resolve, reject) => {
      db.queryAsync(queryString, [id])
        .then(({ rows }) => {
          const [data] = rows;
          if (!data) throw createError(404, 'Resource not found');
          resolve(new User(data));
        })
        .catch(reject);
    });
  }

  /**
   * Run a select WHERE query on provided param
   *
   * @static
   * @param {string} query select query
   * @param {string} param values applied
   * @returns {[User]} a list of user resources
   *
   * @memberOf User
   */
  static async where(param, value) {
    const queryString = `${User.query()} WHERE ${param}=$1`;
    try {
      const data = await User.select(queryString, value);
      return data;
    } catch (error) {
      throw createError(error.code, error.message);
    }
  }

  /**
   * Run a select query on provided param
   *
   * @static
   * @param {string} query select query
   * @param {string} param values applied
   * @returns {[User]} a list of user resources
   *
   * @memberOf User
   */
  static async select(query, param) {
    try {
      const { rows } = await db.queryAsync(query, [param]);
      return rows;
    } catch (error) {
      throw createError(400, error.message);
    }
  }

  static query(extend) {
    const extended = extend ? `,${extend}` : '';
    return `
      SELECT id, firstname, lastname, othernames,
        phone_number as "phoneNumber", email, username,
        created_at as "registered", is_admin as "isAdmin"
        ${extended}
      FROM users
    `;
  }
}
