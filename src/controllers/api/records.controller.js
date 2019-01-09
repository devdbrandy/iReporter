import createError from 'http-errors';
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
    const { type } = request;

    try {
      const records = await Record.where({ type });
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
    const { type } = request;
    const id = parseInt(request.params.id, 10);

    try {
      const record = await Record.where({ id, type });
      if (record.length === 0) throw createError(404, 'Resource not found');
      return responseHandler(response, record);
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
    const { user, type, body } = request;

    try {
      const { id } = await Record.create({
        createdBy: user.id,
        type,
        location: body.location,
        images: body.images,
        videos: body.videos,
        title: body.title,
        comment: body.comment,
      });
      const data = [{ id, message: `Created ${type} record` }];
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
    const {
      user,
      type,
      body: recordData,
      route,
    } = request;
    const { path } = route;
    const [attribute] = path.split('/').slice(3);

    const id = parseInt(request.params.id, 10);

    try {
      const record = await Record.find({ id, type });
      if (!record) throw createError(404, 'Resource not found');

      isAuthorized(user, record);

      await record.update(recordData);
      const data = [{
        id,
        message: `Updated ${type} record's ${attribute}`,
      }];
      return responseHandler(response, data);
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
    const { user, type } = request;
    const id = parseInt(request.params.id, 10);

    try {
      const record = await Record.find({ id, type });
      if (!record) throw createError(404, 'Resource not found');

      isAuthorized(user, record);

      await record.delete();
      const data = [{
        id,
        message: `${type} record has been deleted`,
      }];
      return responseHandler(response, data);
    } catch (error) {
      return next(error);
    }
  }
}
