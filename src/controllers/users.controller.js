import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { User } from '../models';
import { responseHandler, alreadyTaken, handleConflictResponse } from '../utils/helpers';

export default class UsersController {
  /**
   * Fetch all users
   *
   * @static
   * @param {Request} request Request object
   * @param {Response} response Response object
   * @param {NextFunction} next Call to next middleware
   *
   * @memberOf UsersController
   */
  static async index(request, response, next) {
    try {
      const users = await User.all();
      return responseHandler(response, users);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Fetch a specific user
   *
   * @static
   * @param {Request} request Request object
   * @param {Response} response Response object
   * @param {NextFunction} next Call to next middleware
   *
   * @memberOf UsersController
   */
  static async show(request, response, next) {
    const id = parseInt(request.params.id, 10);

    try {
      const user = await User.find({ id });
      if (!user) throw createError(404, 'Resource not found');
      return responseHandler(response, [user]);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Create new user
   *
   * @static
   * @param {Request} request Request object
   * @param {Response} response Response object
   * @param {NextFunction} next Call to next middleware
   *
   * @memberOf UsersController
   */
  static async create(request, response, next) {
    const { body } = request;

    try {
      const { email, username } = body;
      if (await alreadyTaken({ email })) {
        return handleConflictResponse('Email address', next);
      }
      if (await alreadyTaken({ username })) {
        return handleConflictResponse('Username', next);
      }

      const user = await User.create(body);
      return responseHandler(response, [user], 201);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Update user resource
   *
   * @static
   * @param {Request} request Request object
   * @param {Response} response Response object
   * @param {NextFunction} next Call to next middleware
   *
   * @memberOf UsersController
   */
  static async update(request, response, next) {
    const id = parseInt(request.params.id, 10);
    const { body, user: auth } = request;

    try {
      const user = await User.find({ id });
      if (!user) throw createError(404, 'Resource not found');

      // Validate user authorization
      if (auth.id !== user.id && !auth.isAdmin) {
        throw createError(403, 'Operation is forbidden');
      }

      await user.update({
        firstname: body.firstname || user.firstname,
        lastname: body.lastname || user.lastname,
        othernames: body.othernames || user.othernames,
        phoneNumber: body.phoneNumber || user.phoneNumber,
      });
      const data = [{
        id,
        message: 'User profile successfully updated',
      }];
      return responseHandler(response, data);
    } catch (error) {
      return next(error);
    }
  }
}
