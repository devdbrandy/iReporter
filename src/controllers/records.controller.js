import { Request, Response } from 'express';
import createError from 'http-errors';
import path from 'path';
import { Record } from '../models';
import { isAuthorized, responseHandler } from '../utils/helpers';

export default class RecordsController {
  /**
   * Fetch all red-flag/intervention records
   *
   * @static
   * @param {Request} request Request object
   * @param {Response} response Response object
   * @param {Function} next Call to next middleware
   *
   * @memberOf RecordsController
   */
  static async index(request, response, next) {
    const { type } = request;

    try {
      let records;
      if (request.params.id) {
        const userId = parseInt(request.params.id, 10);
        records = await Record.where({ user_id: userId });
      } else if (request.path === '/records') {
        records = await Record.all({
          join: [{
            fkey: 'user_id',
            ref: 'users',
            as: 'author',
            fields: ['firstname', 'lastname'],
          }],
        });
      } else records = await Record.where({ type });
      return responseHandler(response, records);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Fetch a specific red-flag/intervention record
   *
   * @static
   * @param {Request} request Request object
   * @param {Response} response Response object
   * @param {Function} next Call to next middleware
   *
   * @memberOf RecordsController
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
   * Create a new red-flag/intervention record
   *
   * @static
   * @param {Request} request Request object
   * @param {Response} response Response object
   * @param {Function} next Call to next middleware
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
      const data = [{ id, message: `Created ${type} record` }];
      return responseHandler(response, data, 201);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Update a specific record
   *
   * @static
   * @param {Request} request Request object
   * @param {Response} response Response object
   * @param {Function} next Call to next middleware
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
    const { path } = route;
    const [attribute] = path.split('/').slice(3);

    const id = parseInt(request.params.id, 10);

    try {
      const record = await Record.find({ id, type });
      if (!record) throw createError(404, 'Resource not found');

      isAuthorized(user, record);

      await record.update(body);
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
   * Delete a specific record
   *
   * @static
   * @param {Request} request Request object
   * @param {Response} response Response object
   * @param {Function} next Call to next middleware
   *
   * @memberOf RecordsController
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
