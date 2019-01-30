import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import path from 'path';
import { Record } from '../models';
import { isAuthorized, responseHandler } from '../utils/helpers';

/**
 * Class representing records controller
 *
 * @export
 * @class RecordsController
 */
export default class RecordsController {
  /**
   * Fetch all red-flag/intervention records
   *
   * @static
   * @async
   * @param {Request} request - Request object
   * @param {Response} response - Response object
   * @param {NextFunction} next - Call to next middleware
   *
   * @memberOf RecordsController
   */
  static async index(request, response, next) {
    const { type, query } = request;
    const { order, published, user } = query;
    let where = [];
    let orderBy = [];

    if (published) where = ['status', '!=', 'draft'];
    if (order) orderBy = ['created_at', order];

    try {
      let records;
      if (user) {
        const userId = parseInt(user, 10);
        records = await Record.where({ user_id: userId }, order);
      } else if (request.path === '/records') {
        records = await Record.all({
          where,
          orderBy,
          join: [{
            fkey: 'user_id',
            ref: 'users',
            as: 'author',
            fields: ['firstname', 'lastname'],
          }],
        });
      } else records = await Record.where({ type }, order);
      return responseHandler(response, records);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Fetch a specific red-flag/intervention record
   *
   * @static
   * @async
   * @param {Request} request - Request object
   * @param {Response} response - Response object
   * @param {NextFunction} next - Call to next middleware
   *
   * @memberOf RecordsController
   */
  static async show(request, response, next) {
    const { type } = request;
    const id = parseInt(request.params.id, 10);

    try {
      const record = await Record.where({ id, type });
      if (record.length === 0) throw createError(404, 'Resource not found.');
      return responseHandler(response, record);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Create a new red-flag/intervention record
   *
   * @static
   * @param {Request} request - Request object
   * @param {Response} response - Response object
   * @param {NextFunction} next - Call to next middleware
   *
   * @memberOf RecordsController
   */
  static async create(request, response, next) {
    const {
      user,
      type,
      body,
    } = request;

    const images = [];
    const videos = [];
    const { media } = body;
    if (media) {
      media.forEach((url) => {
        const extension = path.extname(url).toString();
        if (extension.match(/\.(jpg|jpeg|png|gif)$/)) {
          images.push(url);
        }
      });
    }

    try {
      const { id } = await Record.create({
        createdBy: user.id,
        type,
        location: body.location,
        images,
        videos,
        title: body.title,
        comment: body.comment,
        status: body.status || 'draft',
      });
      const data = [{ id, message: `Created ${type} record.` }];
      return responseHandler(response, data, 201);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Update a specific record
   *
   * @static
   * @async
   * @param {Request} request - Request object
   * @param {Response} response - Response object
   * @param {NextFunction} next - Call to next middleware
   *
   * @memberOf RecordsController
   */
  static async update(request, response, next) {
    const {
      user,
      type,
      body,
      route,
    } = request;
    const [attribute] = route.path.split('/').slice(3);

    const id = parseInt(request.params.id, 10);

    try {
      const record = await Record.find({ id, type });
      if (!record) throw createError(404, 'Resource not found.');

      isAuthorized(user, record);

      const { images } = record;
      const { media } = body;
      if (media) {
        media.forEach((url) => {
          const extension = path.extname(url).toString();
          if (extension.match(/\.(jpg|jpeg|png|gif)$/)) {
            images.push(url);
          }
        });
        body.images = images;
      }

      await record.update(body);
      const data = [{
        id,
        message: `Updated ${type} record's ${attribute || 'details.'}`,
      }];
      return responseHandler(response, data);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Delete a specific record
   *
   * @static
   * @async
   * @param {Request} request - Request object
   * @param {Response} response - Response object
   * @param {MextFunction} next - Call to next middleware
   *
   * @memberOf RecordsController
   */
  static async destroy(request, response, next) {
    const { user, type } = request;
    const id = parseInt(request.params.id, 10);

    try {
      const record = await Record.find({ id, type });
      if (!record) throw createError(404, 'Resource not found.');
      if (!record.belongsTo(user) && !user.isAdmin) {
        throw createError(403, 'Forbidden');
      }

      await record.delete();
      const data = [{
        id,
        message: `${type} record has been deleted.`,
      }];
      return responseHandler(response, data);
    } catch (error) {
      return next(error);
    }
  }
}
