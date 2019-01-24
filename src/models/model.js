import db from '../config/database';
import { extractParams } from '../utils/helpers';

export default class Model {
  /**
   * Update resource attributes
   *
   * @param {Object} data Attributes to modify
   * @returns {Model} Model resource
   *
   * @memberOf Record
   */
  async update(data) {
    const values = this.constructor.getValues(data);
    const queryString = this.constructor.updateQuery(data);
    const params = [...values, this.id];
    const { rows } = await db.query(queryString, params);
    const [record] = rows;
    return record;
  }

  /**
   * Delete a resource
   *
   * @returns {Object} Recently deleted resources
   *
   * @memberOf Model
   */
  async delete() {
    const queryString = `DELETE FROM ${this.constructor.table()} WHERE id=$1 RETURNING *`;
    const { rows } = await db.query(queryString, [this.id]);
    const [row] = rows;
    return row;
  }

  /**
   * Fetch resource by given id
   *
   * @static
   * @param {String} id resource id
   * @returns {Model} a Model resource
   *
   * @memberOf Model
   */
  static async find(fields) {
    this.populateHiddenFields = true;
    const [row] = await this.where(fields);
    if (!row) return null;
    return new this(row);
  }

  /**
   * Fetch a list of resources
   *
   * @static
   * @param {Object} options builder options
   * @returns {[Model]} a list of user resources
   *
   * @memberOf Record
   */
  static async all(options) {
    this.populateHiddenFields = false;
    const queryString = this.selectQuery(options);
    const { rows } = await db.query(queryString);
    return rows;
  }

  /**
   * Build a select WHERE query on provided fields
   *
   * @static
   * @param {String} query select query
   * @param {String} param values applied
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
    const queryString = this.insertQuery(data);
    const values = this.getValues(data);
    const { rows } = await db.query(queryString, values);
    const [row] = rows;
    const mutated = this.mutateData(row);
    return new this(mutated);
  }

  /**
   * Build insert query based on model attributes
   *
   * @static
   * @param {Object} data the resource attributes
   * @returns {String}
   *
   * @memberOf Model
   */
  static insertQuery(data) {
    const { attributes } = this;
    const fields = [];
    const params = [];
    let index = 0;

    Object.keys(data).forEach((key) => {
      const attribute = attributes[key];
      if (attribute) {
        index += 1;
        fields.push(attribute);
        params.push(`$${index}`);
      }
    });

    return `INSERT INTO ${this.table()}(${fields})
      VALUES(${params}) RETURNING *`;
  }

  /**
   * Build update query based on model attributes
   *
   * @static
   * @param {Object} data the resource attributes
   * @returns {String}
   *
   * @memberOf Model
   */
  static updateQuery(data) {
    const { attributes } = this;
    const fields = [];
    let index = 1;

    Object.keys(data).forEach((key) => {
      const attribute = attributes[key];
      if (attribute) {
        fields.push(`${attribute}=$${index}`);
        index += 1;
      }
    });

    return `UPDATE ${this.table()} SET ${fields}
      WHERE id=$${index} RETURNING *`;
  }

  /**
   * Build select query based on model abstract fields
   *
   * @static
   * @param {Object} options builder options
   * @returns {String}
   *
   * @memberOf Model
   */
  static selectQuery(options = {}) {
    const table = this.table();
    if ('join' in options) {
      const { join: [builder] } = options;
      const { ref, fkey, fields } = builder;
      const joinFields = fields.map(field => (
        `${ref}.${field} as "${builder.as}.${field}"`
      ));

      const abstractFields = this.abstractFields.map(field => (`${table}.${field}`));
      return `
        SELECT ${abstractFields}, ${joinFields}
        FROM ${table}
        INNER JOIN ${ref} ON ${ref}.id = ${table}.${fkey}
      `;
    }
    return `SELECT ${this.abstractFields} FROM ${table}`;
  }

  /**
   * Abstract attributes fields from model attributes
   *
   * @readonly
   * @static
   *
   * @memberOf Model
   */
  static get abstractFields() {
    const abstract = [];
    const { attributes } = this;
    Object.entries(attributes).forEach((pairs) => {
      const [key, value] = pairs;
      if (!this.hiddenAttributes().includes(key)) {
        abstract.push(`${value} as "${key}"`);
      }
    });
    return [...abstract, ...this.additionalFields()];
  }

  /**
   * Holds all hidden attributes
   *
   * @static
   * @returns {Array} A list of all hidden attributes
   *
   * @memberOf Model
   */
  static hiddenAttributes() {
    return [];
  }

  /**
   * Get populating state for hidden fields
   *
   * @readonly
   * @static
   *
   * @memberOf Model
   */
  static get populateHiddenFields() {
    return this.populateHidden;
  }

  /**
   * Switch populating state for hidden fields
   *
   * @static
   *
   * @memberOf Model
   */
  static set populateHiddenFields(value) {
    this.populateHidden = value;
  }

  /**
   * Populate additional attributes [hidden] to model fields
   *
   * @static
   * @returns {Array} List of hidden fields
   *
   * @memberOf Model
   */
  static additionalFields() {
    if (this.populateHiddenFields) {
      return this.hiddenAttributes();
    }
    return [];
  }

  /**
   * Extract valid values from data provided
   *
   * @static
   * @param {Object} data Resource data
   * @returns {Array} List of attibute values
   *
   * @memberOf Model
   */
  static getValues(data) {
    const values = [];
    Object.entries(data).forEach((pairs) => {
      const { attributes } = this;
      const [key, value] = pairs;
      if (attributes[key]) values.push(value);
    });
    return values;
  }

  /**
   * Mutate data to match model.attributes
   *
   * @static
   * @param {Object} data Data from database
   * @returns {Object} Mutated data
   *
   * @memberOf Model
   */
  static mutateData(data) {
    const { attributes } = this;
    const mutated = {};
    Object.entries(attributes).forEach((pairs) => {
      const [key, param] = pairs;
      mutated[key] = data[param];
    });
    return mutated;
  }
}
