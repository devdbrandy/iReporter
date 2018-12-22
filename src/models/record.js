import db from '../config/database';
import Model from './model';

export default class Record extends Model {
  /**
  * Creates an instance of Record.
  * @param {Object} attributes record attributes
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
    super();
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

  /**
   * Checks if the resource belongs to the provided user
   *
   * @param {Object} user User object
   * @returns {Boolean}
   *
   * @memberOf Record
   */
  belongsTo(user) {
    return (this.createdBy === user.id);
  }

  /**
   * Update resource attributes
   *
   * @param {object} data attributes to modify
   * @returns {Model} model recource
   *
   * @memberOf Record
   */
  async update(data) {
    const [field, param] = Object.entries(data)[0];
    const queryString = `UPDATE ${Record.tableName} SET ${field}=$1
      WHERE id=$2 RETURNING *`;

    const values = [param, this.id];
    const { rows } = await db.query(queryString, values);
    const [record] = rows;
    return record;
  }

  async delete() {
    const queryString = `DELETE FROM ${Record.tableName} WHERE id=$1 RETURNING *`;
    const { rows } = await db.query(queryString, [this.id]);
    const [row] = rows;
    return row;
  }

  static get tableName() {
    return 'records';
  }

  static get fields() {
    return ['user_id', 'type', 'location', 'images', 'videos', 'comment'];
  }

  static get abstractFields() {
    return `
      id, user_id as "createdBy", type, location, images, videos,
      comment, status, updated_at as "updatedOn", created_at as "createdOn"
    `;
  }

  static abstractValues(data) {
    const {
      createdBy,
      type,
      location,
      images,
      videos,
      comment,
    } = data;
    return [createdBy, type, location, images, videos, comment];
  }
}
