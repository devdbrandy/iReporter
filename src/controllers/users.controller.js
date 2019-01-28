import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import jwt from 'jsonwebtoken';
import { User } from '../models';
import { responseHandler, alreadyTaken, handleConflictResponse } from '../utils/helpers';
import { env } from '../utils';

/**
 * Class representing users controller
 *
 * @export
 * @class UsersController
 */
export default class UsersController {
  /**
   * Fetch all users
   *
   * @static
   * @param {Request} request - Request object
   * @param {Response} response - Response object
   * @param {NextFunction} next - Call to next middleware
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
   * @param {Request} request - Request object
   * @param {Response} response - Response object
   * @param {NextFunction} next - Call to next middleware
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
   * @param {Request} request - Request object
   * @param {Response} response - Response object
   * @param {NextFunction} next - Call to next middleware
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
   * @param {Request} request - Request object
   * @param {Response} response - Response object
   * @param {NextFunction} next - Call to next middleware
   *
   * @memberOf UsersController
   */
  static async update(request, response, next) {
    const id = parseInt(request.params.id, 10);
    const { body, user: auth } = request;

    try {
      const user = await User.find({ id });
      if (!user) throw createError(404, 'Resource not found.');

      // Validate user authorization
      if (auth.id !== user.id && !auth.isAdmin) {
        throw createError(403, 'Operation is forbidden.');
      }

      const updatedUser = await user.update({
        firstname: body.firstname || user.firstname,
        lastname: body.lastname || user.lastname,
        othernames: body.othernames || user.othernames,
        phoneNumber: body.phoneNumber || user.phoneNumber,
        gender: body.gender || user.gender,
        avatar: body.avatar || user.avatar,
        bio: body.bio || user.bio,
      });
      const token = jwt.sign({ user }, env('APP_KEY'));
      const payload = { token, user: updatedUser };
      const data = [{
        message: 'User profile successfully updated.',
        payload,
      }];
      return responseHandler(response, data);
    } catch (error) {
      return next(error);
    }
  }
}
