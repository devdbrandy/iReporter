import db from '../config/database';
import Model from './model';

export default class Record extends Model {
  /**
  * Creates an instance of Record.
  * @param {Object} attributes record attributes
  *
  * @memberOf Record
  */
  constructor(attributes) {
    super();
    this.id = attributes.id;
    this.createdBy = attributes.createdBy;
    this.type = attributes.type;
    this.location = attributes.location;
    this.title = attributes.title;
    this.comment = attributes.comment;
    this.images = attributes.images;
    this.videos = attributes.videos;
    this.status = attributes.status;
    this.createdOn = attributes.createdOn;
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
    return ['user_id', 'type', 'location', 'images', 'videos', 'title', 'comment'];
  }

  static get abstractFields() {
    return `
      id, user_id as "createdBy", type, location, images, videos, title,
      comment, status, updated_at as "updatedOn", created_at as "createdOn"
    `;
  }
}
