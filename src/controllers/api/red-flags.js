import { Record } from '../../models';
import { isAuthorized, responseHandler } from '../../utils/helpers';

export default class RedFlagsController {
  /**
   * Fetch all red-flag records
   *
   * @static
   * @param {Object} request Request object
   * @param {Object} response Response object
   * @param {Function} next Call to next middleware
   *
   * @memberOf RedFlagsController
   */
  static async index(request, response, next) {
    try {
      const records = await Record.all();
      return responseHandler(response, records);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Fetch a specific red-flag record
   *
   * @static
   * @param {Object} request Request object
   * @param {Object} response Response object
   * @param {Function} next Call to next middleware
   *
   * @memberOf RedFlagsController
   */
  static async show(request, response, next) {
    const recordId = parseInt(request.params.id, 10);

    try {
      const record = await Record.find(recordId);
      return responseHandler(response, [record]);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Create a new red-flag record
   *
   * @static
   * @param {Object} request Request object
   * @param {Object} response Response object
   * @param {Function} next Call to next middleware
   *
   * @memberOf RedFlagsController
   */
  static async create(request, response, next) {
    const { user } = request;
    const userData = request.body;
    userData.createdBy = user.id;

    try {
      const newRecord = new Record(userData);
      const { id } = await newRecord.save();

      const data = [{ id, message: 'Created red-flag record' }];
      return responseHandler(response, data, 201);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Edit the comment of a specific red-flag record
   *
   * @static
   * @param {object} request Request object
   * @param {object} response Response object
   * @param {function} next Call to next middleware
   *
   * @memberOf RedFlagsController
   */
  static async update(request, response, next) {
    const { user } = request;
    const recordId = parseInt(request.params.id, 10);

    try {
      const record = await Record.find(recordId);

      // validate user authorization
      isAuthorized(user, record);

      const recordData = request.body;
      const attribute = (recordData.location) ? 'location' : 'comment';
      const { id } = await record.update(recordData);

      const data = [{
        id: recordId,
        message: `Updated red-flag record's ${attribute}`,
      }];
      return responseHandler(response, data, 202);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Delete a specific red-flag record
   *
   * @static
   * @param {Object} request Request object
   * @param {Object} response Response object
   * @param {Function} next Call to next middleware
   *
   * @memberOf RedFlagsController
   */
  static async destroy(request, response, next) {
    const { user } = request;
    const recordId = parseInt(request.params.id, 10);

    try {
      const record = await Record.find(recordId);

      // validate user authorization
      isAuthorized(user, record);

      await record.delete();
      const data = [{
        id: recordId,
        message: 'Red-flag record has been deleted',
      }];
      return responseHandler(response, data);
    } catch (error) {
      return next(error);
    }
  }
}
