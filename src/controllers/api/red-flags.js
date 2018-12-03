import createError from 'http-errors';
import jwt from 'jsonwebtoken';
import dbStorage from '../../models/mock';
import { Record } from '../../models';
import { env, validateRequest } from '../../utils';

export default class RedFlagsController {
  /**
   * Fetch all red-flag records
   *
   * @static
   * @param {Object} req Request object
   * @param {Object} res Response object
   * @param {Function} next Call to next middleware
   *
   * @memberOf RedFlagsController
   */
  static index(req, res, next) {
    res.status(200)
      .json({
        status: 200,
        data: dbStorage.records,
      });
  }

  /**
   * Fetch a specific red-flag record
   *
   * @static
   * @param {Object} req Request object
   * @param {Object} res Response object
   * @param {Function} next Call to next middleware
   *
   * @memberOf RedFlagsController
   */
  static show(req, res, next) {
    const recordId = parseInt(req.params.id, 10);
    const record = dbStorage.records.filter(item => (
      item.id === recordId
    ))[0];

    if (record) {
      res.status(200).json({
        status: 200,
        data: [record.toString()],
      });
    } else {
      next(createError(404, 'Resource not found'));
    }
  }

  /**
   * Create a red-flag record
   *
   * @static
   * @param {Object} req Request object
   * @param {Object} res Response object
   * @param {Function} next Call to next middleware
   *
   * @memberOf RedFlagsController
   */
  static create(req, res, next) {
    validateRequest(req, next);

    jwt.verify(req.token, env('APP_KEY'), (err, { user }) => {
      const data = req.body;
      const newRecord = new Record(data);
      newRecord.belongsTo(user);
      dbStorage.records.push(newRecord);

      res.status(201)
        .json({
          status: 201,
          data: [
            {
              id: newRecord.id,
              message: 'Created red-flag record',
            },
          ],
        });
    });
  }

  /**
   * Edit the comment of a specific red-flag record
   *
   * @static
   * @param {Object} req Request object
   * @param {Object} res Response object
   * @param {Function} next Call to next middleware
   *
   * @memberOf RedFlagsController
   */
  static update(req, res, next) {
    jwt.verify(req.token, env('APP_KEY'), (err, decoded) => {
      if (decoded) {
        const { user } = decoded;
        const recordId = parseInt(req.params.id, 10);
        const data = req.body;
        const record = dbStorage.records.filter(item => (
          item.id === recordId
        ))[0];

        if (record) {
          if (user.id === record.createdBy || user.isAdmin) {
            record.update(data);

            res.status(201)
              .json({
                status: 201,
                data: [
                  {
                    id: recordId,
                    message: "Updated red-flag record's comment",
                  },
                ],
              });
          } else {
            next(createError(403, 'Unauthorized'));
          }
        } else {
          next(createError(404, 'Resource not found'));
        }
      }
    });
  }

  /**
   * Edit the location of a specific red-flag record
   *
   * @static
   * @param {Object} req Request object
   * @param {Object} res Response object
   * @param {Function} next Call to next middleware
   *
   * @memberOf RedFlagsController
   */
  static updateLocation(req, res, next) {
    const recordId = parseInt(req.params.id, 10);
    const data = req.body;
    const record = dbStorage.records.filter(item => (
      item.id === recordId
    ))[0];

    if (record) {
      record.updateLocation(data);

      res.status(201)
        .json({
          status: 201,
          data: [
            {
              id: recordId,
              message: "Updated red-flag record's location",
            },
          ],
        });
    } else {
      next(createError(404, 'Resource not found'));
    }
  }

  /**
   * Delete a specific red-flag record
   *
   * @static
   * @param {Object} req Request object
   * @param {Object} res Response object
   * @param {Function} next Call to next middleware
   *
   * @memberOf RedFlagsController
   */
  static destroy(req, res, next) {
    jwt.verify(req.token, env('APP_KEY'), (err, decoded) => {
      if (decoded) {
        const { user } = decoded;
        const recordId = parseInt(req.params.id, 10);
        const record = dbStorage.records.filter(item => (
          item.id === recordId
        ))[0];

        if (record) {
          if (user.id === record.createdBy || user.isAdmin) {
            dbStorage.records = dbStorage.records.filter(record => (
              record.id !== recordId
            ));

            res.status(200)
              .json({
                status: 200,
                data: [
                  {
                    id: recordId,
                    message: 'Red-flag record has been deleted',
                  },
                ],
              });
          } else {
            next(createError(403, 'Unauthorized'));
          }
        } else {
          next(createError(404, 'Resource not found'));
        }
      } else {
        next(createError(403, 'Invalid token provided'));
      }
    });
  }
}
