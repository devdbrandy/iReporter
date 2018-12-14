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
    this.createdOn = createdOn;
  }

  belongsTo(user) {
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
  static find(id, type) {
    const queryString = `${Record.selectQuery()} WHERE id=$1 AND type=$2`;

    return new Promise((resolve, reject) => {
      db.queryAsync(queryString, [id, type])
        .then(({ rows }) => {
          const [data] = rows;
          if (!data) throw createError(404, 'Resource not found');
          resolve(new Record(data));
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
  static all(type) {
    const queryString = `${Record.selectQuery()} WHERE type=$1`;
    return new Promise((resolve, reject) => {
      db.queryAsync(queryString, [type])
        .then(({ rows }) => {
          resolve(rows);
        })
        .catch(resolve);
    });
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
  save(type) {
    const queryString = `
      INSERT INTO records(
        user_id, type, location, images, videos, comment
      )
      VALUES($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [
      this.createdBy,
      type,
      this.location,
      this.images,
      this.videos,
      this.comment,
    ];

    return new Promise((resolve, reject) => {
      db.queryAsync(queryString, values)
        .then(({ rows }) => {
          const [record] = rows;
          this.id = record.id;
          this.status = record.status;
          this.createdOn = record.created_at;
          resolve(this);
        })
        .catch(reject);
    });
  }

  /**
   * Update resource attributes
   *
   * @param {object} data attributes to modify
   * @returns {Record} record recource
   *
   * @memberOf Record
   */
  update(data) {
    const field = data.location ? 'location' : 'comment';
    const queryString = `
      UPDATE records SET ${field}=$1
      WHERE id=$2
      RETURNING *
    `;
    const values = [data[field], this.id];

    return new Promise((resolve, reject) => {
      db.queryAsync(queryString, values)
        .then(({ rows }) => {
          const [data] = rows;
          resolve(data);
        })
        .catch(reject);
    });
  }

  delete() {
    const queryString = 'DELETE FROM records WHERE id=$1 RETURNING *';
    return new Promise((resolve, reject) => {
      db.query(queryString, [this.id])
        .then(({ rows }) => {
          const [data] = rows;
          resolve(data);
        })
        .catch(reject);
    });
  }

  static selectQuery() {
    return `
      SELECT id, user_id as "createdBy", type, location, images, videos,
        comment, status, updated_at as "updatedOn", created_at as "createdOn"
      FROM records
    `;
  }
}
