import createError from 'http-errors';
import db from '../config/database';
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
   * Update resource attributes
   *
   * @param {object} data attributes to modify
   * @returns {Record} record recource
   *
   * @memberOf Record
   */
  async update(data) {
    const [field, param] = Object.entries(data)[0];
    // const field = data.location ? 'location' : 'comment';
    const queryString = `
      UPDATE records SET ${field}=$1
      WHERE id=$2
      RETURNING *
    `;
    const values = [param, this.id];
    const { rows } = await db.query(queryString, values);
    const [record] = rows;
    return record;
  }

  async delete() {
    const queryString = 'DELETE FROM records WHERE id=$1 RETURNING *';
    const { rows } = await db.query(queryString, [this.id]);
    const [row] = rows;
    return row;
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
    const queryString = `${this.selectQuery()}`;
    const { rows } = await db.query(queryString);
    return rows;
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
  static async find(fields) {
    const keys = Object.keys(fields);
    const values = Object.values(fields);
    let params = '';

    for (let index = 0; index < keys.length; index += 1) {
      const currentIndex = keys[index];
      const keyIndex = index + 1;
      params += `${currentIndex}=$${keyIndex}`;
      if (keyIndex !== keys.length) params += ' AND ';
    }

    const queryString = `${this.selectQuery()} WHERE ${params}`;
    const { rows: [record] } = await db.query(queryString, values);

    if (!record) return null;
    return new this(record);
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
  static async where(fields) {
    const keys = Object.keys(fields);
    const values = Object.values(fields);
    let params = '';

    for (let index = 0; index < keys.length; index += 1) {
      const currentIndex = keys[index];
      const keyIndex = index + 1;
      params += `${currentIndex}=$${keyIndex}`;
      if (keyIndex !== keys.length) params += ' AND ';
    }

    const queryString = `${this.selectQuery()} WHERE ${params}`;
    const { rows } = await db.query(queryString, values);
    return rows;
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
  static async create(data) {
    const queryString = `
      INSERT INTO records(
        user_id, type, location, images, videos, comment
      )
      VALUES($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    const {
      createdBy,
      type,
      location,
      images,
      videos,
      comment,
    } = data;
    const values = [createdBy, type, location, images, videos, comment];
    const { rows } = await db.query(queryString, values);
    const [record] = rows;
    return record;
  }

  static selectQuery() {
    return `
      SELECT id, user_id as "createdBy", type, location, images, videos,
        comment, status, updated_at as "updatedOn", created_at as "createdOn"
      FROM records
    `;
  }
}
