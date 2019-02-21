import { Model, User } from './index';

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
   * @param {User} user - User object
   * @returns {boolean} True or False upon validation
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
  * @returns {string} Model table name
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
      createdOn: 'created_at',
    };
  }

  /**
   * Fetch a list of record resources
   *
   * @static
   * @override
   * @param {Object} options - Query builder options
   * @returns {Record[]} A list of user resources
   *
   * @memberOf Model
   */
  static async all(options) {
    const rows = await super.all(options);
    const records = this.collect(rows);
    return records;
  }

  /**
   * Deeply collect and organize data key:value pair
   *
   * @static
   * @param {Array} rows - List of records
   * @returns {Record[]} The newly collected data
   *
   * @memberOf Record
   */
  static collect(rows) {
    const records = rows.map((row) => {
      const record = {};
      const deepValues = {};

      Object.entries(row).forEach((pairs) => {
        const [key, value] = pairs;
        if (key.includes('.')) {
          const [outerKey, innerKey] = key.split('.');
          deepValues[innerKey] = value;
          record[outerKey] = deepValues;
        } else record[key] = value;
      });
      return record;
    });
    return records;
  }
}
