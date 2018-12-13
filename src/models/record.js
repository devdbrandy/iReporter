import createError from 'http-errors';
import db from '../database';
import User from './user';

const handlerError = ({ message }) => createError(404, message);

export default class Record {
  /**
  * Creates an instance of Record.
  * @param {object} attributes record attributes
  *
  * @memberOf Record
  */
  constructor({
    id,
    createdBy,
    type,
    location,
    comment,
    images,
    videos,
    status,
    createdOn,
  }) {
    this.id = id;
    this.createdBy = createdBy;
    this.type = type;
    this.location = location;
    this.comment = comment;
    this.images = images;
    this.videos = videos;
    this.status = status;
    this.creadedOn = createdOn;
  }

  belongsTo(user) {
    // console.log(this.createdBy)
    // console.log(user.id);
    return (this.createdBy === user.id);
  }

  /**
   * Run a select query on provided param
   *
   * @static
   * @param {string} query select query
   * @param {string} param values applied
   * @returns {[Record]} a list of record resources
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

  /**
   * Find resource by given id
   *
   * @static
   * @param {string} id resource id
   * @returns {Record} a Record resource
   *
   * @memberOf Record
   */
  static async find(id) {
    const queryString = `${Record.selectQuery()} WHERE id=$1`;
    const data = await User.select(queryString, id);

    if (!data[0]) throw createError(404, 'Resource not found');

    return new Record(data[0]);
  }

  /**
   * Run a select WHERE query on provided param
   *
   * @static
   * @param {string} query select query
   * @param {string} param values applied
   * @returns {[User]} a list of record resources
   *
   * @memberOf Record
   */
  static async where(param, value) {
    const queryString = `${Record.selectQuery()} WHERE ${param}=$1`;
    try {
      const data = await Record.select(queryString, value);
      return data;
    } catch (error) {
      throw createError(error.code, error.message);
    }
  }

  /**
   * Returns a list of user resources
   *
   * @static
   * @returns {[Record]} a list of user resources
   *
   * @memberOf Record
   */
  static async all() {
    try {
      const { rows } = await db.queryAsync(Record.selectQuery());
      return rows;
    } catch (error) {
      throw createError(400, error.message);
    }
  }

  /**
   * Persist a new resource
   *
   * @static
   * @param {Object} attributes the resource attributes
   * @returns {Record} a Record resource
   *
   * @memberOf Record
   */
  async save(attributes) {
    const queryString = `
      INSERT INTO records(
        user_id, type, location, images, videos, comment
      )
      VALUES($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [
      this.createdBy,
      this.type,
      this.location,
      this.images,
      this.videos,
      this.comment,
    ];

    try {
      const { rows } = await db.queryAsync(queryString, values);
      this.id = rows[0].id;
      return this;
    } catch (error) {
      throw handlerError(error);
    }
  }

  /**
   * Update resource attributes
   *
   * @param {object} data attributes to modify
   * @returns {Record} record recource
   *
   * @memberOf Record
   */
  async update(data) {
    const field = data.location ? 'location' : 'comment';
    const queryString = `
      UPDATE records SET ${field}=$1
      WHERE id=$2
      RETURNING *
    `;
    const values = [data[field], this.id];

    try {
      const { rows } = await db.queryAsync(queryString, values);
      return new Record(rows[0]);
    } catch (error) {
      throw handlerError(error);
    }
  }

  async delete() {
    const queryString = 'DELETE FROM records WHERE id=$1 RETURNING *';

    try {
      await db.query(queryString, [this.id]);
      return this.id;
    } catch (error) {
      throw handlerError(error);
    }
  }

  static selectQuery() {
    return `
      SELECT id, user_id as "createdBy", type, location, images, videos,
        comment, status, updated_at as "updatedOn", created_at as "createdOn"
      FROM records
    `;
  }
}
