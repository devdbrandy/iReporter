import createError from 'http-errors';
import jwt from 'jsonwebtoken';
import db from '../../models/mock';
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
        data: db.records,
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
    validateRequest(req, next);

    const recordId = parseInt(req.params.id, 10);
    const record = db.records.filter(item => (
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
      db.records.push(newRecord);

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
    validateRequest(req, next);

    jwt.verify(req.token, env('APP_KEY'), (err, decoded) => {
      if (decoded) {
        const { user } = decoded;
        const recordId = parseInt(req.params.id, 10);
        const data = req.body;
        // const records = db.records.map(item => item.toString());

        const record = db.records.find(item => (
          item.id === recordId
        ));

        if (record) {
          if (record.createdBy === user.id || user.isAdmin) {
            record.update(data);
            const attribute = data.location ? 'comment' : 'location';

            res.status(201)
              .json({
                status: 201,
                data: [
                  {
                    id: recordId,
                    message: `Updated red-flag record's ${attribute}`,
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
    validateRequest(req, next);

    jwt.verify(req.token, env('APP_KEY'), (err, decoded) => {
      if (decoded) {
        const { user } = decoded;
        const recordId = parseInt(req.params.id, 10);
        const record = db.records.find(item => (
          item.id === recordId
        ));

        if (record) {
          if (user.id === record.createdBy || user.isAdmin) {
            db.records = db.records.filter(record => (
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
