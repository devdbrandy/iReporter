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
  * Get table name for the model
  *
  * @static
  * @returns {String} Model table name
  *
  * @memberOf Record
  */
  static table() {
    return 'records';
  }

  /**
  * Get model attributes with their custom name
  *
  * @readonly
  * @static
  *
  * @memberOf Record
  */
  static get attributes() {
    return {
      id: 'id',
      createdBy: 'user_id',
      type: 'type',
      location: 'location',
      images: 'images',
      videos: 'videos',
      title: 'title',
      comment: 'comment',
      status: 'status',
    };
  }
}
