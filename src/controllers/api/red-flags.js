import createError from 'http-errors';
import { validationResult } from 'express-validator/check';
import dbStorage from '../../models/mock';
import { Record } from '../../models';

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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      next(createError(422, '', { errors: errors.array() }));
    }

    const data = req.body;
    const newRecord = new Record(data);
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
    const recordId = parseInt(req.params.id, 10);
    const data = req.body;
    const record = dbStorage.records.filter(item => (
      item.id === recordId
    ))[0];

    if (record) {
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
      next(createError(404, 'Resource not found'));
    }
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
    const recordId = parseInt(req.params.id, 10);
    dbStorage.records = dbStorage.records.filter(record => (
      record.id === recordId
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
  }
}
