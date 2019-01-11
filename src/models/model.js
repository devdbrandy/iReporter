import db from '../config/database';
import { extractParams } from '../utils/helpers';

export default class Model {
  /**
   * Find resource by given id
   *
   * @static
   * @param {string} id resource id
   * @returns {Model} a Model resource
   *
   * @memberOf Model
   */
  static async find(fields) {
    this.showField = true;
    const [row] = await this.where(fields);
    if (!row) return null;
    return new this(row);
  }

  /**
   * Returns a list of resources
   *
   * @static
   * @returns {[Model]} a list of user resources
   *
   * @memberOf Record
   */
  static async all() {
    this.showField = false;
    const queryString = this.selectQuery();
    const { rows } = await db.query(queryString);
    return rows;
  }

  /**
   * Build a select WHERE query on provided fields
   *
   * @static
   * @param {string} query select query
   * @param {string} param values applied
   * @returns {[Model]} a list of model resources
   *
   * @memberOf Model
   */
  static async where(fields) {
    const params = extractParams(fields);
    const values = Object.values(fields);

    const queryString = `${this.selectQuery()} WHERE ${params}`;
    const { rows } = await db.query(queryString, values);
    return rows;
  }

  /**
   * Create and persist a new resource
   *
   * @static
   * @param {Object} data the resource attributes
   * @returns {Model} a Model resource
   *
   * @memberOf Model
   */
  static async create(data) {
    const queryString = this.insertQuery();
    const values = Object.values(data);
    const { rows } = await db.query(queryString, values);
    const [row] = rows;
    return new this(row);
  }

  /**
   * Build insert query based on model fields
   *
   * @static
   * @returns {string}
   *
   * @memberOf Model
   */
  static insertQuery() {
    const params = [];
    const { fields } = this;

    for (let index = 0; index < fields.length; index += 1) {
      params.push(`$${index + 1}`);
    }

    return `INSERT INTO ${this.tableName}(${fields})
      VALUES(${params}) RETURNING *`;
  }

  /**
   * Build select query based on model abstract fields
   *
   * @static
   * @returns {string}
   *
   * @memberOf Model
   */
  static selectQuery() {
    return `
      SELECT ${this.abstractFields}
      FROM ${this.tableName}
    `;
  }

  static get showField() {
    return this.show;
  }

  static set showField(value) {
    this.show = value;
  }

  static addFields() {
    let fields = '';

    if (this.showField) {
      const hiddenFields = this.hidden;
      hiddenFields.forEach((value, key) => {
        if (key === 0 || hiddenFields.length !== (key + 1)) {
          fields += ',';
        }
        fields += value;
      });
    }
    return fields;
  }
}
