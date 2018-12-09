import db from '../database';

export default class Record {
  /**
  * Creates an instance of Record.
  * @param {object} attributes record attributes
  *
  * @memberOf Record
  */
  constructor({
    createdBy,
    type,
    location,
    comment,
    images,
    videos,
  }) {
    Record.incrementCount();
    this.id = Record.count;
    this.creadedOn = Date();
    this.createdBy = createdBy;
    this.type = type;
    this.location = location;
    this.comment = comment;
    this.images = images;
    this.videos = videos;
    this.status = 'draft';
  }

  /**
   * Returns a list of user resources
   *
   * @static
   * @returns {[Record]} a list of user resources
   *
   * @memberOf Record
   */
  static all() {
    return Record.table;
  }

  /**
   * Find resource by given id
   *
   * @static
   * @param {string} id resource identity number
   * @returns {Record} a Record resource
   *
   * @memberOf Record
   */
  static find(id) {
    return Record.table.find(record => record.id === id);
  }

  /**
   * Create a new resource
   *
   * @static
   * @param {Object} attributes the resource attributes
   * @returns {Record} a Record resource
   *
   * @memberOf Record
   */
  static create(attributes) {
    const record = new Record(attributes);
    Record.table.push(record);
    return record;
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
    if (this.status === 'draft') {
      if (data.location) {
        this.location = data.location || this.location;
      } else {
        this.comment = data.comment || this.comment;
        this.type = data.type || this.type;
        this.images = data.images || this.images;
        this.videos = data.videos || this.videos;
      }
    }

    return this;
  }

  toString() {
    return {
      id: this.id,
      createdOn: this.createdOn,
      type: this.type,
      location: this.location,
      comment: this.comment,
      images: this.images,
      videos: this.videos,
      status: this.status,
    };
  }

  static incrementCount() {
    Record.count += 1;
  }

  /**
   * Reset records table
   *
   * @static
   * @memberOf Record
   */
  static resetTable() {
    Record.table = [];
    Record.count = 0;
  }
}

Record.table = db.records;
Record.count = 0;
