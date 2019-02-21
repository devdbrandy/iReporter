import db from '../config/database';
import { extractParams } from '../helpers/utils';

/**
 * Class representing a model
 *
 * @export
 * @class Model
 */
export default class Model {
  /**
   * Update resource attributes
   *
   * @async
   * @param {Object} data - Attributes to modify
   * @returns {Model} Model resource
   *
   * @memberOf Record
   */
  async update(data) {
    const Model = this.constructor;
    const values = Model.extractValues(data);
    const queryString = Model.updateQuery(data);
    const params = [...values, this.id];
    const { rows } = await db.query(queryString, params);
    const [row] = rows;
    const attributes = Model.mutateData(row);
    return new Model(attributes);
  }

  /**
   * Delete a resource
   *
   * @async
   * @returns {Object} Recently deleted resources
   *
   * @memberOf Model
   */
  async delete() {
    const Model = this.constructor;
    const queryString = `DELETE FROM ${Model.table()} WHERE id=$1 RETURNING *`;
    const { rows } = await db.query(queryString, [this.id]);
    const [row] = rows;
    return row;
  }

  /**
   * Fetch resource by given id
   *
   * @static
   * @async
   * @param {Object} columns - Resource column(s) to filter
   * @returns {Model} Model resource
   *
   * @memberOf Model
   */
  static async find(columns) {
    const Model = this;
    Model.populateHiddenFields = true;
    const [row] = await this.where(columns);
    if (!row) return null;
    return new Model(row);
  }

  /**
   * Fetch a list of resources
   *
   * @static
   * @async
   * @param {Object} options - Query builder options
   * @returns {Array} A list of user resources
   *
   * @memberOf Model
   */
  static async all(options) {
    const Model = this;
    Model.populateHiddenFields = false;
    const queryString = this.selectQuery(options);
    const { rows } = await db.query(queryString);
    return rows;
  }

  /**
   * Build a select WHERE query with provided columns
   *
   * @static
   * @async
   * @param {string} columns - Columns to filter
   * @param {string} order - Controls the direction of the sort `asc` or `desc`
   * @returns {Array} A list of model resources
   *
   * @memberOf Model
   */
  static async where(columns, order = 'asc') {
    const Model = this;
    const params = extractParams(columns);
    const values = Object.values(columns);
    const queryString = `${Model.selectQuery()} WHERE ${params}
      ORDER BY created_at ${order}`;
    const { rows } = await db.query(queryString, values);
    return rows;
  }

  /**
   * Create and persist a new resource
   *
   * @static
   * @async
   * @param {Object} data - The resource attributes
   * @returns {Model} Model resource
   *
   * @memberOf Model
   */
  static async create(data) {
    const Model = this;
    const queryString = Model.insertQuery(data);
    const values = Model.extractValues(data);
    const { rows } = await db.query(queryString, values);
    const [row] = rows;
    const mutated = Model.mutateData(row);
    return new Model(mutated);
  }

  /**
   * Build insert query based on model attributes
   *
   * @static
   * @param {Object} data - The resource attributes
   * @returns {string} Insert query string
   *
   * @memberOf Model
   */
  static insertQuery(data) {
    const Model = this;
    const { attributes } = Model;
    const columns = [];
    const values = [];
    let index = 0;

    Object.keys(data).forEach((key) => {
      const attribute = attributes[key];
      if (attribute) {
        index += 1;
        columns.push(attribute);
        values.push(`$${index}`);
      }
    });

    return `INSERT INTO ${Model.table()}(${columns})
      VALUES(${values}) RETURNING *`;
  }

  /**
   * Build update query based on model attributes
   *
   * @static
   * @param {Object} data - The resource attributes
   * @returns {string} Update query string
   *
   * @memberOf Model
   */
  static updateQuery(data) {
    const Model = this;
    const { attributes } = Model;
    const columns = [];
    let index = 1;

    Object.keys(data).forEach((key) => {
      const attribute = attributes[key];
      if (attribute) {
        columns.push(`${attribute}=$${index}`);
        index += 1;
      }
    });

    return `UPDATE ${Model.table()} SET ${columns}
      WHERE id=$${index} RETURNING *`;
  }

  /**
   * Build select query based on model abstract fields
   *
   * @static
   * @param {Object} options - Query builder options
   * @returns {string} Select query string
   *
   * @memberOf Model
   */
  static selectQuery(options = {}) {
    const Model = this;
    const table = Model.table();
    let select = `SELECT ${Model.abstractFields}`;
    let from = ` FROM ${table}`;
    let query = '';

    // Build query for JOIN clause
    const { join } = options;
    if (join && join.length > 0) {
      const { join: [builder] } = options;
      const { ref, fkey, fields } = builder;
      const joinFields = fields.map(field => (
        `${ref}.${field} as "${builder.as}.${field}"`
      ));

      const abstractFields = Model.abstractFields.map(field => (`${table}.${field}`));
      select = `SELECT ${abstractFields}, ${joinFields}`;
      from += ` INNER JOIN ${ref} ON ${ref}.id = ${table}.${fkey}`;
    }

    // Build query for WHERE clause
    const { where } = options;
    if (where && where.length > 2) {
      const { where: [lOperand, operator, rOperand] } = options;
      from += ` WHERE ${lOperand} ${operator} '${rOperand}'`;
    }

    // Build query for ORDER BY clause
    const { orderBy } = options;
    if (orderBy && orderBy.length > 1) {
      const { orderBy: [column, direction] } = options;
      from += ` ORDER BY ${table}.${column} ${direction}`;
    }

    // Build final query
    query += select;
    query += from;
    return query;
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
    const Model = this;
    const { attributes } = Model;
    const abstract = [];
    Object.entries(attributes).forEach((pairs) => {
      const [key, value] = pairs;
      if (!this.hiddenAttributes().includes(key)) {
        abstract.push(`${value} as "${key}"`);
      }
    });
    return [...abstract, ...(Model.additionalFields())];
  }

  /**
   * Holds all hidden attributes
   *
   * @static
   * @returns {Array} List of all hidden attributes
   *
   * @memberOf Model
   */
  static hiddenAttributes() {
    return [];
  }

  /**
   * Get populating state value
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
   * @param {Object} data - Resource data
   * @returns {Array} List of attibute values
   *
   * @memberOf Model
   */
  static extractValues(data) {
    const Model = this;
    const { attributes } = Model;
    const values = [];
    Object.entries(data).forEach((pairs) => {
      const [key, value] = pairs;
      if (attributes[key]) values.push(value);
    });
    return values;
  }

  /**
   * Mutate data to match model.attributes
   *
   * @static
   * @param {Object} data - Data to mutate
   * @returns {Object} Mutated data
   *
   * @memberOf Model
   */
  static mutateData(data) {
    const Model = this;
    const { attributes } = Model;
    const mutated = {};
    Object.entries(attributes).forEach((pairs) => {
      const [key, param] = pairs;
      mutated[key] = data[param];
    });
    return mutated;
  }
}
